"use client";

import Script from "next/script";
import { useState } from "react";

import styles from "./Contact.module.scss";

declare global {
  interface Window {
    turnstile?: { reset: (widget?: string) => void };
  }
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Status = "idle" | "sending" | "sent";

/**
 * Posts straight from the browser to Laravel so its per-IP rate limit and
 * Turnstile check see the visitor, not this server.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setError("Please fill out the form properly.");
      return;
    }

    setError(null);
    setStatus("sending");

    try {
      const res = await fetch(`${API_URL}/api/v1/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          website: form.get("website") || undefined,
          turnstile_token: form.get("cf-turnstile-response") || undefined,
        }),
      });

      if (res.ok) {
        setStatus("sent");
        return;
      }

      setError(await errorMessage(res));
    } catch {
      setError("Couldn't reach the server. Please check your connection and try again.");
    }

    setStatus("idle");
    window.turnstile?.reset();
  };

  if (status === "sent") {
    return (
      <div>
        <h3 className={styles.thanks}>Thank you for getting in touch!</h3>
      </div>
    );
  }

  return (
    <form className={`${styles.form} app__flex`} onSubmit={handleSubmit} noValidate>
      <div className={`${styles.field} app__flex`}>
        <input className="p-text" type="text" placeholder="Your Name" name="name" aria-label="Your name" autoComplete="name" maxLength={100} required />
      </div>
      <div className={`${styles.field} app__flex`}>
        <input className="p-text" type="email" placeholder="Your Email" name="email" aria-label="Your email" autoComplete="email" maxLength={255} required />
      </div>
      <div className={styles.field}>
        <textarea className="p-text" placeholder="Your Message" name="message" aria-label="Your message" maxLength={5000} required />
      </div>

      {/* Honeypot: hidden from people, so only bots fill it in. */}
      <div className="visually-hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {TURNSTILE_SITE_KEY && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
          <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} />
        </>
      )}

      <button type="submit" className="p-text" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>

      {error && (
        <p role="alert">
          <small className={styles.error}>{error}</small>
        </p>
      )}
    </form>
  );
}

async function errorMessage(res: Response): Promise<string> {
  if (res.status === 429) {
    return "You've sent several messages already. Please try again later.";
  }

  if (res.status === 422) {
    const body = (await res.json().catch(() => null)) as { errors?: Record<string, string[]> } | null;
    const first = body?.errors && Object.values(body.errors)[0]?.[0];
    if (first) {
      return first;
    }
  }

  return "Something went wrong. Please try again.";
}
