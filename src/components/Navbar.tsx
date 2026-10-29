"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import { HiMenuAlt4, HiX } from "react-icons/hi";

import logo from "@/assets/images/naiyem_logo.png";
import { NAV_ITEMS } from "@/lib/site";

import styles from "./Navbar.module.scss";

export default function Navbar({ resumeUrl }: { resumeUrl: string }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/#home" aria-label="Home">
          <Image src={logo} alt="Naiyem logo" priority />
        </Link>
      </div>
      <ul className={styles.links}>
        {NAV_ITEMS.map((item) => (
          <li className="app__flex p-text" key={`link-${item}`}>
            <div />
            <Link href={`/#${item}`}>{item}</Link>
          </li>
        ))}
      </ul>
      <a href={resumeUrl} className={styles.resume} download target="_blank" rel="noopener">
        <BsFillArrowDownCircleFill />
        Resume
      </a>
      <div className={styles.menu}>
        <button type="button" className={styles.iconButton} aria-label="Open menu" onClick={() => setOpen(true)}>
          <HiMenuAlt4 />
        </button>

        {open && (
          <motion.div
            className={styles.drawer}
            animate={{ x: [300, 0] }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          >
            <button type="button" className={styles.iconButton} aria-label="Close menu" onClick={() => setOpen(false)}>
              <HiX />
            </button>
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item}>
                  <Link href={`/#${item}`} onClick={() => setOpen(false)}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
