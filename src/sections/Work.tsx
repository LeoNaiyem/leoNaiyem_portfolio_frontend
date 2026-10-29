import Section from "@/components/Section";
import { getProjects, getTags } from "@/lib/api";

import WorkGrid from "./WorkGrid";

export default async function Work() {
  const [projects, tags] = await Promise.all([getProjects(), getTags()]);

  return (
    <Section id="work" className="app__primaryBg">
      <h2 className="head-text">
        Projects <span className="name-text">i have</span> made
      </h2>

      <WorkGrid projects={projects} tags={tags} />
    </Section>
  );
}
