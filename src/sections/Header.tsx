import Image from "next/image";

import circle from "@/assets/images/circle.svg";
import laravel from "@/assets/images/laravel.png";
import profile from "@/assets/images/profile.png";
import react from "@/assets/images/react.png";
import tailwind from "@/assets/images/tailwind.png";
import wave from "@/assets/images/waving_hand.png";
import Section from "@/components/Section";

import styles from "./Header.module.scss";

const techCircles = [
  { src: laravel, alt: "Laravel" },
  { src: react, alt: "React" },
  { src: tailwind, alt: "Tailwind CSS" },
];

// The hero animates with CSS rather than motion: it is above the fold, so a
// JS-driven animation would hide it until hydration and delay the LCP.
export default function Header() {
  return (
    <Section id="home" className={styles.home} animate={false}>
      <div className={`${styles.header} app__flex`}>
        <div className={styles.info}>
          <div className={styles.badge}>
            <div className={`${styles.badgeCmp} app__flex`}>
              <Image className={styles.wave} src={wave} alt="" sizes="(min-width: 2000px) 80px, 45px" />
              <div style={{ marginLeft: 20 }}>
                <p className="p-text">Hello, I am</p>
                <h1 className="head-text name-text">Naiyem</h1>
              </div>
            </div>

            <div className={`${styles.tagCmp} app__flex`}>
              <p className="p-text">Web Developer</p>
              <p className="p-text">Freelancer</p>
            </div>
          </div>
        </div>

        <div className={styles.img}>
          <Image src={profile} alt="Portrait of Naiyem" priority sizes="(max-width: 1200px) 100vw, 40vw" />
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG, nothing to optimize */}
          <img src={circle.src} alt="" className={styles.overlayCircle} />
        </div>

        <div className={styles.circles}>
          {techCircles.map(({ src, alt }) => (
            <div className="app__flex" key={alt}>
              <Image src={src} alt={alt} sizes="(min-width: 2000px) 240px, 90px" />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
