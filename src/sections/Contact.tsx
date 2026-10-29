import Image from "next/image";

import emailIcon from "@/assets/images/email.png";
import mobileIcon from "@/assets/images/mobile.png";
import Section from "@/components/Section";
import { getSettings } from "@/lib/api";
import { FALLBACK_EMAIL, PHONE } from "@/lib/site";

import styles from "./Contact.module.scss";
import ContactForm from "./ContactForm";

export default async function Contact() {
  const settings = await getSettings();
  const email = settings.email ?? FALLBACK_EMAIL;

  return (
    <Section id="contact" className="app__whiteBg">
      <h2 className="head-text">
        Take a <span className="name-text">coffee & chat</span> with me
      </h2>

      <div className={styles.cards}>
        <div className={styles.card}>
          <Image src={emailIcon} alt="" sizes="40px" />
          <a href={`mailto:${email}`} className="p-text">
            {email}
          </a>
        </div>
        <div className={styles.card}>
          <Image src={mobileIcon} alt="" sizes="40px" />
          <a href={PHONE.href} className="p-text">
            {PHONE.label}
          </a>
        </div>
      </div>

      <ContactForm />
    </Section>
  );
}
