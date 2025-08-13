import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { perplexityService } from "./services/perplexity";
import { SchemeParser } from "./services/schemeParser";
import { insertUserSchema, insertApplicationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const userData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.id, userData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  // Scheme routes
  app.get("/api/schemes", async (req, res) => {
    try {
      const { category, search } = req.query;
      
      let schemes;
      if (search) {
        schemes = await storage.searchSchemes(search as string);
      } else if (category) {
        schemes = await storage.getSchemesByCategory(category as string);
      } else {
        schemes = await storage.getAllSchemes();
      }
      
      res.json(schemes);
    } catch (error) {
      res.status(500).json({ message: "Error fetching schemes", error });
    }
  });

  app.get("/api/schemes/:id", async (req, res) => {
    try {
      const scheme = await storage.getScheme(req.params.id);
      if (!scheme) {
        return res.status(404).json({ message: "Scheme not found" });
      }
      res.json(scheme);
    } catch (error) {
      res.status(500).json({ message: "Error fetching scheme", error });
    }
  });

  app.get("/api/users/:userId/recommendations", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Add cache-control headers to prevent caching
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');

      // Generate AI recommendation first
      const aiRecommendation = await perplexityService.getSchemeRecommendations(user);
      
      // Create user-specific dynamic schemes based on profile
      const dynamicSchemes = SchemeParser.createUserSpecificSchemes(user, aiRecommendation);
      
      // Calculate match percentages for dynamic schemes
      const schemes = dynamicSchemes.map(scheme => {
        let matchPercentage = 0;
        
        // Age matching
        if (scheme.minAge !== null && scheme.maxAge !== null) {
          if (user.age >= scheme.minAge && user.age <= scheme.maxAge) {
            matchPercentage += 30;
          }
        } else {
          matchPercentage += 15;
        }
        
        // Income matching
        if (scheme.maxIncome !== null) {
          if (user.salary <= scheme.maxIncome) {
            matchPercentage += 25;
          }
        } else {
          matchPercentage += 15;
        }
        
        // State matching
        if (scheme.states && Array.isArray(scheme.states)) {
          if (scheme.states.includes("All States") || scheme.states.includes(user.state)) {
            matchPercentage += 20;
          }
        }
        
        // Occupation matching
        if (scheme.occupations && Array.isArray(scheme.occupations)) {
          if (scheme.occupations.includes("All Occupations") || scheme.occupations.includes(user.occupation)) {
            matchPercentage += 25;
          }
        }
        
        return {
          ...scheme,
          matchPercentage: Math.min(matchPercentage, 100),
        };
      }).sort((a, b) => b.matchPercentage - a.matchPercentage);

      console.log(`Generated fresh AI recommendation for ${user.name}: ${aiRecommendation?.substring(0, 100)}...`);
      console.log(`Created ${schemes.length} dynamic schemes from AI recommendation`);

      res.json({
        schemes,
        aiRecommendation,
        user,
        timestamp: new Date().toISOString() // Add timestamp to force fresh data
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching recommendations", error });
    }
  });

  // Application routes
  app.post("/api/applications", async (req, res) => {
    try {
      const applicationData = insertApplicationSchema.parse(req.body);
      
      // Check if user already applied
      const hasApplied = await storage.hasUserApplied(
        applicationData.userId, 
        applicationData.schemeId
      );
      
      if (hasApplied) {
        return res.status(400).json({ message: "You have already applied to this scheme" });
      }

      const application = await storage.createApplication(applicationData);
      res.json(application);
    } catch (error) {
      res.status(400).json({ message: "Invalid application data", error });
    }
  });

  app.get("/api/users/:userId/applications", async (req, res) => {
    try {
      const applications = await storage.getUserApplications(req.params.userId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Error fetching applications", error });
    }
  });

  app.put("/api/applications/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const application = await storage.updateApplicationStatus(req.params.id, status);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Error updating application status", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
