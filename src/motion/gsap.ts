import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

// Unico ponto de registro de plugins em todo o projeto. Registrar em varios
// lugares nao quebra, mas faz o bundler incluir plugins em chunks que nao
// precisavam deles.
//
// Registramos apenas os dois plugins que a v1 realmente usa. Draggable,
// InertiaPlugin, DrawSVGPlugin e MotionPathPlugin entram quando os efeitos
// que dependem deles forem implementados.
gsap.registerPlugin(ScrollTrigger, SplitText)

// Defaults globais: todo tween sem ease/duration explicitos herda estes.
gsap.defaults({ ease: 'power3.out', duration: 0.8 })

// Suaviza travadas de aba em segundo plano sem deixar o scrub "pular".
gsap.ticker.lagSmoothing(500, 33)

// Sinalizador de depuracao. Deliberadamente NAO usamos import.meta.env aqui:
// isso amarraria a camada de movimento ao Vite. O app define este valor no
// bootstrap, antes de qualquer efeito ser criado.
export const runtime = { debug: false }

export { gsap, ScrollTrigger, SplitText }
