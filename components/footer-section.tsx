import ywc20Mono from "../public/logo-ywc20-mono.png";
import Image from "next/image";

export default function FooterSection() {
  return (
    <footer className="py-12">
      <div className="">
        <div className="flex flex-col md:flex-row justify-between items-center glass-card gradient-border p-6 rounded-[var(--radius)]">
          <div className="flex items-center mb-6 md:mb-0">
            <Image src={ywc20Mono} alt="YWC20 Logo" className="h-6 w-auto mr-2 text-primary" />
            <span className="font-semibold text-lg">YWC20 Assignment</span>
          </div>
          <div className="text-muted-foreground text-sm">
            © {2025} Ratchanon B. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}