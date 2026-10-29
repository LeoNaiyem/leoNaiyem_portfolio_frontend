import type { IconType } from "react-icons";
import { BsGithub, BsGlobe, BsInstagram } from "react-icons/bs";
import { FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import type { Social, SocialPlatform } from "@/types/api";

const icons: Record<SocialPlatform, { icon: IconType; label: string }> = {
  github: { icon: BsGithub, label: "GitHub" },
  linkedin: { icon: FaLinkedinIn, label: "LinkedIn" },
  twitter: { icon: FaXTwitter, label: "X" },
  facebook: { icon: FaFacebookF, label: "Facebook" },
  instagram: { icon: BsInstagram, label: "Instagram" },
  youtube: { icon: FaYoutube, label: "YouTube" },
  website: { icon: BsGlobe, label: "Website" },
};

export default function SocialMedia({ socials }: { socials: Social[] }) {
  return (
    <div className="app__social">
      {socials.map(({ platform, url }) => {
        const { icon: Icon, label } = icons[platform] ?? icons.website;

        return (
          <a key={url} href={url} target="_blank" rel="noopener noreferrer me" aria-label={label}>
            <Icon />
          </a>
        );
      })}
    </div>
  );
}
