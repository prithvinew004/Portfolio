import { Hero } from "@/components/sections/hero";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { GitHubActivity } from "@/components/sections/github-activity";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <Skills />
      <Experience />
      <GitHubActivity />
      <Contact />
    </main>
  );
}
