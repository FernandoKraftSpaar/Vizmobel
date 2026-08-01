import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ScrollTrigger, runtime } from './motion/gsap'
import { LangProvider } from './lang'
import { App } from './App'
import './styles/tokens.css'
import './styles/global.css'
import './styles/viewer.css'
import './styles/catalog.css'

// Aqui, e so aqui, a camada de movimento toma conhecimento do bundler.
// Ligar isto faz o ScrollTrigger desenhar os marcadores de start/end na tela
// durante o desenvolvimento.
runtime.debug = import.meta.env.DEV

const container = document.getElementById('root')
if (!container) throw new Error('Elemento #root nao encontrado no index.html')

createRoot(container).render(
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </StrictMode>,
)

// Fontes web mudam a altura do texto ao carregar. Sem este refresh, todo
// ScrollTrigger criado antes disso dispara alguns pixels fora do lugar.
void document.fonts.ready.then(() => {
  ScrollTrigger.refresh()
})
