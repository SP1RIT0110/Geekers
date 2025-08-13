import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, DollarSign, Calendar, Users, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/header";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { Link, useRoute } from "wouter";

// Mock user ID - in real app this would come from auth
const MOCK_USER_ID = "user-1";

export default function SchemeDetails() {
  const [, params] = useRoute("/scheme/:id");
  const schemeId = params?.id;
  const { toast } = useToast();

  // Local state for "Coming Soon" popup
  const [showComingSoon, setShowComingSoon] = useState(false);

  const { data: scheme, isLoading } = useQuery({
    queryKey: ["/api/schemes", schemeId],
    enabled: !!schemeId,
  });

  const { data: applications = [] } = useQuery({
    queryKey: ["/api/users", MOCK_USER_ID, "applications"],
  });

  const applyMutation = useMutation({
    mutationFn: () =>
      api.createApplication({
        userId: MOCK_USER_ID,
        schemeId: schemeId!,
        status: "pending",
      }),
    onSuccess: () => {
      toast({
        title: "Added to Wishlist",
        description: "This scheme has been added to your wishlist.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/users", MOCK_USER_ID, "applications"],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Action Failed",
        description: error.message || "Failed to add to wishlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-gray">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading scheme details...</p>
          </div>
        </div>
      </div>
    );
  }

  const schemeData = scheme as any;
  if (!schemeData) {
    return (
      <div className="min-h-screen bg-light-gray">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Scheme not found</p>
              <Button asChild className="mt-4">
                <Link href="/">Back to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const applicationsArray = applications as any;
  const hasApplied =
    applicationsArray.some &&
    applicationsArray.some((app: any) => app.schemeId === schemeId);
  const application =
    applicationsArray.find &&
    applicationsArray.find((app: any) => app.schemeId === schemeId);

  return (
    <div className="min-h-screen bg-light-gray">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild data-testid="button-back-dashboard">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2" data-testid="text-scheme-title">
                  {schemeData?.name}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" data-testid="badge-scheme-category">
                    {schemeData?.category}
                  </Badge>
                  {Array.isArray(schemeData?.states) &&
                    schemeData.states.length > 0 &&
                    schemeData.states[0] !== "All States" && (
                      <Badge variant="outline">State Specific</Badge>
                    )}
                  {hasApplied && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      In Wishlist
                    </Badge>
                  )}
                </div>
              </div>

              {!hasApplied && (
                <Button
                  onClick={() => setShowComingSoon(true)}
                  size="lg"
                  data-testid="button-add-wishlist"
                >
                  Add to Wishlist
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-gray-600 leading-relaxed" data-testid="text-scheme-description">
              {schemeData?.description}
            </p>

            <Separator />

            {/* Key Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-secondary" />
                <div>
                  <p className="text-sm text-gray-600">Benefit Amount</p>
                  <p className="font-semibold" data-testid="text-scheme-benefit">
                    {schemeData?.benefit}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-gray-600">Application Deadline</p>
                  <p className="font-semibold" data-testid="text-scheme-deadline">
                    {schemeData?.deadline}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-semibold" data-testid="text-scheme-category">
                    {schemeData?.category}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Eligibility Criteria */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Eligibility Criteria</h3>
              <ul className="space-y-2" data-testid="list-eligibility-criteria">
                {Array.isArray(schemeData?.eligibility) &&
                  schemeData.eligibility.map((criteria: any, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{criteria}</span>
                    </li>
                  ))}
              </ul>
            </div>

            <Separator />

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Income Limit</h4>
                <p className="text-gray-600" data-testid="text-income-limit">
                  {schemeData?.maxIncome
                    ? `Up to ₹${schemeData.maxIncome.toLocaleString()}`
                    : "No limit specified"}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Age Range</h4>
                <p className="text-gray-600" data-testid="text-age-range">
                  {schemeData?.minAge && schemeData?.maxAge
                    ? `${schemeData.minAge} - ${schemeData.maxAge} years`
                    : "No age restrictions"}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Applicable States</h4>
                <p className="text-gray-600" data-testid="text-applicable-states">
                  {Array.isArray(schemeData?.states)
                    ? schemeData.states.join(", ")
                    : "All states"}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Target Occupations</h4>
                <p className="text-gray-600" data-testid="text-target-occupations">
                  {Array.isArray(schemeData?.occupations)
                    ? schemeData.occupations.join(", ")
                    : "All occupations"}
                </p>
              </div>
            </div>

            {/* Wishlist Status */}
            {hasApplied && application && (
              <div>
                <Separator />
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium text-blue-900">Wishlist Status</h4>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-blue-800">
                      Added on{" "}
                      {application?.appliedAt
                        ? new Date(application.appliedAt).toLocaleDateString("en-IN")
                        : "Date not available"}
                    </p>
                    <Badge
                      className="bg-blue-100 text-blue-800"
                      data-testid="badge-application-status"
                    >
                      In Wishlist
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Popup Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold mb-4">Coming Soon</h2>
            <p className="mb-6">
              The wishlist saving feature will be available soon. Please check back later.
            </p>
            <Button onClick={() => setShowComingSoon(false)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}
