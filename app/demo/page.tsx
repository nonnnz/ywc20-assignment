"use client";

import { animate, createScope, createSpring, createDraggable } from "animejs";
import { useEffect, useRef, useState } from "react";
import { Scope } from "animejs";
import Image from "next/image";
import ywc20Logo from "../../public/ywc20-logo-main.webp";

function App() {
  const scope = useRef<Scope>(null);
  const [rotations, setRotations] = useState(0);

  useEffect(() => {
    scope.current = createScope().add((self) => {
      // Every anime.js instances declared here are now scopped to <div ref={root}>

      // Created a bounce animation loop
      animate(".logo", {
        scale: [
          { to: 1.25, ease: "inOut(3)", duration: 200 },
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

  const handleClick = () => {
    setRotations((prev) => {
      const newRotations = prev + 1;
      // Animate logo rotation on click using the method declared inside the scope
      scope.current?.methods.rotateLogo(newRotations);
      return newRotations;
    });
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="large centered row">
          {/* <Image
            className="logo w-auto h-50"
            src="/ywc20-logo-main.webp"
            alt="YWC20 Logo"
            width={0}
            height={0}
            priority
          /> */}
          <Image src={ywc20Logo} alt="YWC20 Logo" className="logo h-50 w-auto" />
        </div>
        <div className="medium row">
          <fieldset className="controls">
            <button onClick={handleClick}>rotations: {rotations}</button>
            <p className="h1 font-bold text-2xl">ภาษาไทย</p>
            <p>English</p>
          </fieldset>
        </div>
      </main>
    </div>
  );
}

export default App;
