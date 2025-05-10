"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import ywc20Mono from "../public/logo-ywc20-mono.png";
import Image from "next/image";

const navigation = [
  { name: 'Home', href: '#home' },
];

export default function HeaderSection() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          <Link href="#home" className="flex items-center space-x-2">
            <Image src={ywc20Mono} alt="YWC20 Logo" className="h-6 w-auto mr-2 text-primary" />
          </Link>
          
          <div className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}