"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Particles } from "@/components/particles";

const VIDEOS = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Paris-2oV7auusEDuKZYozhxKVYpqAMkRu5q.mp4",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Dino-xKCcdJ8YZ90sZ7B5WYLzvsDRzxGzn4.mp4",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/italie-DwRkxirTaI4FOunBy25AhtE3e6mKVB.mp4",
];

const DISPLAY_DURATION = 8000;
const FADE_DURATION = 1500;

const ease = [0.6, -0.05, 0.01, 0.99] as const;

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [isFading, setIsFading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], ["0px", "80px"]);

  const startTransition = useCallback(() => {
    const next = (activeIndex + 1) % VIDEOS.length;
    setNextIndex(next);
    setIsFading(true);
    setTimeout(() => {
      setActiveIndex(next);
      setNextIndex(null);
      setIsFading(false);
    }, FADE_DURATION);
  }, [activeIndex]);

  useEffect(() => {
    timerRef.current = setTimeout(startTransition, DISPLAY_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIndex, startTransition]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Video Backgrounds with Parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y: prefersReducedMotion ? 0 : parallaxY }}
      >
        {VIDEOS.map((src, i) => {
          const isActive = i === activeIndex;
          const isNext = i === nextIndex;
          const show = isActive || isNext;
          return (
            <video
              key={src}
              src={src}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-[120%] w-full object-cover transition-opacity"
              style={{
                opacity: show
                  ? isNext && isFading ? 1
                  : isActive && isFading ? 0
                  : isActive ? 1
                  : 0 : 0,
                transitionDuration: `${FADE_DURATION}ms`,
                zIndex: isNext ? 1 : 0,
              }}
            />
          );
        })}
      </motion.div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-background/70 via-background/50 to-background/80" />

      {/* Floating Particles */}
      <Particles count={35} />

      {/* Decorative Orbiting Elements */}
      <div className="pointer-events-none absolute inset-0 z-[3]">
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <div className="h-[400px] w-[400px] rounded-full border border-primary/[0.07] md:h-[600px] md:w-[600px]">
            <div className="absolute -top-1 left-1/2 h-2 w-2 rounded-full bg-primary/30" />
          </div>
        </motion.div>
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        >
          <div className="h-[300px] w-[300px] rounded-full border border-primary/[0.05] md:h-[450px] md:w-[450px]">
            <div className="absolute -bottom-1 right-1/4 h-1.5 w-1.5 rounded-full bg-primary/20" />
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
        style={{ opacity: prefersReducedMotion ? 1 : contentOpacity, y: prefersReducedMotion ? 0 : contentY }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 backdrop-blur-sm"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <span className="text-xs font-medium tracking-widest text-primary uppercase">
            Now accepting travelers
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.3 }}
          className="font-serif text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl"
        >
          <span className="text-balance">TimeTravel</span>
          <br />
          <span className="text-gradient-gold">Agency</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.5 }}
          className="mx-auto mt-6 max-w-lg font-serif text-lg text-primary/80 italic md:text-xl"
        >
          Your Journey Through Time Begins Here
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.7 }}
          className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          We offer exclusive, luxury time travel experiences to history{"'"}s most
          extraordinary moments. From the birth of civilizations to the age of
          dinosaurs, your adventure awaits.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.9 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="gap-2 bg-primary px-8 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-95"
          >
            <a href="#destinations">
              Explore Destinations
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="gap-2 border-primary/30 bg-transparent text-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/60 hover:bg-primary/10 hover:text-foreground active:scale-95"
          >
            <a href="#about">
              <MessageCircle className="h-4 w-4" />
              Talk to an Expert
            </a>
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-20 flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-widest text-muted-foreground uppercase">
            Scroll to explore
          </span>
          <motion.div
            className="flex h-8 w-5 items-start justify-center rounded-full border border-primary/30 p-1"
          >
            <motion.div
              className="h-2 w-1 rounded-full bg-primary/60"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
