"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CalendarDays,
  Users,
  MapPin,
  Mail,
  User,
  FileText,
  ChevronDown,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking, type DestinationKey } from "./booking-context";

/* ──────────────────────────────────────────────────
   Pricing & destination data
   ────────────────────────────────────────────────── */

const DESTINATIONS = [
  { key: "paris" as DestinationKey, label: "Paris 1889 - Belle Epoque", pricePerDay: 2000 },
  { key: "florence" as DestinationKey, label: "Florence 1504 - Renaissance", pricePerDay: 2500 },
  { key: "cretaceous" as DestinationKey, label: "Cretaceous Period - 65M Years", pricePerDay: 7000 },
];

function getDaysBetween(start: string, end: string): number {
  if (!start || !end) return 0;
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/* ──────────────────────────────────────────────────
   Animated counter
   ────────────────────────────────────────────────── */

function AnimatedPrice({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const frameRef = useRef<number>(0);
  const startRef = useRef(display);
  const startTimeRef = useRef(0);

  useEffect(() => {
    startRef.current = display;
    startTimeRef.current = performance.now();
    const duration = 600;

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startRef.current + (value - startRef.current) * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span className="tabular-nums">
      {display.toLocaleString("en-US")}
    </span>
  );
}

/* ──────────────────────────────────────────────────
   Main BookingModal
   ────────────────────────────────────────────────── */

export function BookingModal() {
  const { isOpen, preselectedDestination, closeBooking } = useBooking();

  /* Form state */
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [destination, setDestination] = useState<DestinationKey>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  /* Sync preselected destination */
  useEffect(() => {
    if (isOpen) {
      setDestination(preselectedDestination);
      setSubmitted(false);
      setErrors({});
    }
  }, [isOpen, preselectedDestination]);

  /* Dynamic price calculation */
  const days = useMemo(() => getDaysBetween(startDate, endDate), [startDate, endDate]);
  const selectedDest = DESTINATIONS.find((d) => d.key === destination);
  const dailyRate = selectedDest?.pricePerDay ?? 0;
  const totalPrice = dailyRate * days * passengers;

  /* Today for min date */
  const today = new Date().toISOString().split("T")[0];

  /* Validation */
  const validate = useCallback((): boolean => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Name required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email";
    if (!destination) e.destination = "Choose a destination";
    if (!startDate) e.startDate = "Departure date required";
    if (!endDate) e.endDate = "Return date required";
    if (startDate && endDate && new Date(endDate) <= new Date(startDate))
      e.endDate = "Return date must be after departure";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [fullName, email, destination, startDate, endDate]);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch(
        "https://hook.eu1.make.com/galdn4sqn3or5xa70h6iqcrur2cntpgr",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: fullName,
            customerEmail: email,
            destination: selectedDest?.label ?? destination,
            startDate,
            endDate,
            durationDays: days,
            numTravelers: passengers,
            totalPrice,
            specialRequests: notes,
          }),
        }
      );

      if (!res.ok) throw new Error("Webhook returned an error");
      setSubmitted(true);
    } catch {
      setSubmitError(
        "A temporal disturbance prevented transmission. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFullName("");
    setEmail("");
    setDestination("");
    setStartDate("");
    setEndDate("");
    setPassengers(1);
    setNotes("");
    setErrors({});
    setSubmitted(false);
    closeBooking();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={closeBooking}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-primary/20 chat-scrollbar"
            style={{
              background: "hsl(228 35% 8% / 0.85)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              boxShadow: "0 0 60px hsl(43 56% 52% / 0.08), 0 0 120px hsl(228 40% 7% / 0.5)",
            }}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-foreground">
                  Temporal Reservation
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Plan your journey through time
                </p>
              </div>
              <button
                onClick={closeBooking}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:text-primary"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                /* ── Success State ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="flex flex-col items-center gap-6 px-6 py-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.15 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary/10"
                  >
                    <Check className="h-8 w-8 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-foreground">
                      Request Recorded
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Your request has been inscribed in the temporal archives.
                      Our chronology advisors will contact you shortly
                      to finalize your expedition.
                    </p>
                  </div>
                  <div className="w-full rounded-lg border border-border/40 bg-secondary/30 px-4 py-3">
                    <p className="text-xs text-muted-foreground">
                      Destination: <span className="text-foreground">{selectedDest?.label}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Total: <span className="font-semibold text-primary">{totalPrice.toLocaleString("en-US")} EUR</span>
                    </p>
                  </div>
                  <Button
                    onClick={handleReset}
                    className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Close
                  </Button>
                </motion.div>
              ) : (
                /* ── Form ── */
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-5 px-6 py-6"
                >
                  {/* Name & Email row */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InputField
                      icon={<User className="h-4 w-4" />}
                      label="Full Name"
                      value={fullName}
                      onChange={setFullName}
                      error={errors.fullName}
                      placeholder="John Doe"
                    />
                    <InputField
                      icon={<Mail className="h-4 w-4" />}
                      label="Email"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      error={errors.email}
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Destination Select */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      Destination
                    </label>
                    <div className="relative">
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value as DestinationKey)}
                        className="w-full appearance-none rounded-lg border border-border/60 bg-secondary/30 px-4 py-2.5 pr-10 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                      >
                        <option value="">Choose a destination...</option>
                        {DESTINATIONS.map((d) => (
                          <option key={d.key} value={d.key}>
                            {d.label} ({d.pricePerDay.toLocaleString("en-US")} EUR/day/pers.)
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    {errors.destination && <FieldError msg={errors.destination} />}
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5 text-primary" />
                        Departure Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        min={today}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-lg border border-border/60 bg-secondary/30 px-4 py-2.5 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 [color-scheme:dark]"
                      />
                      {errors.startDate && <FieldError msg={errors.startDate} />}
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5 text-primary" />
                        Return Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        min={startDate || today}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full rounded-lg border border-border/60 bg-secondary/30 px-4 py-2.5 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 [color-scheme:dark]"
                      />
                      {errors.endDate && <FieldError msg={errors.endDate} />}
                    </div>
                  </div>

                  {/* Passengers */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      Number of Travelers
                    </label>
                    <div className="flex items-center gap-3">
                      {[1, 2, 3, 4].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setPassengers(n)}
                          className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-all duration-300 ${passengers === n
                              ? "border-primary bg-primary/20 text-primary shadow-sm shadow-primary/20"
                              : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                            }`}
                        >
                          {n}
                        </button>
                      ))}
                      <span className="text-xs text-muted-foreground">
                        traveler{passengers > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Special Notes */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      Special Requests
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Special equipment, allergies, preferences..."
                      rows={3}
                      className="w-full resize-none rounded-lg border border-border/60 bg-secondary/30 px-4 py-2.5 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                    />
                  </div>

                  {/* Dynamic Price Calculator */}
                  {destination && days > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="overflow-hidden rounded-lg border border-primary/20 bg-primary/5 px-5 py-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {dailyRate.toLocaleString("en-US")} EUR x {days} day{days > 1 ? "s" : ""} x{" "}
                            {passengers} pers.
                          </p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground/60">
                            Indicative rate, confirmed by our advisors
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary font-serif">
                            <AnimatedPrice value={totalPrice} /> <span className="text-sm">EUR</span>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Error message */}
                  {submitError && (
                    <p className="mt-1 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                      {submitError}
                    </p>
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="mt-1 w-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/15 transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Transmitting...
                      </span>
                    ) : (
                      "Submit Reservation"
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ──────────────────────────────────────────────────
   Sub-components
   ────────────────────────────────────────────────── */

function InputField({
  icon,
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border bg-secondary/30 px-4 py-2.5 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-primary/20 ${error
            ? "border-destructive/60 focus:border-destructive/80"
            : "border-border/60 focus:border-primary/50"
          }`}
      />
      {error && <FieldError msg={error} />}
    </div>
  );
}

function FieldError({ msg }: { msg: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-1 flex items-center gap-1 text-[11px] text-destructive"
    >
      <AlertCircle className="h-3 w-3" />
      {msg}
    </motion.p>
  );
}
