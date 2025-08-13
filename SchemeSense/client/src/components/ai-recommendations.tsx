import { Bot, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AIRecommendationsProps {
  recommendation?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function AIRecommendations({ recommendation, isLoading = false, onRefresh }: AIRecommendationsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Bot className="text-primary text-lg mr-2" />
            <h2 className="text-lg font-semibold text-neutral">AI Recommendations</h2>
            <Badge variant="outline" className="ml-2 text-primary border-primary">
              Powered by Perplexity AI
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                data-testid="button-refresh-ai-recommendations"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
                {isLoading ? "Loading..." : "Refresh"}
              </Button>
            )}
            {isLoading && (
              <div data-testid="loader-ai-recommendations">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="text-sm text-gray-800" data-testid="text-ai-recommendation">
            {isLoading ? (
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                <p className="text-blue-700">Getting personalized recommendations...</p>
              </div>
            ) : recommendation ? (
              <div className="space-y-4">
                {recommendation.split('\n\n').map((section, index) => {
                  // Check if it's a header (starts with ** and ends with **)
                  if (section.startsWith('**') && section.includes(':**')) {
                    const headerMatch = section.match(/\*\*(.*?)\*\*:(.*)/);
                    if (headerMatch) {
                      const [, header, content] = headerMatch;
                      return (
                        <div key={index} className="border-l-4 border-blue-400 pl-4">
                          <h3 className="font-bold text-blue-900 mb-2 text-base">{header}</h3>
                          <div className="space-y-2">
                            {content.trim().split('\n').map((line, lineIndex) => {
                              if (line.trim()) {
                                // Handle numbered lists
                                if (line.match(/^\d+\./)) {
                                  const [, number, text] = line.match(/^(\d+\.)\s*(.*)/) || [];
                                  return (
                                    <div key={lineIndex} className="flex items-start space-x-2 mb-2">
                                      <span className="font-semibold text-blue-700 min-w-[24px]">{number}</span>
                                      <span className="text-gray-700" dangerouslySetInnerHTML={{ 
                                        __html: text?.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-800">$1</strong>') || ''
                                      }} />
                                    </div>
                                  );
                                }
                                // Handle bullet points
                                else if (line.startsWith('-')) {
                                  return (
                                    <div key={lineIndex} className="flex items-start space-x-2 mb-1">
                                      <span className="text-blue-600 mt-1">•</span>
                                      <span className="text-gray-700" dangerouslySetInnerHTML={{ 
                                        __html: line.substring(1).trim().replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-800">$1</strong>')
                                      }} />
                                    </div>
                                  );
                                }
                                // Regular text
                                else {
                                  return (
                                    <p key={lineIndex} className="text-gray-700 mb-1" dangerouslySetInnerHTML={{ 
                                      __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-800">$1</strong>')
                                    }} />
                                  );
                                }
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      );
                    }
                  }
                  
                  // Regular paragraph
                  return (
                    <div key={index} className="text-gray-700 leading-relaxed">
                      <p dangerouslySetInnerHTML={{ 
                        __html: section.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-800">$1</strong>')
                      }} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Bot className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No recommendations available</p>
                <p className="text-xs mt-1">Click refresh to get AI-powered suggestions</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
