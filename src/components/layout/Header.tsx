"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface HeaderProps {
  variant?: "public" | "decorator" | "admin";
  userName?: string;
  notifications?: number;
}

const publicNavItems = [
  { label: "Ana Səhvə", href: "/" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Xidmətlər", href: "#services" },
  { label: "Necə işləyir", href: "#how-it-works" },
  { label: "Qiymət", href: "#pricing" },
  { label: "Əlaqə", href: "#contact" },
];

const decoratorNavItems = [
  { label: "Ana Səhvə", href: "/" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Sifariş Yarat", href: "/dashboard/orders/new" },
  { label: "Tarixçə", href: "/dashboard/orders" },
  { label: "Level", href: "/dashboard/level" },
  { label: "Bonus", href: "/dashboard/bonus" },
];

const adminNavItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Sifarişlər", href: "/admin/orders" },
  { label: "İstifadəçilər", href: "/admin/users" },
  { label: "Maliyyə", href: "/admin/finance" },
];

export function Header({ variant = "public", userName, notifications = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems =
    variant === "public"
      ? publicNavItems
      : variant === "decorator"
      ? decoratorNavItems
      : adminNavItems;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/Backup_of_YENILOGO.svg"
              alt="Premium Reklam"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[#6B7280] hover:text-[#D90429] font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {variant !== "public" && (
              <>
                <button className="relative p-2 text-[#6B7280] hover:text-[#D90429] transition-colors">
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#D90429] text-white text-xs rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
                <div className="hidden sm:flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#D90429]/10 flex items-center justify-center text-[#D90429]">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-[#1F2937]">{userName}</span>
                </div>
              </>
            )}
            
            {variant === "public" && (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-[#1F2937] font-medium hover:text-[#D90429] transition-colors"
                >
                  Daxil ol
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 bg-[#D90429] text-white font-medium rounded-[14px] hover:bg-[#b80323] transition-colors"
                >
                  Qeydiyyat
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#6B7280]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-[#E5E7EB]"
          >
            <nav className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-[#6B7280] hover:text-[#D90429] hover:bg-gray-50 rounded-xl font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              {variant === "public" && (
                <div className="pt-4 border-t border-[#E5E7EB] space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-[#1F2937] font-medium"
                  >
                    Daxil ol
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 bg-[#D90429] text-white font-medium rounded-xl text-center"
                  >
                    Qeydiyyat
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
