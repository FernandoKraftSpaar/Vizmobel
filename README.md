# VizMöbel

Realidade aumentada para móveis. Seu cliente vê o produto na própria sala, em escala real, sem baixar aplicativo.

## Sobre este repositório

Desenvolvimento da aplicação e do frontend. A entrega atual é uma landing page de página única que serve como prova de arquitetura para a camada de animação.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Build | Vite 6 |
| UI | React 19 + TypeScript 5 |
| Animação | GSAP 3.13 |
| Deploy | GitHub Actions para GitHub Pages |

## Arquitetura de animação

A regra central do projeto e a separacao entre logica e framework:

- `src/motion/effects/` — JavaScript vanilla puro, sem nenhum import de React. Cada efeito exporta um tipo de config, um objeto de defaults e uma fabrica que devolve um destrutor.
- `src/motion/react/` — hooks finos que apenas conectam os efeitos ao ciclo de vida do React.

O motivo e pratico: a logica de animacao precisa poder rodar fora do React no futuro, quando um cliente pedir o widget embutido no proprio site.

## Comandos

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

## Status

Em construcao.
