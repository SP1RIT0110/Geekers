import { apiRequest } from "./queryClient";
import type { User, InsertUser, Scheme, Application, InsertApplication, SchemeWithMatch, ApplicationWithScheme } from "@shared/schema";

export const api = {
  // User APIs
  async createUser(userData: InsertUser): Promise<User> {
    const response = await apiRequest("POST", "/api/users", userData);
    return response.json();
  },

  async getUser(id: string): Promise<User> {
    const response = await apiRequest("GET", `/api/users/${id}`);
    return response.json();
  },

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User> {
    const response = await apiRequest("PUT", `/api/users/${id}`, userData);
    return response.json();
  },

  // Scheme APIs
  async getSchemes(filters?: { category?: string; search?: string }): Promise<Scheme[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.search) params.append("search", filters.search);
    
    const url = `/api/schemes${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await apiRequest("GET", url);
    return response.json();
  },

  async getScheme(id: string): Promise<Scheme> {
    const response = await apiRequest("GET", `/api/schemes/${id}`);
    return response.json();
  },

  async getRecommendations(userId: string): Promise<{
    schemes: SchemeWithMatch[];
    aiRecommendation: string;
    user: User;
  }> {
    const response = await apiRequest("GET", `/api/users/${userId}/recommendations`);
    return response.json();
  },

  // Application APIs
  async createApplication(applicationData: InsertApplication): Promise<Application> {
    const response = await apiRequest("POST", "/api/applications", applicationData);
    return response.json();
  },

  async getUserApplications(userId: string): Promise<ApplicationWithScheme[]> {
    const response = await apiRequest("GET", `/api/users/${userId}/applications`);
    return response.json();
  },

  async updateApplicationStatus(id: string, status: string): Promise<Application> {
    const response = await apiRequest("PUT", `/api/applications/${id}/status`, { status });
    return response.json();
  },
};
