"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calculator,
  BarChart3,
  Sparkles,
  Cloud,
  BookOpen,
  Target,
  Zap,
  Mail,
  Github,
  Globe,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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
            <h1 className="text-2xl font-bold text-olive">GradeMaster</h1>
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
              {/* <button
                onClick={() => scrollToSection("contact")}
                className="text-foreground hover:text-olive transition-colors relative group"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-olive transition-all duration-300 group-hover:w-full" />
              </button> */}
              {/* <Button
                variant="outline"
                className="border-olive text-olive hover:bg-olive hover:text-background transition-all"
                onClick={() => router.push("/dashboard")}
              >
                Login
              </Button> */}
              <Button
                variant="outline"
                className="border-olive text-olive hover:bg-olive hover:text-background transition-all"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--olive)) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10 pt-20">
          <div className="animate-fade-in">
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              Track your grades with{" "}
              <span className="text-olive">precision</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray mb-12 max-w-3xl mx-auto">
              <span className="font-semibold text-olive">
                Built for Schaumburg High School and D211 District. Data stays
                local in your session.
              </span>
              <br />
              Add your classes, set custom weights, and know your exact standing
              anytime.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* <Button
                size="lg"
                className="border-olive text-olive hover:bg-olive hover:text-background transition-all text-lg px-8 py-6"
                onClick={() => router.push("/dashboard")}
              >
                Get Started
              </Button> */}
              <Button
                size="lg"
                variant="outline"
                className="border-olive text-olive hover:bg-olive hover:text-background transition-all text-lg px-8 py-6"
                onClick={() => router.push("/dashboard")}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background border-t-2 border-olive">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="text-olive">How</span> it Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-slate p-8 hover:border-olive transition-all duration-300">
              <div className="w-12 h-12 bg-olive/20 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-olive" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Create Classes</h3>
              <p className="text-gray">
                Add subjects with custom names and organize all your coursework
                in one place.
              </p>
            </Card>
            <Card className="bg-card border-slate p-8 hover:border-olive transition-all duration-300">
              <div className="w-12 h-12 bg-olive/20 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-olive" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Set Sections</h3>
              <p className="text-gray">
                Define weights like Summative or Formative to match your grading
                system.
              </p>
            </Card>
            <Card className="bg-card border-slate p-8 hover:border-olive transition-all duration-300">
              <div className="w-12 h-12 bg-olive/20 rounded-lg flex items-center justify-center mb-4">
                <Calculator className="w-6 h-6 text-olive" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Enter Grades</h3>
              <p className="text-gray">
                Add assignments and watch your grades calculate automatically in
                real-time.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-navy border-t-2 border-olive">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Powerful Features, Simple Interface
          </h2>
          <p className="text-gray text-center mb-16 text-lg">
            Everything you need to stay on top of your academic performance
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate border-slate p-6 hover:border-olive transition-all duration-300 group">
              <div className="w-12 h-12 bg-olive/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-olive/30 transition-colors">
                <BarChart3 className="w-6 h-6 text-olive" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multiple Classes</h3>
              <p className="text-gray text-sm">
                Manage every subject easily with unlimited class support.
              </p>
            </Card>
            <Card className="bg-slate border-slate p-6 hover:border-olive transition-all duration-300 group">
              <div className="w-12 h-12 bg-olive/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-olive/30 transition-colors">
                <Target className="w-6 h-6 text-olive" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Weighted Averages</h3>
              <p className="text-gray text-sm">
                Assign custom section weights that match your syllabus.
              </p>
            </Card>
            <Card className="bg-slate border-slate p-6 hover:border-olive transition-all duration-300 group">
              <div className="w-12 h-12 bg-olive/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-olive/30 transition-colors">
                <Zap className="w-6 h-6 text-olive" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Auto Calculations</h3>
              <p className="text-gray text-sm">
                Grades update instantly as you enter new assignments.
              </p>
            </Card>
            <Card className="bg-slate border-slate p-6 hover:border-olive transition-all duration-300 group">
              <div className="w-12 h-12 bg-olive/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-olive/30 transition-colors">
                <Cloud className="w-6 h-6 text-olive" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Local Storage</h3>
              <p className="text-gray text-sm">
                Data saved locally in your session. Not sent to external
                servers.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-24 bg-background border-t-2 border-olive">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-navy rounded-2xl p-8 border border-slate shadow-2xl">
              <div className="space-y-4">
                <div className="h-12 bg-slate rounded-lg flex items-center px-4">
                  <div className="w-2 h-2 rounded-full bg-olive mr-3" />
                  <div className="h-4 bg-olive/20 rounded w-32" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-slate rounded-lg p-4">
                      <div className="h-3 bg-olive/20 rounded w-full mb-2" />
                      <div className="h-8 bg-olive/30 rounded w-full" />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-slate rounded-lg p-4 flex justify-between items-center"
                    >
                      <div className="h-4 bg-olive/20 rounded w-1/3" />
                      <div className="h-4 bg-olive/30 rounded w-16" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Your Dashboard at a <span className="text-olive">Glance</span>
              </h2>
              <p className="text-gray text-lg mb-8">
                See class summaries, section breakdowns, and final grades in one
                clean view. No more confusion about where you stand.
              </p>
              <Button
                size="lg"
                className="bg-olive text-background hover:brightness-110 transition-all"
                onClick={() => router.push("/dashboard")}
              >
                Launch App
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-navy border-t-2 border-olive">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            What <span className="text-olive">Students</span> Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate border-slate p-8">
              <Sparkles className="w-8 h-8 text-olive mb-4" />
              <p className="text-lg mb-4 italic">
                "Finally, a clean grade tracker that makes sense."
              </p>
              <p className="text-gray text-sm">— Sarah M.</p>
            </Card>
            <Card className="bg-slate border-slate p-8">
              <Sparkles className="w-8 h-8 text-olive mb-4" />
              <p className="text-lg mb-4 italic">
                "My grades are organized for the first time."
              </p>
              <p className="text-gray text-sm">— James T.</p>
            </Card>
            <Card className="bg-slate border-slate p-8">
              <Sparkles className="w-8 h-8 text-olive mb-4" />
              <p className="text-lg mb-4 italic">
                "Fast, simple, and accurate."
              </p>
              <p className="text-gray text-sm">— Emily R.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-24 bg-background border-t-2 border-olive"
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              About the <span className="text-olive">Project</span>
            </h2>
            <p className="text-gray text-lg max-w-3xl mx-auto">
              Built by Paritosh Vaghasiya, for students at Schaumburg High
              School and D211 District. All data is stored locally in the
              session and is not sent to any external servers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-slate border-slate p-8 hover:border-olive transition-all duration-300">
              <div className="w-12 h-12 bg-olive/20 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-olive" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Our Mission
              </h3>
              <p className="text-gray leading-relaxed">
                To make academic tracking simple, transparent, and accessible to
                everyone. No more confusion about where you stand in your
                classes.
              </p>
            </Card>

            <Card className="bg-slate border-slate p-8 hover:border-olive transition-all duration-300">
              <div className="w-12 h-12 bg-olive/20 rounded-lg flex items-center justify-center mb-6">
                <Calculator className="w-6 h-6 text-olive" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                What We Do
              </h3>
              <p className="text-gray leading-relaxed">
                Handle weighted sections, letter grades, and live calculations
                so you stay informed without spreadsheets. Track everything in
                one clean, intuitive interface.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      {/* <section id="contact" className="py-24 bg-navy border-t-2 border-olive">
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Get in <span className="text-olive">Touch</span>
          </h2>
          <p className="text-gray text-center mb-12">
            Have feedback or feature ideas? Let us know.
          </p>
          <Card className="bg-slate border-slate p-8">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  className="bg-background border-border focus:border-olive transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  className="bg-background border-border focus:border-olive transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  className="bg-background border-border focus:border-olive transition-colors min-h-32"
                  placeholder="Tell us what you think..."
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-olive text-background hover:brightness-110 transition-all"
              >
                Submit
              </Button>
            </form>
          </Card>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-navy border-t-2 border-olive py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray mb-4">
            © 2025 Grade Calculator. Built for Schaumburg High School and D211
            District. All data is stored locally in the session.
          </p>
          <p className="text-olive flex justify-center items-center gap-2 mb-4">
            Made with <span className="text-red-500">❤️</span> by Paritosh
            Vaghaisya
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="https://v-paritosh.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-olive hover:brightness-110 transition-all"
            >
              <Globe className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/V-Paritosh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-olive hover:brightness-110 transition-all"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="mailto:paritoshv08@gmail.com"
              className="text-olive hover:brightness-110 transition-all"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}