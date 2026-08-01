import { useEffect, useState } from 'react'

/*
 * Roteamento por hash, sem biblioteca.
 *
 * O GitHub Pages serve arquivos estaticos: um pedido direto a /catalogo
 * devolveria 404, porque nao existe esse arquivo no servidor. Com hash, o
 * caminho inteiro fica depois do #, o servidor sempre entrega o index.html e
 * o navegador resolve o resto. E o motivo de nao termos instalado um router:
 * o problema real aqui e de hospedagem, nao de roteamento.
 *
 * Convencao: rotas comecam com '#/'. Ancoras de secao ('#stage', '#team')
 * nao tem barra, entao os dois usos convivem sem se atrapalhar.
 */

export type Route = 'home' | 'catalog'

function readRoute(): Route {
  return window.location.hash.startsWith('#/catalog') ? 'catalog' : 'home'
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(readRoute)

  useEffect(() => {
    const sync = () => setRoute(readRoute())
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  return route
}

export function navigate(to: Route): void {
  window.location.hash = to === 'catalog' ? '/catalog' : '/'
  window.scrollTo({ top: 0, behavior: 'auto' })
}
