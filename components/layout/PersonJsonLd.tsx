import { education } from "@/content/education";
import { journey } from "@/content/journey";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { skills } from "@/content/skills";

/** schema.org Person — built only from configured, factual content. */
export function PersonJsonLd() {
  const school = education[0];
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: profile.asciiName,
    jobTitle: profile.roleText.en,
    url: site.url,
    ...(profile.email ? { email: `mailto:${profile.email}` } : {}),
    address: { "@type": "PostalAddress", addressLocality: "Hanoi", addressCountry: "VN" },
    ...(school ? { alumniOf: { "@type": "CollegeOrUniversity", name: school.institution } } : {}),
    award: [
      ...journey.filter((item) => item.type === "award").map((item) => `${item.org} — ${item.role.en}`),
      ...(school?.achievements.map((achievement) => achievement.title.en) ?? []),
    ],
    knowsAbout: Array.from(new Set(skills.flatMap((group) => group.items))).slice(0, 20),
    sameAs: [profile.socials.github, profile.socials.linkedin].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
