"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGradeStore } from "@/store/gradeStore";
import { ClassCard } from "@/components/ClassCard";
import { AddClassDialog } from "@/components/AddClassDialog";
import { GraduationCap, LogOut } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import logo from "@/public/logo.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut, getCurrentSession } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const userId = useGradeStore((state) => state.userId);
  const classes = useGradeStore((state) => state.classes);
  const fetchGrades = useGradeStore((state) => state.fetchGrades);
  const setUser = useGradeStore((state) => state.setUser);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getCurrentSession();
      if (!session) {
        router.push("/auth");
        return;
      }
    };

    checkSession();
  }, [router, fetchGrades]);

  const handleLogout = () => {
    setUser(null);
    signOut();
    router.push("/");
  };

  const totalClasses = classes.length;
  const totalSections = classes.reduce((sum, c) => sum + c.sections.length, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-navy border-b-2 border-olive/30">
        <div className="container mx-auto px-6 py-6 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
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
                  My Classes
                </h1>
                <p className="text-gray text-sm">
                  Track your academic progress
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <AddClassDialog />
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {classes.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {classes.map((classData) => (
              <ClassCard key={classData.id} classData={classData} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="text-center space-y-6 max-w-md">
              <div className="p-6 rounded-full bg-olive/20 w-24 h-24 flex items-center justify-center mx-auto border-2 border-olive/30">
                <GraduationCap className="w-12 h-12 text-olive" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                No classes yet
              </h2>
              <p className="text-gray text-lg leading-relaxed">
                Get started by creating your first class. Add sections,
                assignments, and track your grades in real-time.
              </p>
              <div className="pt-4">
                <AddClassDialog />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}