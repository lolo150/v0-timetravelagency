"use client";

import { useState, useRef, useCallback } from "react";
/* Using native img for external blob URLs to avoid next/image hostname config issues */
import { Button } from "@/components/ui/button";
import {
  Landmark,
  Building2,
  UtensilsCrossed,
  TreePine,
  Mountain,
  Bird,
  Palette,
  BookOpen,
  Globe,
  ArrowRight,
  ImageOff,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useBooking, type DestinationKey } from "@/components/booking-context";

const destinations = [
  {
    title: "Paris 1889 - Belle Epoque",
    bookingKey: "paris" as DestinationKey,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/paris%203-7xVbK7XG3qlDyV3KqKvhp5kbg2PHeW.png",
    alt: "Belle Epoque Paris in 1889 with the Eiffel Tower under construction, elegantly dressed crowds in period clothing on cobblestone streets at golden sunset",
    description:
      "Experience the glamour of the Universal Exhibition and see the Eiffel Tower during its inauguration year.",
    price: "12,000",
    features: [
      { icon: Landmark, label: "Culture" },
      { icon: Building2, label: "Architecture" },
      { icon: UtensilsCrossed, label: "Gastronomy" },
    ],
  },
  {
    title: "Cretaceous Period - 65M Years Ago",
    bookingKey: "cretaceous" as DestinationKey,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-wHwKZUahKnOLrk1LTxHKHxqVd6mrOO.png",
    alt: "Dramatic prehistoric scene with a T-Rex and Triceratops facing off in a lush tropical jungle with misty mountains and golden morning light",
    description:
      "Witness majestic dinosaurs in their natural habitat during Earth's most fascinating era.",
    price: "25,000",
    features: [
      { icon: TreePine, label: "Nature" },
      { icon: Mountain, label: "Adventure" },
      { icon: Bird, label: "Wildlife" },
    ],
  },
  {
    title: "Florence 1504 - Renaissance",
    bookingKey: "florence" as DestinationKey,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-tcErzQqFoDGlpmSOXLEqjJfhy89gxx.png",
    alt: "Renaissance Florence street scene with the Duomo cathedral dome, people in period clothing walking through cobblestone streets at golden hour",
    description:
      "Walk the streets where Michelangelo and Leonardo da Vinci created masterpieces.",
    price: "15,000",
    features: [
      { icon: Palette, label: "Art" },
      { icon: BookOpen, label: "History" },
      { icon: Globe, label: "Culture" },
    ],
  },
];

function DestinationImage({
  src,
  alt,
  price,
}: {
  src: string;
  alt: string;
  price: string;
}) {
  return (
    <div className="relative h-60 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/20 to-transparent transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="absolute right-4 top-4 glass rounded-full px-3 py-1 transition-transform duration-300 group-hover:scale-105">
        <span className="text-sm font-semibold text-primary">
          From €{price}
        </span>
      </div>
    </div>
  );
}


function TiltCard({
  children,
  index,
  isVisible,
}: {
  children: React.ReactNode;
  index: number;
  isVisible: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-all duration-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
      style={{
        transitionDelay: isVisible ? `${index * 150}ms` : "0ms",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

export function DestinationsSection() {
  const { openBooking } = useBooking();
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.05 });
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section
      ref={sectionRef}
      id="destinations"
      className="section-gradient-2 relative py-24 lg:py-32"
    >
      {/* Subtle divider with glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div
          className={`mb-16 text-center transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <span className="text-xs font-medium tracking-widest text-primary uppercase">
            Where will you go?
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-foreground md:text-5xl text-balance">
            Featured Destinations
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Explore our curated collection of temporal destinations, each
            offering a unique window into a remarkable era.
          </p>
        </div>

        {/* Destination Cards Grid */}
        <div ref={cardsRef} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest, i) => (
            <TiltCard key={dest.title} index={i} isVisible={cardsVisible}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-500 hover:border-primary/40 glow-gold-hover">
                {/* Image */}
                <DestinationImage
                  src={dest.image}
                  alt={dest.alt}
                  price={dest.price}
                />

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                    {dest.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {dest.description}
                  </p>

                  {/* Feature Icons */}
                  <div className="mt-4 flex gap-3">
                    {dest.features.map((f) => (
                      <div
                        key={f.label}
                        className="flex items-center gap-1.5 rounded-full border border-border/50 bg-secondary/50 px-3 py-1 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-primary/10"
                      >
                        <f.icon className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-medium text-secondary-foreground">
                          {f.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button
                    variant="outline"
                    onClick={() => openBooking(dest.bookingKey)}
                    className="mt-6 w-full gap-2 border-primary/30 bg-transparent text-foreground transition-all duration-300 hover:border-primary/60 hover:bg-primary/10 hover:text-foreground hover:shadow-lg hover:shadow-primary/10"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>
              </article>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
