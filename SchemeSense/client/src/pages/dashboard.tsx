import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, ChevronDown, List, UserCog, Bot, Plus } from "lucide-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/header";
import { UserProfile } from "@/components/user-profile";
import { SchemeCard } from "@/components/scheme-card";
import { AIRecommendations } from "@/components/ai-recommendations";
import { ApplicationTracker } from "@/components/application-tracker";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import type { User } from "@shared/schema";

// Mock user for demo - in real app this would come from auth
const MOCK_USER_ID = "user-1";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [showApplications, setShowApplications] = useState(false);
  const [displayCount, setDisplayCount] = useState(6); // Show 6 schemes initially
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();

  // State for manual recommendation management
  const [recommendationsData, setRecommendationsData] = useState<any>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  // Manual fetch function
  const fetchRecommendations = async () => {
    if (!currentUser) return;
    
    setIsLoadingRecommendations(true);
    try {
      const response = await fetch(`/api/users/${MOCK_USER_ID}/recommendations?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      const data = await response.json();
      setRecommendationsData(data);
      console.log('Fresh recommendations loaded:', data.timestamp, data.aiRecommendation?.substring(0, 100));
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  // Initialize user if not exists
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const user = await api.getUser(MOCK_USER_ID);
        setCurrentUser(user);
      } catch (error) {
        // Create user if doesn't exist
        try {
          const newUser = await api.createUser({
            name: "Raj Kumar",
            occupation: "Software Engineer",
            age: 28,
            salary: 800000,
            state: "Karnataka"
          });
          setCurrentUser(newUser);
        } catch (createError) {
          console.error("Error creating user:", createError);
        }
      }
    };

    if (!currentUser) {
      initializeUser();
    }
  }, []);

  // Load recommendations when user is available
  useEffect(() => {
    if (currentUser && !recommendationsData) {
      fetchRecommendations();
    }
  }, [currentUser]);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(6);
  }, [searchQuery, activeFilter, sortBy]);

  // Fetch user applications
  const { data: applications = [] } = useQuery({
    queryKey: ["/api/users", MOCK_USER_ID, "applications"],
    enabled: !!currentUser,
  });

  // Apply to scheme mutation
  const applyMutation = useMutation({
    mutationFn: (schemeId: string) => api.createApplication({
      userId: MOCK_USER_ID,
      schemeId,
      status: "pending"
    }),
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", MOCK_USER_ID, "applications"] });
    },
    onError: (error: any) => {
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const schemes = (recommendationsData as any)?.schemes || [];
  const aiRecommendation = (recommendationsData as any)?.aiRecommendation;
  
  // Debug logging to see what we're getting
  console.log('Recommendations data timestamp:', (recommendationsData as any)?.timestamp);
  console.log('AI Recommendation content:', aiRecommendation?.substring(0, 100) + '...');
  
  // Filter and sort schemes
  const filteredSchemes = schemes.filter((scheme: any) => {
    if (activeFilter === "all") return true;
    return scheme.category.toLowerCase() === activeFilter;
  }).filter((scheme: any) => {
    if (!searchQuery) return true;
    return scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
  }).sort((a: any, b: any) => {
    switch (sortBy) {
      case "deadline":
        return a.deadline.localeCompare(b.deadline);
      case "benefit":
        return b.benefit.localeCompare(a.benefit);
      default:
        return b.matchPercentage - a.matchPercentage;
    }
  });

  const applicationsArray = (applications as any) || [];
  const stats = {
    eligible: schemes.length,
    applied: applicationsArray.length,
    approved: applicationsArray.filter((app: any) => app.status === "approved").length,
  };

  const hasUserApplied = (schemeId: string) => {
    return applicationsArray.some((app: any) => app.schemeId === schemeId);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-light-gray">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <Header user={{ name: currentUser.name, initials: currentUser.name.split(' ').map(n => n[0]).join('') }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar - User Profile */}
          <div className="lg:col-span-1">
            <UserProfile 
              user={currentUser}
              stats={stats}
              onUpdateRecommendations={() => fetchRecommendations()}
              isUpdatingRecommendations={isLoadingRecommendations}
            />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Search Bar */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      placeholder="Search government schemes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      data-testid="input-search-schemes"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <Button data-testid="button-search">
                    Search
                  </Button>
                </div>
                
                {/* Filters */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {[
                    { key: "all", label: "All Categories" },
                    { key: "employment", label: "Employment" },
                    { key: "education", label: "Education" },
                    { key: "housing", label: "Housing" },
                    { key: "business", label: "Business" }
                  ].map((filter) => (
                    <Button
                      key={filter.key}
                      variant={activeFilter === filter.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter(filter.key)}
                      data-testid={`button-filter-${filter.key}`}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* AI Recommendations */}
            <div className="mb-6">
              <AIRecommendations 
                key={(recommendationsData as any)?.timestamp || 'default'}
                recommendation={aiRecommendation}
                isLoading={isLoadingRecommendations}
                onRefresh={() => {
                  fetchRecommendations();
                  toast({
                    title: "Getting fresh recommendations...",
                    description: "This will take a few seconds as we generate personalized suggestions",
                  });
                }}
              />
            </div>
            
            {/* Scheme List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-neutral">Recommended Schemes</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32" data-testid="select-sort-schemes">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                      <SelectItem value="benefit">Benefit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {filteredSchemes.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500" data-testid="text-no-schemes">
                      {searchQuery || activeFilter !== "all" 
                        ? "No schemes match your current filters." 
                        : "No schemes available."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredSchemes.slice(0, displayCount).map((scheme: any) => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    onApply={(schemeId) => applyMutation.mutate(schemeId)}
                    isApplying={applyMutation.isPending}
                    hasApplied={hasUserApplied(scheme.id)}
                  />
                ))
              )}
              
              {filteredSchemes.length > displayCount && (
                <div className="text-center mt-6">
                  <Button 
                    variant="outline" 
                    data-testid="button-load-more"
                    onClick={() => setDisplayCount(prev => prev + 6)}
                  >
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Load More Schemes ({filteredSchemes.length - displayCount} remaining)
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Application Tracker Modal */}
      <ApplicationTracker
        applications={applicationsArray}
        isOpen={showApplications}
        onClose={() => setShowApplications(false)}
      />
      
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <div className="relative group">
          <Button 
            className="w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-all duration-300"
            data-testid="button-quick-actions"
          >
            <Plus className="h-5 w-5" />
          </Button>
          
          {/* Quick Actions Menu */}
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
            <Button 
              variant="ghost" 
              className="flex items-center w-full px-4 py-2 text-left justify-start"
              onClick={() => setShowApplications(true)}
              data-testid="button-view-applications"
            >
              <List className="h-4 w-4 mr-3" />
              <span className="text-sm">My Applications</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex items-center w-full px-4 py-2 text-left justify-start"
              asChild
              data-testid="button-update-profile"
            >
              <Link href="/profile">
                <UserCog className="h-4 w-4 mr-3" />
                <span className="text-sm">Update Profile</span>
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              className="flex items-center w-full px-4 py-2 text-left justify-start"
              onClick={() => {
                fetchRecommendations();
                toast({
                  title: "Getting fresh recommendations...",
                  description: "This will take a few seconds as we generate personalized suggestions",
                });
              }}
              disabled={isLoadingRecommendations}
              data-testid="button-ask-ai"
            >
              <Bot className="h-4 w-4 mr-3" />
              <span className="text-sm">{isLoadingRecommendations ? "Getting AI..." : "Ask AI"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
