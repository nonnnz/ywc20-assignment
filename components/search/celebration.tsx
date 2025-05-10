"use client";

import { useEffect, useRef } from 'react';
import confetti from "canvas-confetti";
import { animate, createScope, Scope } from 'animejs';

export function Celebration({ targetRef }: { targetRef: React.RefObject<HTMLDivElement | null> }) {
  const scopeRef = useRef<Scope | null>(null);
    useEffect(() => {
    // Trigger confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      confetti({
        particleCount: 20,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 20,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });
 
    }, 250);

    // Animate the result card
    scopeRef.current = createScope().add(() => {
        if (targetRef.current) {
          animate(targetRef.current, {
            scale: [0.9, 1],
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            ease: 'spring(1, 80, 10, 0)',
          });
        }
      });
  
      return () => {
        clearInterval(interval);
        scopeRef.current?.revert();
      };
    }, [targetRef]);

    return null;
  }