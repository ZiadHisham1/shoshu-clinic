"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { copy, siteConfig } from "@/lib/constants";
import {
  ctaReveal,
  fadeIn,
  fadeInUp,
  floatLoop,
  staggerContainer,
  wordReveal,
  wordStagger,
} from "@/lib/motion";
import { ButtonLink } from "@/components/ui/Button";
import Image from "next/image";

const HeroSection = () => {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const blobY = useTransform(scrollY, [0, 500], [0, reduceMotion ? 0 : 80]);
  const enter = reduceMotion ? fadeIn : fadeInUp;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex w-full min-h-[250px] items-center overflow-hidden py-16 sm:py-20"
    >
      <div className="h-32">
        {/* BACKGROUND IMAGE — fills the entire section */}
        <Image
          src="/img/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-left h-auto -z-20"
        />
      </div>

      {/* Blur blobs */}
      <motion.div
        aria-hidden
        style={{ y: blobY }}
        className="absolute -start-20 -top-10 -z-10 size-72 rounded-full bg-accent/40 blur-3xl"
      />
      <motion.div
        aria-hidden
        {...(reduceMotion ? {} : floatLoop)}
        className="absolute -end-10 top-24 -z-10 size-56 rounded-full bg-primary/10 blur-3xl"
      />

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative z-10 flex w-full items-center"
      >
        <div className="relative flex-1">
          <motion.h1
            id="hero-title"
            variants={wordStagger}
            className="text-[clamp(1.875rem,7vw,3.5rem)] font-black leading-[1.25] text-foreground"
          >
            {copy.heroLines.map((line) => (
              <span key={line} className="block">
                {line.split(" ").map((word, i) => (
                  <motion.span
                    key={`${word}-${i}`}
                    variants={reduceMotion ? fadeIn : wordReveal}
                    className="me-2 inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.h1>

          <motion.ul
            variants={enter}
            className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted"
          >
            {copy.treatments.map((item, i) => (
              <li key={item} className="flex items-center gap-3">
                {i > 0 && (
                  <span
                    aria-hidden
                    className="size-1 rounded-full bg-muted"
                  />
                )}
                {item}
              </li>
            ))}
          </motion.ul>

          <motion.div
            variants={reduceMotion ? fadeIn : ctaReveal}
            className="mt-6 flex flex-wrap gap-3"
          >
            <ButtonLink href={siteConfig.bookingUrl} size="lg">
              {copy.bookNow}
            </ButtonLink>
            <ButtonLink href="#services" variant="secondary" size="lg">
              {copy.servicesCta}
            </ButtonLink>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;