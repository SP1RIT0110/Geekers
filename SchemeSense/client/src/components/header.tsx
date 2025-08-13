import { Bell, Landmark } from "lucide-react";

interface HeaderProps {
  user?: {
    name: string;
    initials: string;
  };
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Landmark className="text-primary text-2xl mr-3" />
            <h1 className="text-xl font-bold text-neutral">GovScheme AI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="text-gray-600 hover:text-primary transition-colors"
              data-testid="button-notifications"
            >
              <Bell className="text-lg" />
            </button>
            {user && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium" data-testid="text-user-initials">
                    {user.initials}
                  </span>
                </div>
                <span className="text-gray-700 font-medium" data-testid="text-user-name">
                  {user.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
