import JsonLd from "@/components/JsonLd";
import { getSettings } from "@/lib/api";
import { FALLBACK_NAME, SITE_URL } from "@/lib/site";
import About from "@/sections/About";
import Contact from "@/sections/Contact";
import Header from "@/sections/Header";
import Skills from "@/sections/Skills";
import Testimonial from "@/sections/Testimonial";
import Work from "@/sections/Work";

export default async function Home() {
  const settings = await getSettings();

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: settings.name ?? FALLBACK_NAME,
          jobTitle: settings.title ?? undefined,
          description: settings.bio ?? undefined,
          email: settings.email ? `mailto:${settings.email}` : undefined,
          image: settings.avatar ?? undefined,
          url: SITE_URL,
          sameAs: settings.socials.map((social) => social.url),
        }}
      />
      <Header />
      <About />
      <Work />
      <Skills />
      <Testimonial />
      <Contact />
    </main>
  );
}
