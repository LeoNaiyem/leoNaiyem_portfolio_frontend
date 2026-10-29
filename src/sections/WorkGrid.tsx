"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AiFillEye, AiFillGithub } from "react-icons/ai";

import type { Project, Tag } from "@/types/api";

import styles from "./Work.module.scss";

const ALL = "all";

export default function WorkGrid({ projects, tags }: { projects: Project[]; tags: Tag[] }) {
  const [activeFilter, setActiveFilter] = useState(ALL);
  const [visible, setVisible] = useState(projects);
  const [animateCard, setAnimateCard] = useState({ y: 0, opacity: 1 });
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const filters = [{ slug: ALL, name: "All" }, ...tags];

  const handleFilter = (slug: string) => {
    setActiveFilter(slug);
    setAnimateCard({ y: 100, opacity: 0 });

    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setAnimateCard({ y: 0, opacity: 1 });
      setVisible(slug === ALL ? projects : projects.filter((project) => project.tags.some((tag) => tag.slug === slug)));
    }, 500);
  };

  return (
    <>
      <div className={styles.filter} role="group" aria-label="Filter projects">
        {filters.map((filter) => (
          <button
            type="button"
            className={`${styles.filterItem} p-text app__flex ${activeFilter === filter.slug ? styles.active : ""}`}
            aria-pressed={activeFilter === filter.slug}
            key={filter.slug}
            onClick={() => handleFilter(filter.slug)}
          >
            {filter.name}
          </button>
        ))}
      </div>

      <motion.div animate={animateCard} transition={{ duration: 0.5, delayChildren: 0.5 }} className={styles.portfolio}>
        {visible.map((project) => (
          <article className={styles.item} key={project.id}>
            <div className={`${styles.img} app__flex`}>
              {project.image && (
                <Image src={project.image} alt={project.title} width={540} height={460} sizes="(min-width: 2000px) 470px, 270px" />
              )}

              <motion.div
                whileHover={{ opacity: [0, 1] }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className={`${styles.hover} app__flex`}
              >
                {project.project_url && (
                  <a href={project.project_url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title}`}>
                    <HoverIcon>
                      <AiFillEye />
                    </HoverIcon>
                  </a>
                )}
                {project.code_url && (
                  <a href={project.code_url} target="_blank" rel="noopener noreferrer" aria-label={`Source code of ${project.title}`}>
                    <HoverIcon>
                      <AiFillGithub />
                    </HoverIcon>
                  </a>
                )}
              </motion.div>
            </div>

            <div className={`${styles.content} app__flex`}>
              <h3 className="bold-text">
                <Link href={`/projects/${project.slug}`}>{project.title}</Link>
              </h3>
              <p className="p-text" style={{ marginTop: 10 }}>
                {project.description}
              </p>

              {project.tags[0] && (
                <div className={styles.tag}>
                  <p className="p-text">{project.tags[0].name}</p>
                </div>
              )}
            </div>
          </article>
        ))}
      </motion.div>
    </>
  );
}

function HoverIcon({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileInView={{ scale: [0, 1] }}
      whileHover={{ opacity: [1, 0.9] }}
      transition={{ duration: 0.25 }}
      className="app__flex"
    >
      {children}
    </motion.div>
  );
}
