"use client";

import React, { useState } from "react";
import { X, Mail, Lock, User, Sparkles, Check, ArrowRight } from "lucide-react";
import { useIDE } from "@/context/IDEContext";
import { supabase } from "@/lib/storage/supabase";

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, user, setUser, addOutputLog } = useIDE();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (isSignUp) {
        // Sign up with Supabase or local mock
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co") {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: name || email.split("@")[0] },
            },
          });
          if (error) throw error;
          if (data.user) {
            setUser({ email: data.user.email || email, name: name || email.split("@")[0] });
          }
        } else {
          // Dev local session
          setUser({ email, name: name || email.split("@")[0] });
        }
        addOutputLog(`Welcome to Ela IDE, ${name || email}!`, "success");
      } else {
        // Sign in
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co") {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          if (data.user) {
            setUser({ email: data.user.email || email, name: data.user.user_metadata?.full_name || email.split("@")[0] });
          }
        } else {
          setUser({ email, name: email.split("@")[0] });
        }
        addOutputLog(`Signed in as ${email}`, "success");
      }
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: "github" | "google") => {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co") {
        await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: window.location.origin,
          },
        });
      } else {
        setUser({ email: `developer@${provider}.com`, name: `${provider.toUpperCase()} Developer` });
        addOutputLog(`Connected with ${provider}`, "success");
        setIsAuthModalOpen(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-sans select-none">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#141416] border border-zinc-800 p-6 shadow-2xl space-y-5 text-zinc-200">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 transition-colors p-1"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
            <Sparkles size={20} />
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-white">
            {isSignUp ? "Create an Ela IDE Account" : "Sign In to Ela IDE"}
          </h2>
          <p className="text-xs text-zinc-400">
            {isSignUp
              ? "Access cloud projects, AI persistence & unlimited workspaces"
              : "Welcome back! Connect to sync your cloud projects"}
          </p>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs text-center">
            {errorMsg}
          </div>
        )}

        {/* Social Sign In Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleOAuth("github")}
            className="w-full h-9 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 text-xs font-medium text-zinc-200 flex items-center justify-center gap-2 transition-colors"
          >
            <span>Continue with GitHub</span>
          </button>
          <button
            type="button"
            onClick={() => handleOAuth("google")}
            className="w-full h-9 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 text-xs font-medium text-zinc-200 flex items-center justify-center gap-2 transition-colors"
          >
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[10px] uppercase font-semibold text-zinc-500">
          <div className="flex-1 h-[1px] bg-zinc-800" />
          <span>Or with email</span>
          <div className="flex-1 h-[1px] bg-zinc-800" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-400">Full Name</label>
              <div className="relative">
                <User size={13} className="absolute left-3 top-3 text-zinc-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full h-9 pl-9 pr-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-zinc-700 transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-zinc-400">Email Address</label>
            <div className="relative">
              <Mail size={13} className="absolute left-3 top-3 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-zinc-700 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-zinc-400">Password</label>
            <div className="relative">
              <Lock size={13} className="absolute left-3 top-3 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-zinc-700 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-9 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm pt-0.5"
          >
            <span>{isLoading ? "Connecting..." : isSignUp ? "Create Account" : "Sign In"}</span>
            <ArrowRight size={13} />
          </button>
        </form>

        {/* Switch Sign in / Sign up */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => {
              setIsSignUp((v) => !v);
              setErrorMsg(null);
            }}
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up Free"}
          </button>
        </div>
      </div>
    </div>
  );
}

