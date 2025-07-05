import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEmailLogSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2 } from "lucide-react";
import { z } from "zod";

const sendEmailSchema = insertEmailLogSchema.extend({
  templateId: z.number().optional(),
});

type SendEmailFormData = z.infer<typeof sendEmailSchema>;

export default function SendEmail() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  const { data: templates } = useQuery({
    queryKey: ["/api/templates"],
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<SendEmailFormData>({
    resolver: zodResolver(sendEmailSchema),
  });

  const sendEmailMutation = useMutation({
    mutationFn: async (data: SendEmailFormData) => {
      const res = await apiRequest("POST", "/api/send-email", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Email sent!",
        description: "Your email has been sent successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/logs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      reset();
      setSelectedTemplateId("");
    },
    onError: (error) => {
      toast({
        title: "Failed to send email",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SendEmailFormData) => {
    sendEmailMutation.mutate({
      ...data,
      templateId: selectedTemplateId ? parseInt(selectedTemplateId) : undefined,
    });
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (templateId && templates) {
      const template = templates.find((t: any) => t.id === parseInt(templateId));
      if (template) {
        setValue("subject", template.subject);
        setValue("body", template.body);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Send Email</h1>
          <p className="text-gray-600 mt-2">Send emails via our SMTP service</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="w-5 h-5" />
                  <span>Compose Email</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="template">Use Template (Optional)</Label>
                    <Select value={selectedTemplateId} onValueChange={handleTemplateSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates?.map((template: any) => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="to">To *</Label>
                    <Input
                      id="to"
                      type="email"
                      placeholder="recipient@example.com"
                      {...register("to")}
                    />
                    {errors.to && (
                      <p className="text-sm text-red-600 mt-1">{errors.to.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="Email subject"
                      {...register("subject")}
                    />
                    {errors.subject && (
                      <p className="text-sm text-red-600 mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="body">Message *</Label>
                    <Textarea
                      id="body"
                      rows={12}
                      placeholder="Email content (HTML supported)"
                      {...register("body")}
                    />
                    {errors.body && (
                      <p className="text-sm text-red-600 mt-1">{errors.body.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={sendEmailMutation.isPending}
                  >
                    {sendEmailMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Email
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Email Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">To:</p>
                    <p className="text-sm text-gray-900">{watch("to") || "recipient@example.com"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Subject:</p>
                    <p className="text-sm text-gray-900">{watch("subject") || "Email subject"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Message:</p>
                    <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded border max-h-40 overflow-y-auto">
                      {watch("body") ? (
                        <div dangerouslySetInnerHTML={{ __html: watch("body") }} />
                      ) : (
                        <span className="text-gray-500">Email content will appear here...</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>SMTP Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Host:</span>
                    <span className="ml-2 text-gray-600">smtp.delivermail.io</span>
                  </div>
                  <div>
                    <span className="font-medium">Port:</span>
                    <span className="ml-2 text-gray-600">587 (TLS)</span>
                  </div>
                  <div>
                    <span className="font-medium">Auth:</span>
                    <span className="ml-2 text-gray-600">Use API Key</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
