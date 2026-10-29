import * as motion from "motion/react-client";
import Image from "next/image";

import Section from "@/components/Section";
import { getBrands, getTestimonials } from "@/lib/api";

import styles from "./Testimonial.module.scss";
import TestimonialSlider from "./TestimonialSlider";

export default async function Testimonial() {
  const [testimonials, brands] = await Promise.all([getTestimonials(), getBrands()]);

  return (
    <Section id="testimonial" className="app__primaryBg">
      <h2 className="visually-hidden">Testimonials</h2>

      {testimonials.length > 0 && <TestimonialSlider testimonials={testimonials} />}

      <div className={`${styles.brands} app__flex`}>
        {brands.map((brand) => {
          const logo = brand.image && <Image src={brand.image} alt={brand.name} width={300} height={150} sizes="(min-width: 2000px) 210px, 150px" />;

          return (
            <motion.div whileInView={{ opacity: [0, 1] }} transition={{ duration: 0.5, type: "tween" }} key={brand.id}>
              {brand.url ? (
                <a href={brand.url} target="_blank" rel="noopener noreferrer">
                  {logo}
                </a>
              ) : (
                logo
              )}
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
