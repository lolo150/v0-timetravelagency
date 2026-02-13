"use client";

import { createContext, useContext, useState, useCallback } from "react";

export type DestinationKey = "paris" | "florence" | "cretaceous" | "";

interface BookingContextValue {
  isOpen: boolean;
  preselectedDestination: DestinationKey;
  openBooking: (destination?: DestinationKey) => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextValue>({
  isOpen: false,
  preselectedDestination: "",
  openBooking: () => {},
  closeBooking: () => {},
});

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedDestination, setPreselectedDestination] =
    useState<DestinationKey>("");

  const openBooking = useCallback((destination: DestinationKey = "") => {
    setPreselectedDestination(destination);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeBooking = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "";
  }, []);

  return (
    <BookingContext.Provider
      value={{ isOpen, preselectedDestination, openBooking, closeBooking }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}
