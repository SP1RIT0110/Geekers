import { X, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { ApplicationWithScheme } from "@shared/schema";

interface ApplicationTrackerProps {
  applications: ApplicationWithScheme[];
  isOpen: boolean;
  onClose: () => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "rejected":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "under_review":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    default:
      return <Clock className="h-4 w-4 text-blue-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "under_review":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-blue-100 text-blue-800";
  }
};

const formatStatus = (status: string) => {
  switch (status) {
    case "under_review":
      return "Under Review";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

export function ApplicationTracker({ applications, isOpen, onClose }: ApplicationTrackerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-96 overflow-y-auto"
        data-testid="dialog-application-tracker"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Your Applications
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              data-testid="button-close-applications"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {applications.length === 0 ? (
            <div
              className="text-center py-8 text-gray-500"
              data-testid="text-no-applications"
            >
              No applications found
            </div>
          ) : (
            applications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                data-testid={`row-application-${application.id}`}
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(application.status)}
                  <div>
                    <h4
                      className="font-medium text-neutral"
                      data-testid={`text-application-scheme-${application.id}`}
                    >
                      {application.scheme?.name || "Scheme name unavailable"}
                    </h4>
                    <p
                      className="text-sm text-gray-600"
                      data-testid={`text-application-date-${application.id}`}
                    >
                      Applied on{" "}
                      {application?.appliedAt
                        ? new Date(application.appliedAt).toLocaleDateString("en-IN")
                        : "Date not available"}
                    </p>
                  </div>
                </div>
                <Badge
                  className={getStatusColor(application.status)}
                  data-testid={`badge-status-${application.id}`}
                >
                  {formatStatus(application.status)}
                </Badge>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
