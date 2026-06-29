import { HomePage } from "@/components/home-page";
import { getSiteContent } from "@/lib/content/php-api";

export default async function Home() {
  const content = await getSiteContent();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hallwicks.com";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Hallwicks Design Limited",
    alternateName: "HALLWICKS",
    url: siteUrl,
    logo: `${siteUrl}/images/brand/hallwicks-mark.png`,
    image: `${siteUrl}/images/projects/great-people-shanghai-02.png`,
    foundingDate: "1987",
    areaServed: ["Hong Kong", "China", "Singapore"],
    email: "hallwicks@gmail.com",
    serviceType: [
      "Clinical interior architecture",
      "Medical centre design",
      "Dental clinic design",
      "Day procedure centre design",
      "Laboratory design",
      "Veterinary hospital design",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePage content={content} />
    </>
  );
}
