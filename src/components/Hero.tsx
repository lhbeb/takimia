"use client";

import Image from 'next/image';
import React, { useEffect, useRef } from 'react';


const Hero = () => {
  const typingTextRef = useRef<HTMLSpanElement>(null);
  const placeholder = '\u00a0';

  // TYPING ANIMATION - PRESERVED EXACTLY
  useEffect(() => {
    const element = typingTextRef.current;
    if (!element) return;

    const words = ['Espresso Machines', 'Coffee Makers', 'Precision Grinders', 'Barista Essentials'];
    let isAnimating = true;
    let currentIndex = 0;

    const sleep = (duration: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, duration));

    const typeWord = async (word: string) => {
      element.textContent = '';
      const letters = word.split('');
      for (const letter of letters) {
        if (!isAnimating) return;
        element.textContent = `${element.textContent}${letter}`;
        await sleep(90);
      }
    };

    const deleteWord = async () => {
      while (isAnimating && (element.textContent?.length ?? 0) > 0) {
        element.textContent = element.textContent?.slice(0, -1) ?? '';
        await sleep(40);
      }
      element.textContent = placeholder;
    };

    const animateLoop = async () => {
      element.textContent = placeholder;

      while (isAnimating) {
        const word = words[currentIndex];

        await typeWord(word);
        if (!isAnimating) break;

        await sleep(2000);
        if (!isAnimating) break;

        await deleteWord();
        if (!isAnimating) break;

        await sleep(350);
        if (!isAnimating) break;

        currentIndex = (currentIndex + 1) % words.length;
      }
    };

    animateLoop();

    return () => {
      isAnimating = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container relative z-10 mx-auto px-4 py-8 md:py-10">
        <div className="mx-auto grid w-full max-w-7xl overflow-hidden rounded-xl shadow-xl md:min-h-[420px] md:grid-cols-[0.9fr_1.1fr] md:items-stretch">
          {/* Content panel */}
          <div className="order-2 flex w-full flex-col justify-center bg-[#2e3868] p-6 sm:p-8 md:order-1 md:p-10 lg:p-12">
            {/* Heading with typing animation */}
            <h1 className="max-w-[620px] text-2xl font-bold leading-tight text-[#F0F6FF] md:text-3xl lg:text-[38px]">
              <span
                ref={typingTextRef}
                className="mb-1 block h-[1.2em] text-[#F0F6FF]"
              >
                {placeholder}
              </span>
              <span className="block leading-tight">
                Craft the Perfect Cup of Coffee Every Morning with Takimia
              </span>
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-[580px] text-sm leading-relaxed text-[#F0F6FF]/90 md:text-base">
              Discover commercial-grade espresso machines, precision conical burr grinders, and automatic drip coffee makers engineered for optimal extraction, rich crema, and exceptional taste.
            </p>

            {/* Shop Now Button */}
            <a
              href="#products"
              className="mt-6 inline-flex w-fit items-center justify-center rounded-lg bg-white px-7 py-3 text-sm font-medium text-[#2e3868] shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f3f4f6] hover:shadow-lg"
            >
              Explore the Collection
            </a>
          </div>

          {/* Image panel */}
          <div className="relative order-1 min-h-[280px] overflow-hidden md:order-2 md:min-h-0 bg-[#161c36]">
            <Image
              src="/espersso1.jpg"
              alt="Takimia Commercial Espresso Machine"
              fill
              priority
              sizes="(max-width: 767px) 100vw, 45vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2e3868]/20 via-transparent to-transparent" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
