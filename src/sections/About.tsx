import * as motion from "motion/react-client";
import Image from "next/image";

import Section from "@/components/Section";
import { getAbouts } from "@/lib/api";

import styles from "./About.module.scss";

export default async function About() {
  const abouts = await getAbouts();

  return (
    <Section id="about" className="app__whiteBg">
      <h2 className="head-text">
        I Know that good
        <span className="name-text"> Apps</span> <br />
        means good
        <span className="name-text"> Business</span>
      </h2>
      <div className={styles.profiles}>
        {abouts.map((about) => (
          <motion.div
            whileInView={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5, type: "tween" }}
            className={styles.item}
            key={about.id}
          >
            {about.image && <Image src={about.image} alt={about.title} width={440} height={340} sizes="(min-width: 2000px) 370px, 220px" />}
            <h3 className="bold-text" style={{ marginTop: 20 }}>
              {about.title}
            </h3>
            <p className="p-text" style={{ marginTop: 10 }}>
              {about.description}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
