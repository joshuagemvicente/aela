"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Github, Mail, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useTogglePassword } from "@/hooks/use-toggle-password"
import { useRouter } from "next/navigation"
import { signUpWithEmail, signInWithOAuth } from "@/lib/actions/auth"
import { registerSchema, type RegisterInput } from "@/lib/validations/auth"
import { toast } from "sonner"

type RegisterFormData = RegisterInput

interface RegisterFormProps {
  onSuccess?: () => void
  className?: string
}

export default function RegisterForm({ onSuccess, className }: RegisterFormProps) {
  const router = useRouter()
  const { 
    isPasswordVisible, 
    isConfirmPasswordVisible, 
    togglePassword, 
    toggleConfirmPassword, 
    getPasswordInputType, 
    getConfirmPasswordInputType 
  } = useTogglePassword()
  const [isPending, startTransition] = useTransition()
  const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const handleEmailPasswordRegister = async (data: RegisterFormData) => {
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("email", data.email)
        formData.append("password", data.password)
        formData.append("confirmPassword", data.confirmPassword)
        
        await signUpWithEmail(formData)
        
        toast.success("Account created successfully!")
        onSuccess?.()
        router.push("/login")
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
        toast.error(errorMessage)
      }
    })
  }

  const handleOAuthRegister = async (provider: "google" | "github") => {
    setIsOAuthLoading(provider)
    try {
      await signInWithOAuth(provider, "/dashboard")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to sign up with ${provider}`
      toast.error(errorMessage)
      setIsOAuthLoading(null)
    }
  }

  return (
    <div className={cn("min-h-screen flex", className)}>
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
            <p className="text-muted-foreground">
              Sign up to get started with your account
            </p>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Sign up</CardTitle>
              <CardDescription className="text-center">
                Enter your information to create your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* OAuth Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleOAuthRegister("google")}
                  disabled={isOAuthLoading !== null}
                  className="w-full"
                >
                  {isOAuthLoading === "google" ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleOAuthRegister("github")}
                  disabled={isOAuthLoading !== null}
                  className="w-full"
                >
                  {isOAuthLoading === "github" ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Github className="w-4 h-4" />
                  )}
                  GitHub
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleSubmit(handleEmailPasswordRegister)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10"
                      {...register("name")}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={getPasswordInputType()}
                      placeholder="Create a password"
                      className="pr-10"
                      {...register("password")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={togglePassword}
                    >
                      {isPasswordVisible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={getConfirmPasswordInputType()}
                      placeholder="Confirm your password"
                      className="pr-10"
                      {...register("confirmPassword")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={toggleConfirmPassword}
                    >
                      {isConfirmPasswordVisible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>


                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Button onClick={() => router.push("/login")} variant="link" className="p-0 h-auto font-normal">
                  Sign in
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Generated Image */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20">
        <div className="relative w-full h-full max-w-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl blur-3xl" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center space-y-6 p-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-2xl">
                <User className="w-16 h-16 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Join Our Community
                </h2>
                <p className="text-muted-foreground max-w-sm">
                  Create your account and start your journey with us today
                </p>
              </div>
              <div className="flex justify-center space-x-4">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                <div className="w-3 h-3 bg-secondary rounded-full animate-pulse delay-100" />
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
