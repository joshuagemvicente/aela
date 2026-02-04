"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTogglePassword } from "@/hooks/use-toggle-password";
import { signInWithOAuth, signUpWithEmail } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { type RegisterInput, registerSchema } from "@/lib/validations/auth";

type RegisterFormData = RegisterInput;

interface RegisterFormProps {
  onSuccess?: () => void;
  className?: string;
}

export default function RegisterForm({
  onSuccess,
  className,
}: RegisterFormProps) {
  const router = useRouter();
  const {
    isPasswordVisible,
    isConfirmPasswordVisible,
    togglePassword,
    toggleConfirmPassword,
    getPasswordInputType,
    getConfirmPasswordInputType,
  } = useTogglePassword();
  const [isPending, startTransition] = useTransition();
  const [isOAuthLoading, setIsOAuthLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleEmailPasswordRegister = async (data: RegisterFormData) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("confirmPassword", data.confirmPassword);

        await signUpWithEmail(formData);

        toast.success("Account created successfully!");
        onSuccess?.();
        router.push("/login");
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        toast.error(errorMessage);
      }
    });
  };

  const handleGoogleRegister = async () => {
    setIsOAuthLoading(true);
    try {
      await signInWithOAuth("google", "/dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to sign up with Google";
      toast.error(errorMessage);
      setIsOAuthLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center justify-center bg-background p-4",
        className,
      )}
    >
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Image
              src="/aela.png"
              alt="Aela"
              width={48}
              height={48}
              className="rounded-xl"
            />
          </Link>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details to get started.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={handleGoogleRegister}
            disabled={isOAuthLoading || isPending}
            className="w-full h-10 font-normal border-input hover:bg-accent hover:text-accent-foreground relative"
          >
            {isOAuthLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <title>Google</title>
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
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(handleEmailPasswordRegister)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Full Name
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="h-10"
                  {...register("name")}
                  disabled={isPending || isOAuthLoading}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-10"
                  {...register("email")}
                  disabled={isPending || isOAuthLoading}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={getPasswordInputType()}
                  placeholder="Create a password"
                  className="h-10 pr-10"
                  {...register("password")}
                  disabled={isPending || isOAuthLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                  onClick={togglePassword}
                  disabled={isPending || isOAuthLoading}
                >
                  {isPasswordVisible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={getConfirmPasswordInputType()}
                  placeholder="Confirm your password"
                  className="h-10 pr-10"
                  {...register("confirmPassword")}
                  disabled={isPending || isOAuthLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                  onClick={toggleConfirmPassword}
                  disabled={isPending || isOAuthLoading}
                >
                  {isConfirmPasswordVisible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-10 font-medium"
              disabled={isPending || isOAuthLoading}
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground hover:underline underline-offset-4"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
