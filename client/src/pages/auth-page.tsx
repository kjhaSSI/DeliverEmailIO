import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { z } from "zod";
import { Loader2, ArrowLeft } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = insertUserSchema.extend({
  selectedPlan: z.enum(["free", "pro", "enterprise"]).default("free"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const searchParams = useSearch();
  
  // Parse URL for plan parameter
  const urlParams = new URLSearchParams(searchParams);
  const planFromUrl = urlParams.get("plan") as "free" | "pro" | "enterprise" | null;
  
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    setValue: setSignupValue,
    watch: watchSignup,
    formState: { errors: signupErrors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      selectedPlan: planFromUrl || "free",
    },
  });

  // Update plan when URL changes
  useEffect(() => {
    if (planFromUrl && (planFromUrl === "free" || planFromUrl === "pro" || planFromUrl === "enterprise")) {
      setSignupValue("selectedPlan", planFromUrl);
    }
  }, [planFromUrl, setSignupValue]);

  // Redirect if already logged in (after all hooks are called)
  if (user) {
    setLocation("/dashboard");
    return null;
  }

  const onLogin = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onSignup = (data: SignupFormData) => {
    const { selectedPlan, ...userData } = data;
    
    registerMutation.mutate(userData, {
      onSuccess: () => {
        // Redirect based on selected plan
        if (selectedPlan === "pro" || selectedPlan === "enterprise") {
          setLocation(`/checkout/${selectedPlan}`);
        } else {
          setLocation("/dashboard");
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Welcome to DeliverMail.io</h1>
            <p className="text-gray-600 mt-2">Start sending emails with confidence</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Log in to your account</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitLogin(onLogin)} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email address</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="john@example.com"
                        {...registerLogin("email")}
                      />
                      {loginErrors.email && (
                        <p className="text-sm text-red-600 mt-1">{loginErrors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        {...registerLogin("password")}
                      />
                      {loginErrors.password && (
                        <p className="text-sm text-red-600 mt-1">{loginErrors.password.message}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember" className="text-sm">Remember me</Label>
                      </div>
                      <Link href="#" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Log in"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Create your account</CardTitle>
                  <CardDescription>
                    Join thousands of developers sending emails with DeliverMail.io
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitSignup(onSignup)} className="space-y-4">
                    <div>
                      <Label htmlFor="signup-fullname">Full name</Label>
                      <Input
                        id="signup-fullname"
                        type="text"
                        placeholder="John Doe"
                        {...registerSignup("fullName")}
                      />
                      {signupErrors.fullName && (
                        <p className="text-sm text-red-600 mt-1">{signupErrors.fullName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="signup-username">Username</Label>
                      <Input
                        id="signup-username"
                        type="text"
                        placeholder="johndoe"
                        {...registerSignup("username")}
                      />
                      {signupErrors.username && (
                        <p className="text-sm text-red-600 mt-1">{signupErrors.username.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="signup-email">Email address</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="john@example.com"
                        {...registerSignup("email")}
                      />
                      {signupErrors.email && (
                        <p className="text-sm text-red-600 mt-1">{signupErrors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        {...registerSignup("password")}
                      />
                      {signupErrors.password && (
                        <p className="text-sm text-red-600 mt-1">{signupErrors.password.message}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum 8 characters with uppercase, lowercase, and number
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="signup-plan">Choose your plan</Label>
                      <Select 
                        value={watchSignup("selectedPlan")} 
                        onValueChange={(value) => setSignupValue("selectedPlan", value as "free" | "pro" | "enterprise")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free - $0/month (1,000 emails)</SelectItem>
                          <SelectItem value="pro">Pro - $29/month (50,000 emails)</SelectItem>
                          <SelectItem value="enterprise">Enterprise - $99/month (500,000 emails)</SelectItem>
                        </SelectContent>
                      </Select>
                      {signupErrors.selectedPlan && (
                        <p className="text-sm text-red-600 mt-1">{signupErrors.selectedPlan.message}</p>
                      )}
                      {(watchSignup("selectedPlan") === "pro" || watchSignup("selectedPlan") === "enterprise") && (
                        <p className="text-xs text-blue-600 mt-1">
                          You'll be redirected to payment after account creation
                        </p>
                      )}
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <Link href="#" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create account"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-primary-700 items-center justify-center p-12 text-white">
        <div className="max-w-md text-center">
          <h2 className="text-4xl font-bold mb-6">
            Reliable email delivery for your business
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Send transactional emails, track delivery performance, and manage templates with our powerful platform.
          </p>
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-sm">✓</span>
              </div>
              <span>99.9% delivery rate</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-sm">✓</span>
              </div>
              <span>Real-time analytics</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-sm">✓</span>
              </div>
              <span>Enterprise security</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
