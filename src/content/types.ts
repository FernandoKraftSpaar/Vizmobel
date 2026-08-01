export const LANGS = ['pt', 'de'] as const
export type Lang = (typeof LANGS)[number]

// A peca central do modelo de conteudo. Como Localized e um Record fechado
// sobre Lang, esquecer a traducao alema de um unico texto quebra o build.
// Traducao faltando nunca chega em producao como string vazia.
export type Localized = Record<Lang, string>

export type Metric = {
  value: number
  decimals: number
  prefix: string
  suffix: string
  label: Localized
}

export type Service = { id: string; title: Localized; body: Localized }
export type Step = { title: Localized; body: Localized }
export type Member = {
  name: string
  initials: string
  place: string
  role: Localized
}

export type HeroSection = {
  kind: 'hero'
  eyebrow: Localized
  headline: Localized
  sub: Localized
  cta: Localized
  cardTitle: Localized
  cardMeta: Localized
}

export type NumbersSection = {
  kind: 'numbers'
  heading: Localized
  metrics: Metric[]
}

export type ServicesSection = {
  kind: 'services'
  heading: Localized
  intro: Localized
  services: Service[]
}

export type AboutSection = {
  kind: 'about'
  heading: Localized
  paragraphs: Localized[]
}

export type ProcessSection = {
  kind: 'process'
  heading: Localized
  steps: Step[]
}

export type TeamSection = {
  kind: 'team'
  heading: Localized
  members: Member[]
}

export type CtaSection = {
  kind: 'cta'
  headline: Localized
  button: Localized
  note: Localized
}

export type Section =
  | HeroSection
  | NumbersSection
  | ServicesSection
  | AboutSection
  | ProcessSection
  | TeamSection
  | CtaSection

export type SectionKind = Section['kind']

export type NavItem = { id: SectionKind; label: Localized }

export type SiteContent = {
  brand: string
  nav: NavItem[]
  sections: Section[]
}
