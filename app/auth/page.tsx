"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import { useGradeStore } from "@/store/gradeStore";
import { signIn, signUp } from "@/lib/auth";
import { useAlertStore } from "@/store/alertStore";

export default function AuthPage() {
  const router = useRouter();
  const addAlert = useAlertStore((state) => state.addAlert);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  const scrollToSection = (id: string) => {
    router.push(`/#${id}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = isSignup
        ? await signUp(email, password, firstName, lastName)
        : await signIn(email, password);

      if (result.error) {
        addAlert({
          title: "Error",
          description: result.error.message || "Authentication failed",
          variant: "destructive",
          duration: 4000,
        });
        return;
      }

      const userId = result.data.user?.id;
      if (!userId) {
        addAlert({
          title: "Error",
          description: "Could not get user ID",
          variant: "destructive",
          duration: 4000,
        });
        return;
      }

      useGradeStore.getState().setUser(userId);
      await useGradeStore.getState().fetchGrades();

      addAlert({
        title: "Success",
        description: isSignup ? "Account created" : "Logged in successfully",
        variant: "default",
        duration: 4000,
      });

      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      addAlert({
        title: "Error",
        description: err.message || "Something went wrong. Try again.",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-navy shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="rounded-xl">
                  <Image
                    src={logo}
                    alt="Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <h1 className="text-2xl font-bold text-olive">GradeMaster</h1>
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("home")}
                className="text-foreground hover:text-olive transition-colors relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-olive transition-all duration-300 group-hover:w-full" />
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-foreground hover:text-olive transition-colors relative group"
              >
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-olive transition-all duration-300 group-hover:w-full" />
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-foreground hover:text-olive transition-colors relative group"
              >
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-olive transition-all duration-300 group-hover:w-full" />
              </button>

              <Button
                variant="outline"
                className="border-olive text-olive hover:bg-olive hover:text-background transition-all"
                onClick={() => router.push("/auth")}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Form */}
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        <Card className="w-full max-w-md">
          <div className="space-y-6 p-8 bg-slate">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">
                {isSignup ? "Create Account" : "Login"}
              </h1>
              <p className="mt-1 text-muted-foreground">
                {isSignup
                  ? "Sign up to start tracking your grades"
                  : "Sign in to access your grades"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div className="space-y-1">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              )}

              {isSignup && (
                <div className="space-y-1">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? isSignup
                    ? "Signing up..."
                    : "Logging in..."
                  : isSignup
                  ? "Sign Up"
                  : "Login"}
              </Button>
            </form>

            <p
              onClick={() => setIsSignup(!isSignup)}
              className="text-center text-sm text-muted-foreground cursor-pointer"
            >
              {isSignup
                ? "Already have an account? Log in"
                : "Don't have an account? Sign up"}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
