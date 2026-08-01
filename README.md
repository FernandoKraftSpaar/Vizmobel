# VizMöbel

Realidade aumentada para móveis. Seu cliente vê o produto na própria sala, em escala real, sem baixar aplicativo.

**Site publicado:** https://fernandokraftspaar.github.io/Vizmobel/

## Sobre este repositório

Landing page de página única que serve como prova de arquitetura para a camada de animação do produto. O conteúdo atual é provisório; a estrutura é o que está sendo validado.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Build | Vite 6 |
| UI | React 19 + TypeScript 5 |
| Animação | GSAP 3.13 (ScrollTrigger, SplitText) |
| Deploy | GitHub Actions para GitHub Pages |

## Arquitetura de animação

A regra central do projeto é a separação entre lógica e framework.

- `src/motion/effects/` — JavaScript vanilla puro. Nenhum arquivo importa React ou Vite. Cada efeito exporta um tipo de config, um objeto de defaults e uma fábrica que devolve um destrutor.
- `src/motion/react/` — hooks finos que apenas conectam os efeitos ao ciclo de vida do React.

O motivo é prático: o plano Enterprise prevê embutir o visualizador no site do próprio cliente, que pode não usar React. A lógica de animação precisa sobreviver a essa mudança.

### Contrato dos efeitos

```ts
export type XxxConfig = { /* ... */ }
export const xxxDefaults = { /* ... */ } as const satisfies Partial<XxxConfig>
export function createXxx(cfg: XxxConfig): () => void  // devolve o destrutor
```

Todo listener de DOM é registrado com `AbortController` e `{ signal }`, para que a limpeza seja uma chamada única em vez de uma lista de `removeEventListener` que se desatualiza.

### Efeitos disponíveis

| Efeito | Onde é usado |
| --- | --- |
| `textLines` | Títulos, manifesto e chamada final |
| `cardTilt` | Cartão do hero e cards de serviço |
| `rollButton` | Todos os botões de ação |
| `counter` | Métricas da seção de números |
| `scrubPin` | Seção de processo, fixada durante a rolagem |
| `responsive` | Entrada global, breakpoints e movimento reduzido |

## Conteúdo

Todo texto visível vive em `src/content/site.ts`. Nenhum componente contém string de interface.

O site é bilíngue (português e alemão) e cada texto é um `Record<'pt' | 'de', string>`. Uma tradução faltando é erro de compilação, não string vazia em produção.

## Comandos

```bash
npm install
npm run dev        # servidor local
npm run typecheck  # apenas tipos
npm run build      # tsc --noEmit && vite build
npm run preview    # serve o dist local
```

Em desenvolvimento o ScrollTrigger desenha os marcadores de início e fim na tela. O sinalizador vive em `runtime.debug`, definido por `src/main.tsx`.

## Deploy

Qualquer push na `main` dispara o build e publica. O caminho base do Vite é injetado pelo workflow a partir do nome do repositório, porque URLs do GitHub Pages diferenciam maiúsculas de minúsculas.

Duas configurações precisam estar ativas no repositório:

1. `Settings → Pages → Source: GitHub Actions`
2. `Settings → Actions → General → Workflow permissions: Read and write`

## Status

Em construção.
