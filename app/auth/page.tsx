"use client";

import { useState, useEffect, useMemo } from "react";
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
import { ChevronDown, Eye, EyeOff, Menu, X } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const addAlert = useAlertStore((state) => state.addAlert);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // UI State
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- AUTOMATED GRADE LOGIC ---
  const gradeOptions = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const seniorGradYear = currentMonth >= 6 ? currentYear + 1 : currentYear;

    return [
      {
        label: `Freshman - Class of ${seniorGradYear + 3}`,
        value: String(seniorGradYear + 3),
      },
      {
        label: `Sophomore - Class of ${seniorGradYear + 2}`,
        value: String(seniorGradYear + 2),
      },
      {
        label: `Junior - Class of ${seniorGradYear + 1}`,
        value: String(seniorGradYear + 1),
      },
      {
        label: `Senior - Class of ${seniorGradYear}`,
        value: String(seniorGradYear),
      },
      { label: "Other / Alumni", value: "other" },
    ];
  }, []);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    // If we are on the auth page, we need to go to home first
    router.push(`/#${id}`);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = isSignup
        ? await signUp(email, password, firstName, lastName, graduationYear)
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
        description: err.message || "Something went wrong.",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // changed: min-h-screen and bg-background to match LandingPage structure
    <div className="min-h-screen bg-background font-sans">
      {/* Navbar - Matches LandingPage style exactly + Hamburger */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled || isMenuOpen ? "bg-navy shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Area */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-3"
                onClick={() => setIsMenuOpen(false)}
              >
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

            {/* Desktop Navigation (Hidden on Mobile) */}
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

            {/* Mobile Hamburger Button (Visible on Mobile) */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-foreground hover:text-olive transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-navy shadow-lg border-t border-white/10 flex flex-col p-4 animate-in slide-in-from-top-5 fade-in duration-200">
            <button
              onClick={() => scrollToSection("home")}
              className="py-3 text-left text-foreground hover:text-olive transition-colors border-b border-white/5"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="py-3 text-left text-foreground hover:text-olive transition-colors border-b border-white/5"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="py-3 text-left text-foreground hover:text-olive transition-colors border-b border-white/5"
            >
              About
            </button>
            <div className="pt-4">
              <Button
                variant="outline"
                className="w-full border-olive text-olive hover:bg-olive hover:text-white transition-all"
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push("/auth");
                }}
              >
                Login
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content / Hero Area 
          This is the key fix: It occupies the full height and sits UNDER the fixed navbar 
      */}
      <section
        className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 pt-20"
        style={{ background: "var(--gradient-hero)" }}
      >
        {/* Optional: Grid pattern overlay like Home page */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--olive)) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Auth Card */}
        <div className="relative z-10 w-full max-w-md">
          <Card className="shadow-2xl border-0">
            <div className="space-y-6 p-6 md:p-8 bg-slate/80 backdrop-blur-md rounded-lg border border-white/5">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">
                  {isSignup ? "Create Account" : "Welcome Back"}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isSignup
                    ? "Start tracking your academic journey today"
                    : "Sign in to access your dashboard"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignup && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          disabled={isLoading}
                          required
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          disabled={isLoading}
                          required
                          className="bg-background/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">Current Grade</Label>
                      <div className="relative">
                        <select
                          id="graduationYear"
                          value={graduationYear}
                          onChange={(e) => setGraduationYear(e.target.value)}
                          disabled={isLoading}
                          required
                          className={`flex h-10 w-full appearance-none rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                            graduationYear === ""
                              ? "text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          <option value="" disabled>
                            Select your grade level
                          </option>
                          {gradeOptions.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              className="bg-background text-foreground"
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none text-foreground" />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      className="bg-background/50 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-olive hover:bg-olive/90 text-white font-semibold h-11"
                  disabled={isLoading}
                >
                  {isLoading
                    ? isSignup
                      ? "Creating Account..."
                      : "Signing In..."
                    : isSignup
                    ? "Sign Up"
                    : "Sign In"}
                </Button>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isSignup ? (
                    <>
                      Already have an account?{" "}
                      <span className="text-olive font-medium">Log in</span>
                    </>
                  ) : (
                    <>
                      Don't have an account?{" "}
                      <span className="text-olive font-medium">Sign up</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
