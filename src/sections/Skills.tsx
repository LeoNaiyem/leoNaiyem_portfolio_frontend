import * as motion from "motion/react-client";
import Image from "next/image";

import Section from "@/components/Section";
import { getExperiences, getSkills } from "@/lib/api";

import ExperienceTooltip from "./ExperienceTooltip";
import styles from "./Skills.module.scss";

export default async function Skills() {
  const [skills, experiences] = await Promise.all([getSkills(), getExperiences()]);

  return (
    <Section id="skills" className="app__whiteBg">
      <h2 className="head-text">
        Skills <span className="name-text">&</span> Experiences
      </h2>

      <div className={styles.container}>
        <ul className={styles.list}>
          {skills.map((skill) => (
            <motion.li
              whileInView={{ opacity: [0, 1] }}
              transition={{ duration: 0.5 }}
              className={`${styles.item} app__flex`}
              key={skill.id}
            >
              <div className="app__flex" style={skill.bg_color ? { backgroundColor: skill.bg_color } : undefined}>
                {skill.icon && <Image src={skill.icon} alt="" width={90} height={90} sizes="75px" />}
              </div>
              <p className="p-text">{skill.name}</p>
            </motion.li>
          ))}
        </ul>

        <div className={styles.exp}>
          {experiences.map((group) => (
            <div className={styles.expItem} key={group.year}>
              <div className={styles.expYear}>
                <p className="bold-text">{group.year}</p>
              </div>
              <div className={styles.expWorks}>
                {group.items.map((item) => {
                  const tooltipId = `experience-${item.id}`;

                  return (
                    <div key={item.id}>
                      <motion.div
                        whileInView={{ opacity: [0, 1] }}
                        transition={{ duration: 0.5 }}
                        className={styles.expWork}
                        data-tooltip-id={item.description ? tooltipId : undefined}
                      >
                        <h3 className="bold-text">{item.role}</h3>
                        <p className="p-text">{item.company}</p>
                      </motion.div>
                      {item.description && <ExperienceTooltip id={tooltipId}>{item.description}</ExperienceTooltip>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
