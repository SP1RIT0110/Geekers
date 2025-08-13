import { useState } from "react";
import { Edit, Briefcase, Calendar, DollarSign, MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import type { User } from "@shared/schema";

interface UserProfileProps {
  user: User;
  stats?: {
    eligible: number;
    applied: number;
    approved: number;
  };
  onUpdateRecommendations?: () => void;
  isUpdatingRecommendations?: boolean;
}

export function UserProfile({ 
  user, 
  stats = { eligible: 0, applied: 0, approved: 0 },
  onUpdateRecommendations,
  isUpdatingRecommendations = false
}: UserProfileProps) {
  const formatSalary = (salary: number) => {
    return `₹${salary.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-neutral">Your Profile</h2>
            <Button 
              variant="ghost" 
              size="sm"
              asChild
              data-testid="button-edit-profile"
            >
              <Link href="/profile">
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <Briefcase className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-800" data-testid="text-user-occupation">{user.occupation}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-800" data-testid="text-user-age">{user.age} years</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Salary</label>
              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-800" data-testid="text-user-salary">{formatSalary(user.salary)}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-800" data-testid="text-user-state">{user.state}</span>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full mt-6" 
            onClick={onUpdateRecommendations}
            disabled={isUpdatingRecommendations}
            data-testid="button-update-recommendations"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isUpdatingRecommendations ? 'animate-spin' : ''}`} />
            Update Recommendations
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats Card */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-neutral mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Eligible Schemes</span>
              <span className="font-semibold text-secondary" data-testid="text-stats-eligible">{stats.eligible}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Applied</span>
              <span className="font-semibold text-accent" data-testid="text-stats-applied">{stats.applied}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Approved</span>
              <span className="font-semibold text-secondary" data-testid="text-stats-approved">{stats.approved}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
