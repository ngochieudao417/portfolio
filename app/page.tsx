import { About } from "@/components/about/About";
import { BeyondTech } from "@/components/beyond-tech/BeyondTech";
import { Certifications } from "@/components/certifications/Certifications";
import { Contact } from "@/components/contact/Contact";
import { Education } from "@/components/education/Education";
import { Hero } from "@/components/hero/Hero";
import { CareerJourney } from "@/components/journey/CareerJourney";
import { PersonJsonLd } from "@/components/layout/PersonJsonLd";
import { Projects } from "@/components/projects/Projects";
import { RecruiterSummary } from "@/components/recruiter-mode/RecruiterSummary";
import { ResearchLab } from "@/components/research/ResearchLab";
import { Skills } from "@/components/skills/Skills";
import { isContactConfigured } from "@/lib/contact/providers";

export default function HomePage() {
  return (
    <>
      <PersonJsonLd />
      <Hero />
      <RecruiterSummary />
      <About />
      <Projects />
      <ResearchLab />
      <CareerJourney />
      <Skills />
      <Education />
      <Certifications />
      <BeyondTech />
      <Contact formEnabled={isContactConfigured()} />
    </>
  );
}
