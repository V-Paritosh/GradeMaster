"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/public/logo.png";

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-navy border-b-2 border-olive/30">
        <div className="container mx-auto px-6 py-6 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <div className="rounded-xl">
                  <Image
                    src={logo}
                    alt="Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  GPA Calculator
                </h1>
                <p className="text-gray text-sm">Project your future grades</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* STYLED BACK BUTTON */}
              <Link href="/dashboard">
                <Button className="gap-2 bg-olive text-background hover:bg-olive/90 shadow-lg shadow-olive/30 hover:shadow-olive/50 transition-all">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="container mx-auto px-6 py-24 max-w-7xl">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-olive/20 blur-2xl rounded-full" />
            <div className="relative p-8 rounded-full bg-navy border-2 border-olive/30 shadow-xl">
              <Construction className="w-16 h-16 text-olive" />
            </div>
          </div>

          <div className="space-y-4 max-w-lg">
            <h2 className="text-4xl font-bold text-foreground tracking-tight">
              Coming Soon
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We are working hard to bring you a comprehensive GPA projection
              tool. Check back soon to calculate your weighted and unweighted
              GPA scenarios.
            </p>
          </div>

          <div className="pt-4">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-olive hover:bg-olive/90 text-white font-semibold shadow-lg shadow-olive/20"
              >
                Return to Classes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
