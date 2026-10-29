import * as motion from "motion/react-client";
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

export default function Header() {
  return (
    <Section id="home" className={styles.home} animate={false}>
      <div className={`${styles.header} app__flex`}>
        <motion.div
          whileInView={{ x: [-100, 0], opacity: [0, 1] }}
          transition={{ duration: 0.5 }}
          className={styles.info}
        >
          <div className={styles.badge}>
            <div className={`${styles.badgeCmp} app__flex`}>
              <Image className={styles.wave} src={wave} alt="" />
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
        </motion.div>

        <motion.div
          whileInView={{ opacity: [0, 1] }}
          transition={{ duration: 0.5, delayChildren: 0.5 }}
          className={styles.img}
        >
          <Image src={profile} alt="Portrait of Naiyem" priority sizes="(max-width: 1200px) 100vw, 40vw" />
          <motion.img
            whileInView={{ scale: [0, 1] }}
            transition={{ duration: 1, ease: "easeInOut" }}
            src={circle.src}
            alt=""
            className={styles.overlayCircle}
          />
        </motion.div>

        <motion.div
          whileInView={{ scale: [0, 1], opacity: [0, 1] }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className={styles.circles}
        >
          {techCircles.map(({ src, alt }) => (
            <div className="app__flex" key={alt}>
              <Image src={src} alt={alt} sizes="150px" />
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
