"use client";

import Image from "next/image";
import { useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

import type { Testimonial } from "@/types/api";

import styles from "./Testimonial.module.scss";

export default function TestimonialSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = testimonials[currentIndex];
  const count = testimonials.length;

  return (
    <>
      <figure className={`${styles.item} app__flex`} aria-live="polite">
        {current.image && <Image src={current.image} alt={current.name} width={300} height={300} sizes="(min-width: 2000px) 150px, 100px" />}
        <div className={styles.content}>
          <blockquote className="p-text">{current.feedback}</blockquote>
          <figcaption>
            <h3 className="bold-text">{current.name}</h3>
            <p className="p-text">{current.company}</p>
          </figcaption>
        </div>
      </figure>

      {count > 1 && (
        <div className={`${styles.btns} app__flex`}>
          <button
            type="button"
            className="app__flex"
            aria-label="Previous testimonial"
            onClick={() => setCurrentIndex((currentIndex - 1 + count) % count)}
          >
            <HiChevronLeft />
          </button>

          <button
            type="button"
            className="app__flex"
            aria-label="Next testimonial"
            onClick={() => setCurrentIndex((currentIndex + 1) % count)}
          >
            <HiChevronRight />
          </button>
        </div>
      )}
    </>
  );
}
