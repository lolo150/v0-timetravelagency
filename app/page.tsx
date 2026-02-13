import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { AgencySection } from "@/components/agency-section";
import { DestinationsSection } from "@/components/destinations-section";
import { ChatbotWidget } from "@/components/chatbot-widget";
import { Footer } from "@/components/footer";
import { BookingProvider } from "@/components/booking-context";
import { BookingModal } from "@/components/booking-modal";

export default function HomePage() {
  return (
    <BookingProvider>
      <main>
        <Header />
        <Hero />
        <AgencySection />
        <DestinationsSection />
        <Footer />
        <ChatbotWidget />
        <BookingModal />
      </main>
    </BookingProvider>
  );
}
