"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";

const ease = [0.6, -0.05, 0.01, 0.99] as const;

export function Footer() {
  const [email, setEmail] = useState("");
  const prefersReducedMotion = useReducedMotion();

  return (
    <footer id="book" className="relative border-t border-border/50 bg-card">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease }}
          className="grid gap-12 md:grid-cols-3"
        >
          {/* About Column */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 text-primary"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <span className="font-serif text-lg font-bold text-foreground">
                TimeTravel<span className="text-primary"> Agency</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The world{"'"}s premier luxury time travel provider. Extraordinary
              journeys to history{"'"}s most remarkable moments, with unmatched
              safety and comfort.
            </p>
            {/* Social Icons */}
            <div className="mt-6 flex gap-3">
              {["X", "IG", "FB", "LI"].map((social, i) => (
                <motion.div
                  key={social}
                  initial={prefersReducedMotion ? false : { opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.08, type: "spring", stiffness: 400, damping: 20 }}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border/50 text-xs font-medium text-muted-foreground transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:text-primary hover:shadow-md hover:shadow-primary/10"
                >
                  {social}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Quick Links
            </h3>
            <nav className="mt-4 flex flex-col gap-3">
              {[
                { label: "Home", href: "#home" },
                { label: "Destinations", href: "#destinations" },
                { label: "About Us", href: "#about" },
                { label: "Safety Protocol", href: "#" },
                { label: "Pricing", href: "#" },
                { label: "FAQ", href: "#" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-all duration-300 hover:translate-x-1 hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Stay in Touch
            </h3>
            <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
              <p>contact@timetravelagency.com</p>
              <p>+1 (888) TIME-TRV</p>
              <p>Geneva, Switzerland</p>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium text-foreground">Newsletter</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Get the latest temporal travel offers
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setEmail("");
                }}
                className="mt-3 flex gap-2"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 rounded-md border border-border/50 bg-secondary/50 px-3 py-2 text-sm text-foreground backdrop-blur-sm placeholder:text-muted-foreground transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease, delay: 0.3 }}
          className="mt-12 border-t border-border/50 pt-6 text-center"
        >
          <p className="text-xs text-muted-foreground">
            {"© 2026 TimeTravel Agency. All rights reserved. Temporal travel is subject to compliance with the Temporal Displacement Act of 2024."}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
