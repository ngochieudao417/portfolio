import type { Metadata } from "next";
import { Contact } from "@/components/contact/Contact";
import { isContactConfigured } from "@/lib/contact/providers";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Đào Ngọc Hiếu about AI, R&D, automation and data opportunities.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="pt-16">
      <h1 className="sr-only">Contact — Đào Ngọc Hiếu</h1>
      <Contact formEnabled={isContactConfigured()} />
    </div>
  );
}
