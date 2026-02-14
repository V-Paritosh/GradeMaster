"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useAlertStore } from "@/store/alertStore";
import { useRouter } from "next/navigation";

export function ProfileDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const addAlert = useAlertStore((state) => state.addAlert);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setEmail(data.user.email || "");
        setFirstName(data.user.user_metadata?.first_name || "");
        setLastName(data.user.user_metadata?.last_name || "");
      }
    };
    loadUser();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({
      data: { first_name: firstName, last_name: lastName },
    });
    if (error) {
      addAlert({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 4000,
      });
      return;
    }
    addAlert({
      title: "Success",
      description: "Profile updated",
      variant: "default",
      duration: 4000,
    });
    setIsOpen(false);
  };

  const handleDelete = async () => {
    try {
      // 1. Get the latest session data reliably
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        addAlert({
          title: "Error",
          description: "You are not logged in.",
          variant: "destructive",
          duration: 4000,
        });
        return;
      }

      const token = session.access_token;

      // 2. Call the API
      const res = await fetch("/api/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // This matches the "Bearer " check in your backend
          Authorization: `Bearer ${token}`,
        },
      });

      // 3. Handle Errors
      if (!res.ok) {
        // Try to parse JSON, fallback to status text if JSON fails
        let errorMessage = "Failed to delete account";
        try {
          const result = await res.json();
          errorMessage = result.error || errorMessage;
        } catch (e) {
          errorMessage = res.statusText;
        }

        addAlert({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
          duration: 4000,
        });
        return;
      }

      // 4. Success: Sign out and redirect
      addAlert({
        title: "Success",
        description: "Account deleted successfully",
        variant: "default",
        duration: 4000,
      });

      // Force local signout so the UI updates immediately
      await supabase.auth.signOut();
      router.push("/");
    } catch (e) {
      console.error("Delete Account Error:", e); // Helpful for debugging
      addAlert({
        title: "Error",
        description: "A network or server error occurred. Please try again.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
        {firstName || "User"}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-card text-card-foreground rounded-[var(--radius)] shadow-lg w-full max-w-md p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-bold">Profile</h5>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray hover:text-foreground text-xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full px-3 py-2 rounded-[var(--radius)] bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full px-3 py-2 rounded-[var(--radius)] bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  readOnly
                  className="w-full px-3 py-2 rounded-[var(--radius)] bg-muted text-muted-foreground border border-border cursor-not-allowed"
                />
              </div>

              <div className="flex justify-between mt-4">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Delete Account
                </Button>
                <Button type="submit" variant="default">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
