import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Activity, User, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export default function AdminSystemLogs() {
  const { user } = useAuth();
  const [searchAction, setSearchAction] = useState("");
  const [userIdFilter, setUserIdFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (searchAction) params.append("action", searchAction);
    if (userIdFilter) params.append("userId", userIdFilter);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return params.toString();
  };

  const { data: logs, isLoading } = useQuery({
    queryKey: ["/api/admin/system-logs", buildQueryParams()],
    queryFn: async () => {
      const response = await fetch(`/api/admin/system-logs?${buildQueryParams()}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch logs");
      return response.json();
    },
    enabled: user?.role === "admin",
  });

  const getActionColor = (action: string) => {
    if (action.includes("create")) return "bg-green-100 text-green-800";
    if (action.includes("update") || action.includes("edit")) return "bg-blue-100 text-blue-800";
    if (action.includes("delete") || action.includes("remove")) return "bg-red-100 text-red-800";
    if (action.includes("login") || action.includes("auth")) return "bg-purple-100 text-purple-800";
    if (action.includes("admin")) return "bg-orange-100 text-orange-800";
    return "bg-gray-100 text-gray-800";
  };

  const clearFilters = () => {
    setSearchAction("");
    setUserIdFilter("");
    setStartDate("");
    setEndDate("");
  };

  if (user?.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view system logs.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
          <p className="text-gray-600 mt-2">Monitor system activity and user actions</p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search-action">Action</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search-action"
                    placeholder="Search actions..."
                    value={searchAction}
                    onChange={(e) => setSearchAction(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="user-id">User ID</Label>
                <Input
                  id="user-id"
                  placeholder="Filter by user ID"
                  value={userIdFilter}
                  onChange={(e) => setUserIdFilter(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </CardContent>
        </Card>

        {/* System Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Activity Log</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : logs && logs.length > 0 ? (
              <div className="space-y-4">
                {logs.map((log: any) => (
                  <div key={log.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge className={getActionColor(log.action)}>
                          {log.action}
                        </Badge>
                        {log.userId && (
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <User className="w-3 h-3" />
                            <span>User {log.userId}</span>
                          </div>
                        )}
                      </div>
                      
                      {log.endpoint && (
                        <p className="text-sm text-gray-600 truncate">{log.endpoint}</p>
                      )}
                      
                      {log.details && (
                        <p className="text-xs text-gray-500 truncate">
                          {typeof log.details === 'object' 
                            ? JSON.stringify(log.details) 
                            : log.details
                          }
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-gray-900">
                        {format(new Date(log.createdAt), "MMM d, yyyy")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(log.createdAt), "h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
                <p className="text-gray-600">
                  {searchAction || userIdFilter || startDate || endDate
                    ? "No logs match your current filters."
                    : "No system activity recorded yet."
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Log Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Logs</p>
                  <p className="text-2xl font-bold text-gray-900">{logs?.length || 0}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Today's Activity</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {logs?.filter((log: any) => {
                      const today = new Date().toDateString();
                      return new Date(log.createdAt).toDateString() === today;
                    }).length || 0}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Unique Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(logs?.filter((log: any) => log.userId).map((log: any) => log.userId)).size || 0}
                  </p>
                </div>
                <User className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
