// Nenhum numero de animacao solto no codigo. Quando toda a pagina usa as
// mesmas curvas e duracoes, o site ganha "voz" propria. Quando cada
// componente inventa a sua, vira colcha de retalhos.
export const motion = {
  duration: {
    instant: 0.2,
    fast: 0.4,
    ui: 0.5,
    base: 0.8,
    count: 1.6,
    slow: 1.2,
    epic: 2.0,
  },
  ease: {
    out: 'power3.out',
    inOut: 'power2.inOut',
    inOutStrong: 'power3.inOut',
    expo: 'expo.out',
    spring: 'elastic.out(1, 0.55)',
    linear: 'none',
  },
  stagger: { tight: 0.04, base: 0.08, loose: 0.16 },
  distance: { sm: 24, md: 56, lg: 96 },
} as const

export type DurationToken = keyof typeof motion.duration
export type EaseToken = keyof typeof motion.ease
export type StaggerToken = keyof typeof motion.stagger
