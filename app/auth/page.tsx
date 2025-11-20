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

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    router.push(`/#${id}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = isSignup
        ? await signUp(email, password)
        : await signIn(email, password);

      if (result.error) {
        setError(result.error.message || "Authentication failed");
        return;
      }

      const userId = result.data.user?.id;
      if (!userId) {
        setError("Could not get user ID");
        return;
      }

      useGradeStore.getState().setUser(userId);
      await useGradeStore.getState().fetchGrades();

      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Try again.");
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
            {/* Left side: logo + title together */}
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

            {/* Right side: nav links */}
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

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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