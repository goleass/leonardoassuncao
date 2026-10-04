import type { SiteConfig } from "../../config/schema";
import { services, type Service } from "../../data/services";

// Nós JSON-LD (schema.org) publicados num único @graph por página (LD-01).

type Node = Record<string, unknown>;

export const NAME = "Leonardo Gomes Assunção";
/** Descrição da empresa: a mesma da página inicial. */
export const HOME_DESCRIPTION =
  "Criação de sites, sistemas web, integrações e software sob medida. Um único responsável técnico, do diagnóstico ao suporte. Atendimento em todo o Brasil.";

const AREA_SERVED = [
  { "@type": "City", name: "Canoas" },
  { "@type": "City", name: "Porto Alegre" },
  { "@type": "Country", name: "Brasil" },
];

const abs = (site: SiteConfig, path: string) => new URL(path, site.url).href;
const ref = (site: SiteConfig, id: string) => ({ "@id": abs(site, `/#${id}`) });
const sameAs = (site: SiteConfig) => (site.linkedin ? { sameAs: [site.linkedin] } : {});

/** Empresa, site e responsável: os mesmos em todas as páginas (LD-02 a LD-05, LD-09). */
export function siteNodes(site: SiteConfig): Node[] {
  const [locality, region] = site.cidade.split(",").map((part) => part.trim());
  return [
    {
      "@type": "ProfessionalService",
      ...ref(site, "empresa"),
      name: NAME,
      description: HOME_DESCRIPTION,
      url: abs(site, "/"),
      logo: abs(site, "/icon-512.png"),
      image: abs(site, "/og.png"),
      email: site.email,
      telephone: `+${site.whatsapp}`,
      taxID: site.cnpj,
      address: { "@type": "PostalAddress", addressLocality: locality, addressRegion: region, addressCountry: "BR" },
      areaServed: AREA_SERVED,
      founder: ref(site, "leonardo"),
      ...sameAs(site),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Serviços",
        itemListElement: services.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.name, url: abs(site, `/${s.slug}/`) },
        })),
      },
    },
    {
      "@type": "WebSite",
      ...ref(site, "site"),
      url: abs(site, "/"),
      name: NAME,
      inLanguage: "pt-BR",
      publisher: ref(site, "empresa"),
    },
    {
      "@type": "Person",
      ...ref(site, "leonardo"),
      name: NAME,
      jobTitle: "Desenvolvedor de software",
      worksFor: ref(site, "empresa"),
      ...sameAs(site),
    },
  ];
}

export function serviceNode(site: SiteConfig, service: Service): Node {
  return {
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: abs(site, `/${service.slug}/`),
    provider: ref(site, "empresa"),
    areaServed: AREA_SERVED,
  };
}

export function breadcrumbNode(site: SiteConfig, items: { name: string; path: string }[]): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, path }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: abs(site, path),
    })),
  };
}

export function faqNode(faq: { q: string; a: string }[]): Node {
  return {
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}

/** Texto do <script type="application/ld+json">; "<" escapado para o JSON nunca fechar a tag antes da hora (LD-08). */
export function jsonLdText(nodes: Node[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }).replace(/</g, "\\u003c");
}
