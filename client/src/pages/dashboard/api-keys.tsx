import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertApiKeySchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Key, Copy, Trash2, Eye, EyeOff, Search } from "lucide-react";
import { z } from "zod";
import { format } from "date-fns";

type ApiKeyFormData = z.infer<typeof insertApiKeySchema>;

export default function ApiKeys() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleKeys, setVisibleKeys] = useState<Set<number>>(new Set());

  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ["/api/api-keys"],
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ApiKeyFormData>({
    resolver: zodResolver(insertApiKeySchema),
    defaultValues: {
      scopes: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ApiKeyFormData) => {
      const res = await apiRequest("POST", "/api/api-keys", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "API key created",
        description: "Your new API key has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/api-keys"] });
      setIsCreateDialogOpen(false);
      reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to create API key",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/api-keys/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "API key deleted",
        description: "The API key has been revoked and deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/api-keys"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete API key",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ApiKeyFormData) => {
    createMutation.mutate(data);
  };

  const handleScopeChange = (scope: string, checked: boolean) => {
    const currentScopes = watch("scopes") || [];
    if (checked) {
      setValue("scopes", [...currentScopes, scope]);
    } else {
      setValue("scopes", currentScopes.filter((s) => s !== scope));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "API key has been copied to your clipboard.",
    });
  };

  const toggleKeyVisibility = (id: number) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleKeys(newVisible);
  };

  const maskKey = (key: string) => {
    return key.substring(0, 8) + "..." + key.substring(key.length - 8);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredKeys = apiKeys?.filter((key: any) =>
    key.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const availableScopes = [
    { id: "send", label: "Send Emails", description: "Permission to send emails via API" },
    { id: "templates", label: "Templates", description: "Manage email templates" },
    { id: "logs", label: "View Logs", description: "Access email delivery logs" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
            <p className="text-gray-600 mt-2">Manage API keys for programmatic access</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Key Name *</Label>
                  <Input
                    id="name"
                    placeholder="My API Key"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label>Permissions</Label>
                  <div className="space-y-3 mt-2">
                    {availableScopes.map((scope) => (
                      <div key={scope.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={scope.id}
                          checked={(watch("scopes") || []).includes(scope.id)}
                          onCheckedChange={(checked) => handleScopeChange(scope.id, !!checked)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label
                            htmlFor={scope.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {scope.label}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {scope.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.scopes && (
                    <p className="text-sm text-red-600 mt-1">{errors.scopes.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creating..." : "Create API Key"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search API keys by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* API Keys List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-48"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredKeys.length > 0 ? (
          <div className="space-y-4">
            {filteredKeys.map((apiKey: any) => (
              <Card key={apiKey.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Key className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-medium text-gray-900">{apiKey.name}</h3>
                        <Badge variant={apiKey.isActive ? "default" : "secondary"}>
                          {apiKey.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Key:</span>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                            {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                          >
                            {visibleKeys.has(apiKey.id) ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(apiKey.key)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Scopes: {apiKey.scopes.join(", ") || "None"}</span>
                          <span>Created: {format(new Date(apiKey.createdAt), "MMM d, yyyy")}</span>
                          {apiKey.lastUsed && (
                            <span>Last used: {format(new Date(apiKey.lastUsed), "MMM d, yyyy")}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(apiKey.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No API keys found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? "No API keys match your search criteria."
                  : "Create your first API key to start using our service programmatically."
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create API Key
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Usage Information */}
        <Card>
          <CardHeader>
            <CardTitle>API Usage Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Authentication</h4>
              <p className="text-sm text-gray-600 mb-2">
                Include your API key in the Authorization header:
              </p>
              <code className="block bg-gray-100 p-3 rounded text-sm">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Send Email via API</h4>
              <code className="block bg-gray-100 p-3 rounded text-sm">
                POST https://api.delivermail.io/v1/send<br/>
                Content-Type: application/json<br/><br/>
                {`{
  "to": "recipient@example.com",
  "subject": "Hello World",
  "body": "<h1>Hello from DeliverMail.io!</h1>"
}`}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
