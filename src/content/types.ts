export const LANGS = ['pt', 'de'] as const
export type Lang = (typeof LANGS)[number]

// Como Localized e um Record fechado sobre Lang, esquecer a traducao alema de
// um unico texto quebra o build.
export type Localized = Record<Lang, string>

/** Lado por onde o elemento entra na tela. */
export type Side = 'left' | 'right'

export type Metric = {
  value: number
  decimals: number
  prefix: string
  suffix: string
  label: Localized
}

export type HeroSection = {
  kind: 'hero'
  headline: Localized
  sub: Localized
  cta: Localized
  cue: Localized
}

export type StageSection = {
  kind: 'stage'
  caption: Localized
  modelName: Localized
  modelMeta: Localized
}

export type QuestionsSection = {
  kind: 'questions'
  questions: { id: string; side: Side; text: Localized }[]
}

export type AnswerSection = {
  kind: 'answer'
  statement: Localized
  followUp: Localized
  metrics: Metric[]
}

export type SolutionSection = {
  kind: 'solution'
  headline: Localized
  attributes: { id: string; side: Side; title: Localized; body: Localized }[]
}

export type FlowSection = {
  kind: 'flow'
  heading: Localized
  intro: Localized
  steps: { id: string; title: Localized; body: Localized }[]
}

export type AboutSection = {
  kind: 'about'
  heading: Localized
  paragraphs: Localized[]
}

export type TeamSection = {
  kind: 'team'
  heading: Localized
  members: {
    name: string
    initials: string
    place: string
    role: Localized
  }[]
}

export type CtaSection = {
  kind: 'cta'
  headline: Localized
  button: Localized
  note: Localized
}

export type Section =
  | HeroSection
  | StageSection
  | QuestionsSection
  | AnswerSection
  | SolutionSection
  | FlowSection
  | AboutSection
  | TeamSection
  | CtaSection

export type SectionKind = Section['kind']

export type NavItem = { href: string; label: Localized }

export type SiteContent = {
  brand: string
  /** Sedes da empresa, exibidas no rodape. */
  cities: string[]
  nav: NavItem[]
  sections: Section[]
}
