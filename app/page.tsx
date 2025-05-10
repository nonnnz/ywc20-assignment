"use client";

import HeroSection from "@/components/hero-section";
import SearchSection from "@/components/search/search-section";

export default function Home() {
  return (
    <main className="flex-1 bg-background">
      <HeroSection />

      {/* Search Section */}
      <section className="">
        <div className="">
          <div className="max-w-2xl mx-auto">
            <div className="glass-card gradient-border p-8 rounded-[var(--radius)]">
              <SearchSection />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
