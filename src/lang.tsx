import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Lang, Localized } from './content/types'

type LangValue = {
  lang: Lang
  setLang: (next: Lang) => void
  /** Resolve um texto localizado no idioma corrente. */
  t: (value: Localized) => string
}

const LangContext = createContext<LangValue | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('pt')

  // Leitores de tela mudam de voz e de regras de hifenizacao conforme este
  // atributo. Sem ele, o alemao seria lido com fonetica portuguesa.
  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'de-DE'
  }, [lang])

  const value = useMemo<LangValue>(
    () => ({ lang, setLang, t: (v: Localized) => v[lang] }),
    [lang],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang(): LangValue {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang precisa estar dentro de <LangProvider>.')
  return ctx
}
