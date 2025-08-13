import { type User, type InsertUser, type Scheme, type InsertScheme, type Application, type InsertApplication, type ApplicationWithScheme, type SchemeWithMatch } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;

  // Scheme methods
  getAllSchemes(): Promise<Scheme[]>;
  getScheme(id: string): Promise<Scheme | undefined>;
  getSchemesByCategory(category: string): Promise<Scheme[]>;
  searchSchemes(query: string): Promise<Scheme[]>;
  getRecommendedSchemes(userId: string): Promise<SchemeWithMatch[]>;

  // Application methods
  createApplication(application: InsertApplication): Promise<Application>;
  getUserApplications(userId: string): Promise<ApplicationWithScheme[]>;
  getApplication(id: string): Promise<Application | undefined>;
  updateApplicationStatus(id: string, status: string): Promise<Application | undefined>;
  hasUserApplied(userId: string, schemeId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private schemes: Map<string, Scheme>;
  private applications: Map<string, Application>;

  constructor() {
    this.users = new Map();
    this.schemes = new Map();
    this.applications = new Map();
    this.initializeSchemes();
  }

  private initializeSchemes() {
    const schemes: Scheme[] = [
      {
        id: "pmay-urban",
        name: "Pradhan Mantri Awas Yojana - Urban",
        description: "Affordable housing scheme for first-time home buyers in urban areas. Provides interest subsidy on home loans for middle income groups.",
        category: "Housing",
        benefit: "₹2,67,280",
        deadline: "31 Mar 2025",
        eligibility: ["Annual income between ₹6,00,001 - ₹18,00,000", "First-time home buyer", "Age 18-70 years", "Property in urban area"],
        maxIncome: 1800000,
        minAge: 18,
        maxAge: 70,
        states: ["All States"],
        occupations: ["All Occupations"],
        isActive: true,
      },
      {
        id: "digital-india",
        name: "Digital India Land Records Modernization",
        description: "IT sector employment scheme providing opportunities for software professionals in government digitization projects across various states.",
        category: "Employment",
        benefit: "₹75,000",
        deadline: "15 Apr 2025",
        eligibility: ["Bachelor's degree in Computer Science/IT", "2+ years of software development experience", "Age 21-35 years", "Indian citizen"],
        maxIncome: 2000000,
        minAge: 21,
        maxAge: 35,
        states: ["All States"],
        occupations: ["Software Engineer", "Software Developer", "IT Professional"],
        isActive: true,
      },
      {
        id: "karnataka-it",
        name: "Karnataka IT Investment Policy",
        description: "State government initiative to promote startup ecosystem and provide tax benefits for IT professionals starting their own ventures in Karnataka.",
        category: "Business",
        benefit: "100% for 5 years",
        deadline: "Year Round",
        eligibility: ["IT/Tech startup in Karnataka", "Minimum investment of ₹10 lakhs", "Create at least 5 jobs", "Register within 2 years of incorporation"],
        maxIncome: null,
        minAge: 21,
        maxAge: null,
        states: ["Karnataka"],
        occupations: ["Software Engineer", "IT Professional", "Entrepreneur"],
        isActive: true,
      },
      {
        id: "skill-development",
        name: "Pradhan Mantri Kaushal Vikas Yojana",
        description: "Skill development and training program for unemployed and underemployed youth.",
        category: "Education",
        benefit: "Free Training + ₹8,000 stipend",
        deadline: "Ongoing",
        eligibility: ["Age 18-45 years", "Indian citizen", "School dropout or unemployed", "Below poverty line or economically weaker section"],
        maxIncome: 500000,
        minAge: 18,
        maxAge: 45,
        states: ["All States"],
        occupations: ["All Occupations"],
        isActive: true,
      },
      // Add more schemes that AI commonly recommends
      {
        id: "pm-kisan",
        name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        description: "Direct income support scheme providing ₹6,000 per year to landholding farmers across India.",
        category: "Agriculture",
        benefit: "₹6,000 per year",
        deadline: "Year Round",
        eligibility: ["Landholding farmers", "Valid land documents", "Aadhaar card mandatory", "Bank account required"],
        maxIncome: null,
        minAge: 18,
        maxAge: null,
        states: ["All States"],
        occupations: ["Farmer", "Agriculture Worker"],
        isActive: true,
      },
      {
        id: "crop-insurance",
        name: "Pradhan Mantri Fasal Bima Yojana",
        description: "Comprehensive crop insurance scheme providing financial support against crop loss due to natural calamities.",
        category: "Agriculture",
        benefit: "90% premium subsidy",
        deadline: "Before sowing season",
        eligibility: ["All farmers", "Landowner or tenant", "Valid crop loan or self-financing"],
        maxIncome: null,
        minAge: 18,
        maxAge: null,
        states: ["All States"],
        occupations: ["Farmer", "Agriculture Worker"],
        isActive: true,
      },
      {
        id: "mudra-loan",
        name: "Pradhan Mantri MUDRA Yojana",
        description: "Micro-financing scheme providing collateral-free loans to small business entrepreneurs and startups.",
        category: "Business",
        benefit: "Loans up to ₹10 lakhs",
        deadline: "Year Round",
        eligibility: ["Small business/startup", "Non-agricultural activities", "Indian citizen", "Valid business plan"],
        maxIncome: 1000000,
        minAge: 18,
        maxAge: null,
        states: ["All States"],
        occupations: ["Entrepreneur", "Small Business Owner", "Self Employed"],
        isActive: true,
      },
      {
        id: "scholarship-scheme",
        name: "National Scholarship Portal (NSP)",
        description: "Centralized scholarship portal offering various scholarships for students from different economic backgrounds.",
        category: "Education",
        benefit: "₹10,000 to ₹2,00,000",
        deadline: "October 31 annually",
        eligibility: ["Merit-based selection", "Income criteria varies", "Regular student", "Indian citizen"],
        maxIncome: 800000,
        minAge: 16,
        maxAge: 30,
        states: ["All States"],
        occupations: ["Student"],
        isActive: true,
      },
      {
        id: "ayushman-bharat",
        name: "Ayushman Bharat - PM Jan Arogya Yojana",
        description: "World's largest health insurance scheme providing cashless treatment coverage for poor families.",
        category: "Healthcare",
        benefit: "₹5 lakh health cover",
        deadline: "Year Round",
        eligibility: ["SECC 2011 beneficiaries", "Rural and urban poor", "Priority households"],
        maxIncome: 180000,
        minAge: null,
        maxAge: null,
        states: ["All States"],
        occupations: ["All Occupations"],
        isActive: true,
      },
      {
        id: "pmkvy",
        name: "Pradhan Mantri Kaushal Vikas Yojana",
        description: "Flagship skill development scheme designed to enable youth to take up industry-relevant skill training.",
        category: "Employment",
        benefit: "Free training + certification",
        deadline: "Ongoing",
        eligibility: ["Age 18-45 years", "Indian citizen", "Unemployed or underemployed"],
        maxIncome: 500000,
        minAge: 18,
        maxAge: 45,
        states: ["All States"],
        occupations: ["All Occupations"],
        isActive: true,
      },
    ];

    schemes.forEach(scheme => {
      this.schemes.set(scheme.id, scheme);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = "user-1"; // Use fixed ID for demo
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updateUser: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;

    const updatedUser: User = { ...existingUser, ...updateUser };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllSchemes(): Promise<Scheme[]> {
    return Array.from(this.schemes.values()).filter(scheme => scheme.isActive);
  }

  async getScheme(id: string): Promise<Scheme | undefined> {
    return this.schemes.get(id);
  }

  async getSchemesByCategory(category: string): Promise<Scheme[]> {
    return Array.from(this.schemes.values()).filter(
      scheme => scheme.isActive && scheme.category === category
    );
  }

  async searchSchemes(query: string): Promise<Scheme[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.schemes.values()).filter(
      scheme => 
        scheme.isActive && 
        (scheme.name.toLowerCase().includes(searchTerm) || 
         scheme.description.toLowerCase().includes(searchTerm) ||
         scheme.category.toLowerCase().includes(searchTerm))
    );
  }

  async getRecommendedSchemes(userId: string): Promise<SchemeWithMatch[]> {
    const user = this.users.get(userId);
    if (!user) return [];

    const allSchemes = await this.getAllSchemes();
    
    return allSchemes.map(scheme => {
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
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = randomUUID();
    const now = new Date();
    const application: Application = {
      id,
      userId: insertApplication.userId,
      schemeId: insertApplication.schemeId,
      status: insertApplication.status || "pending",
      appliedAt: now,
      updatedAt: now,
    };
    this.applications.set(id, application);
    return application;
  }

  async getUserApplications(userId: string): Promise<ApplicationWithScheme[]> {
    const userApplications = Array.from(this.applications.values()).filter(
      app => app.userId === userId
    );

    return userApplications.map(app => {
      const scheme = this.schemes.get(app.schemeId);
      return {
        ...app,
        scheme: scheme!,
      };
    });
  }

  async getApplication(id: string): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async updateApplicationStatus(id: string, status: string): Promise<Application | undefined> {
    const application = this.applications.get(id);
    if (!application) return undefined;

    const updatedApplication: Application = {
      ...application,
      status,
      updatedAt: new Date(),
    };
    this.applications.set(id, updatedApplication);
    return updatedApplication;
  }

  async hasUserApplied(userId: string, schemeId: string): Promise<boolean> {
    return Array.from(this.applications.values()).some(
      app => app.userId === userId && app.schemeId === schemeId
    );
  }
}

export const storage = new MemStorage();
