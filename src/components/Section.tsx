import { cacheLife } from "next/cache";
import * as motion from "motion/react-client";

import { getSettings } from "@/lib/api";
import type { SectionId } from "@/lib/site";

import NavigationDots from "./NavigationDots";
import SocialMedia from "./SocialMedia";

interface SectionProps {
  id: SectionId;
  /** Background utility class, e.g. `app__whiteBg`. */
  className?: string;
  /** Wraps the content in the fade-up reveal animation. */
  animate?: boolean;
  children: React.ReactNode;
}

/** Page section layout: social links, content, copyright and navigation dots. */
export default async function Section({ id, className = "", animate = true, children }: SectionProps) {
  const settings = await getSettings();

  return (
    <section id={id} className={`app__container ${className}`}>
      <SocialMedia socials={settings.socials} />

      <div className="app__wrapper app__flex">
        {animate ? (
          <motion.div
            whileInView={{ y: [100, 50, 0], opacity: [0, 0, 1] }}
            transition={{ duration: 0.8 }}
            className="app__section app__flex"
          >
            {children}
          </motion.div>
        ) : (
          children
        )}

        <Copyright />
      </div>

      <NavigationDots active={id} />
    </section>
  );
}

async function Copyright() {
  "use cache";
  cacheLife("days");

  return (
    <div className="copyright">
      <p className="p-text">
        ©{new Date().getFullYear()} <span>Naiyem</span>
      </p>
      <p className="p-text">All rights reserved</p>
    </div>
  );
}
