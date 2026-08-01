// Os arquivos em public/ nao passam pelo bundler: sao copiados como estao e
// servidos a partir da raiz publicada. Duas consequencias praticas:
//
// 1. O caminho precisa comecar por BASE_URL. No GitHub Pages o site vive em
//    /Vizmobel/, entao um caminho absoluto como /VIZMOBEL - LOGO.svg apontaria
//    para fora do projeto e daria 404.
//
// 2. Os nomes tem espaco e hifen. Espaco em URL precisa virar %20, senao o
//    navegador trunca o endereco no primeiro espaco.
const base = import.meta.env.BASE_URL

const asset = (fileName: string) => `${base}${encodeURIComponent(fileName)}`

/** Simbolo isolado, usado no menu. */
export const logoMark = asset('VIZMOBEL - LOGO.svg')

/** Logotipo por extenso, usado no rodape. */
export const logoWordmark = asset('VIZMOBEL - ESCRITA.svg')
