"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import ywc20Logo from "../public/ywc20-logo-main.webp";
import { useEffect, useRef } from "react";
import { Scope } from "animejs";
import { animate, createDraggable, createScope, createSpring } from "animejs";

export default function HeroSection() {
    const scope = useRef<Scope>(null);

  useEffect(() => {
    scope.current = createScope().add((self) => {
      // Every anime.js instances declared here are now scopped to <div ref={root}>

      // Created a bounce animation loop
      animate(".logo", {
        scale: [
          { to: 1.1, ease: "inOut(3)", duration: 200 },
          { to: 1, ease: createSpring({ stiffness: 300 }) },
        ],
        loop: true,
        loopDelay: 250,
      });

      // Make the logo draggable around its center
      createDraggable(".logo", {
        container: [0, 0, 0, 0],
        releaseEase: createSpring({ stiffness: 200 }),
      });

      // Register function methods to be used outside the useEffect
      self.add("rotateLogo", (i) => {
        animate(".logo", {
          rotate: i * 360,
          ease: "out(4)",
          duration: 1500,
        });
      });
    });

    // Properly cleanup all anime.js instances declared inside the scope
    return () => scope.current?.revert();
  }, []);
  return (
    <section className="flex flex-col items-center justify-center">
      <div className="relative flex flex-col h-[50rem] w-full items-center justify-center bg-background">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] bg-background"></div>
      <Image src={ywc20Logo} alt="YWC20 Logo" className="logo h-50 w-auto max-sm:h-30 max-md:h-40"/>
      </div>
  
      </section>
  );
}
