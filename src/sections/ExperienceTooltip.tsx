"use client";

import { Tooltip } from "react-tooltip";

export default function ExperienceTooltip({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <Tooltip id={id} className="skills-tooltip" arrowColor="#fff">
      {children}
    </Tooltip>
  );
}
