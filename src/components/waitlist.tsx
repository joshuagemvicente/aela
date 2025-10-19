"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Check, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { waitlistSchema, type WaitlistInput } from "@/lib/validations/waitlist";
import { joinWaitlist } from "@/lib/actions/waitlist";

export default function WaitlistPage() {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    getValues,
  } = useForm<WaitlistInput>({
    resolver: zodResolver(waitlistSchema),
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const onSubmit = async (data: WaitlistInput) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);

      const result = await joinWaitlist(formData);

      if (result.success && result.position) {
        setWaitlistPosition(result.position);
        setIsSubmitted(true);
        toast.success(result.message || "Successfully joined the waitlist!");
      } else {
        toast.error(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSubmitted) {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <main className="relative min-h-screen bg-[#fafafa] overflow-hidden">
      {/* Subtle Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(0,0,0,0.03) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(0,0,0,0.03) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 80%, rgba(0,0,0,0.03) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(0,0,0,0.03) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16 sm:px-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="waitlist-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                {/* Logo */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.8 }}
                  className="mb-16"
                >
                  <h1 className="text-7xl sm:text-8xl md:text-9xl tracking-tight text-neutral-900 mb-6">
                    aela
                  </h1>
                  {/* <div className="w-24 h-[1px] bg-neutral-900 mx-auto" /> */}
                </motion.div>

                {/* Value Proposition */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="mb-20 space-y-6"
                >
                  <h2 className="text-3xl sm:text-4xl md:text-5xl  text-neutral-900 leading-tight tracking-tight">
                    Note-taking, reimagined
                  </h2>
                  <p className="text-lg sm:text-xl text-neutral-500  max-w-xl mx-auto leading-relaxed">
                    A focused writing environment designed for clarity, speed,
                    and the way you think.
                  </p>
                </motion.div>

                {/* Email Form */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="mb-16"
                >
                  <form onSubmit={handleSubmit(onSubmit)} className="relative max-w-md mx-auto">
                    <motion.div
                      animate={{
                        scale: isFocused ? 1.01 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...register("email")}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onKeyPress={handleKeyPress}
                        disabled={isSubmitting}
                        className={`
                          h-14 px-6 text-base bg-white border-2 
                          ${errors.email ? "border-red-400" : "border-neutral-200"}
                          ${isFocused ? "border-neutral-900" : ""}
                          rounded-full shadow-sm
                          focus:outline-none focus:ring-0 focus:border-neutral-900
                          transition-all duration-200
                          text-neutral-900 placeholder:text-neutral-400
                        `}
                        aria-label="Email address"
                      />
                      {errors.email && (
                        <p className="text-red-400 text-sm mt-2">{errors.email.message}</p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="mt-6"
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={`
                          h-14 px-10 bg-neutral-900 hover:bg-neutral-800 
                          text-white rounded-full text-base font-medium
                          transition-all duration-200 shadow-sm hover:shadow-md
                          disabled:opacity-50 disabled:cursor-not-allowed
                          group
                        `}
                        aria-label="Join waitlist"
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          <>
                            <span>Join waitlist</span>
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </motion.div>

                {/* Secondary Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="space-y-12"
                >
                  {/* What to Expect */}
                  <div className="max-w-lg mx-auto">
                    <h3 className="text-sm uppercase tracking-wider text-neutral-400 mb-6 font-medium">
                      What to expect
                    </h3>
                    <div className="grid gap-6 text-left">
                      {[
                        "Early access to the beta release",
                        "Priority support and direct feedback channel",
                        "Exclusive founding member benefits",
                      ].map((item, index) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.6 + index * 0.1,
                            duration: 0.5,
                          }}
                          className="flex items-start gap-3"
                        >
                          <div className="w-5 h-5 rounded-full bg-neutral-900 flex items-center justify-center mt-0.5 flex-shrink-0">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <p className="text-neutral-600 text-base">{item}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="success-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  className="mb-12"
                >
                  <div className="w-20 h-20 mx-auto bg-neutral-900 rounded-full flex items-center justify-center">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                </motion.div>

                {/* Success Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="space-y-8 mb-16"
                >
                  <h2 className="text-4xl sm:text-5xl md:text-6xl  text-neutral-900 tracking-tight">
                    You're in.
                  </h2>
                  <p className="text-xl text-neutral-500  max-w-md mx-auto leading-relaxed">
                    We'll be in touch soon with early access details.
                  </p>
                </motion.div>

                {/* Waitlist Position */}
                {waitlistPosition && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="inline-block px-8 py-4 bg-neutral-100 rounded-full"
                  >
                    <p className="text-neutral-600">
                      <span className="font-medium text-neutral-900">
                        Position #{waitlistPosition.toLocaleString()}
                      </span>{" "}
                      on the waitlist
                    </p>
                  </motion.div>
                )}

                {/* Confirmation Message */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="mt-16 text-neutral-400 text-sm"
                >
                  Confirmation sent to{" "}
                  <span className="text-neutral-600">{getValues("email")}</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-0 right-0 text-center text-neutral-400 text-xs "
      >
        <p>© {new Date().getFullYear()} Aela. All rights reserved.</p>
      </motion.footer>
    </main>
  );
}
