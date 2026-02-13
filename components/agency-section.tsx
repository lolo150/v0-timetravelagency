"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ShieldCheck, Award, Gem } from "lucide-react";
import Image from "next/image";

const ease = [0.6, -0.05, 0.01, 0.99] as const;

const features = [
  {
    icon: ShieldCheck,
    title: "Unmatched Safety",
    description:
      "Our proprietary temporal shielding technology ensures every journey is completely safe and reversible.",
  },
  {
    icon: Award,
    title: "Expert Guides",
    description:
      "Seasoned historians and temporal navigators accompany every voyage to enrich your experience.",
  },
  {
    icon: Gem,
    title: "Pure Luxury",
    description:
      "First-class accommodations, gourmet dining, and bespoke itineraries tailored to your desires.",
  },
];

const stats = [
  { label: "Journeys", target: 500, suffix: "+" },
  { label: "Safe Returns", target: 100, suffix: "%" },
  { label: "Years Range", target: 4.5, suffix: "B", isDecimal: true },
];

function AnimatedCounter({
  target,
  suffix,
  isDecimal,
  isVisible,
}: {
  target: number;
  suffix: string;
  isDecimal?: boolean;
  isVisible: boolean;
}) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * target);

      if (current >= steps) {
        setCount(target);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, target]);

  return (
    <span>
      {isDecimal ? count.toFixed(1) : Math.floor(count)}
      {suffix}
    </span>
  );
}

export function AgencySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const imageInView = useInView(imageRef, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-gradient-1 relative py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease }}
          className="mb-16 text-center"
        >
          <span className="text-xs font-medium tracking-widest text-primary uppercase">
            About the Agency
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-foreground md:text-5xl text-balance">
            Pioneers of Temporal Exploration
          </h2>
        </motion.div>

        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Image */}
          <motion.div
            ref={imageRef}
            initial={prefersReducedMotion ? false : { opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease }}
            className="relative overflow-hidden rounded-lg"
          >
            <div className="glow-gold-hover rounded-lg transition-shadow duration-500">
              <div className="absolute inset-0 z-10 rounded-lg border border-primary/20" />
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KjkiZBFsGDwqRaR6h8c3A35diiEGgR.png"
                alt="TimeTravel Agency luxury control room with holographic displays"
                width={640}
                height={480}
                className="h-auto w-full rounded-lg object-cover"
              />
              {/* Floating stats */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between gap-3">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease, delay: 0.4 + i * 0.15 }}
                    className="glass rounded-md px-4 py-2"
                  >
                    <p className="font-serif text-xl font-bold text-primary">
                      <AnimatedCounter
                        target={stat.target}
                        suffix={stat.suffix}
                        isDecimal={stat.isDecimal}
                        isVisible={imageInView}
                      />
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
          >
            <p className="text-lg leading-relaxed text-muted-foreground">
              Founded by visionary scientists and luxury travel connoisseurs,
              TimeTravel Agency is the world{"'"}s premier provider of temporal
              tourism. We combine cutting-edge chrono-displacement technology
              with five-star hospitality to deliver unforgettable journeys
              through the ages.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Every voyage is meticulously planned by our team of historians,
              safety engineers, and luxury concierges. Whether you want to
              witness the construction of the pyramids, dine in ancient Rome, or
              walk among dinosaurs, we guarantee an experience beyond your
              wildest imagination.
            </p>

            {/* Features */}
            <div className="mt-10 flex flex-col gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease, delay: 0.3 + i * 0.15 }}
                  className="group flex gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/20 group-hover:shadow-lg group-hover:shadow-primary/10"
                  >
                    <feature.icon className="h-5 w-5 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
