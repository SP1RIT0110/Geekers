import { DollarSign, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SchemeWithMatch } from "@shared/schema";
import { Link } from "wouter";

interface SchemeCardProps {
  scheme: SchemeWithMatch;
  onApply?: (schemeId: string) => void;
  isApplying?: boolean;
  hasApplied?: boolean;
}

export function SchemeCard({ scheme, onApply, isApplying = false, hasApplied = false }: SchemeCardProps) {
  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-100 text-green-800";
    if (percentage >= 80) return "bg-blue-100 text-blue-800";
    if (percentage >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="hover:shadow-md transition-shadow" data-testid={`card-scheme-${scheme.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-semibold text-neutral mr-3" data-testid={`text-scheme-name-${scheme.id}`}>
                {scheme.name}
              </h3>
              <Badge className={getMatchColor(scheme.matchPercentage)} data-testid={`badge-match-${scheme.id}`}>
                {scheme.matchPercentage}% Match
              </Badge>
              {Array.isArray(scheme.states) && scheme.states.length > 0 && scheme.states[0] !== "All States" && (
                <Badge variant="outline" className="ml-2">
                  State Specific
                </Badge>
              )}
            </div>
            
            <p className="text-gray-600 mb-3 leading-relaxed" data-testid={`text-scheme-description-${scheme.id}`}>
              {scheme.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-secondary mr-2" />
                <div>
                  <span className="block text-sm text-gray-600">Max Benefit</span>
                  <span className="font-semibold text-neutral" data-testid={`text-scheme-benefit-${scheme.id}`}>
                    {scheme.benefit}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-accent mr-2" />
                <div>
                  <span className="block text-sm text-gray-600">Deadline</span>
                  <span className="font-semibold text-neutral" data-testid={`text-scheme-deadline-${scheme.id}`}>
                    {scheme.deadline}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center">
                <Users className="h-4 w-4 text-primary mr-2" />
                <div>
                  <span className="block text-sm text-gray-600">Category</span>
                  <span className="font-semibold text-neutral" data-testid={`text-scheme-category-${scheme.id}`}>
                    {scheme.category}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-neutral mb-2">Eligibility Criteria:</h4>
              <ul className="text-sm text-gray-600 space-y-1" data-testid={`list-scheme-eligibility-${scheme.id}`}>
                {Array.isArray(scheme.eligibility) && scheme.eligibility.map((criteria, index) => (
                  <li key={index}>✓ {criteria}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="ml-6 flex flex-col space-y-2">
            <Button 
              onClick={() => onApply?.(scheme.id)}
              disabled={isApplying || hasApplied}
              data-testid={`button-apply-${scheme.id}`}
            >
              {hasApplied ? "Applied" : isApplying ? "Applying..." : "Apply Now"}
            </Button>
            <Button 
              variant="outline"
              asChild
              data-testid={`button-details-${scheme.id}`}
            >
              <Link href={`/scheme/${scheme.id}`}>
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
