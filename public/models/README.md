# Modelos 3D

Coloque aqui o arquivo **`poltrona.glb`**.

O nome importa: `src/viewer/catalog.ts` procura por `models/poltrona.glb`. Para
usar outro nome, altere `glbUrl` no catalogo em vez de renomear o arquivo no
servidor.

## Como enviar

Arquivos binarios nao entram por aqui pela via automatizada. Use a interface do
GitHub:

1. Abra esta pasta no navegador
2. `Add file` -> `Upload files`
3. Arraste o `.glb`
4. `Commit changes` direto na `main`

O deploy dispara sozinho.

## Requisitos do arquivo

| Item | Alvo | Por que |
| --- | --- | --- |
| Tamanho | ate 2 MB | acima disso o 4G do cliente desiste antes de ver a poltrona |
| Compressao | Draco ou Meshopt | reduz a malha em 5 a 10 vezes |
| Texturas | KTX2 / WebP | PNG num GLB e o erro mais comum de peso |
| Escala | 1 unidade = 1 metro | a AR posiciona em escala real; errar aqui poe uma poltrona de brinquedo na sala |
| Eixo Y | para cima, apoiado em Y=0 | senao o movel flutua ou afunda no chao |
| Nomes de material | `Fabric_mtl`, `Legs_mtl` | a troca de acabamento procura por nome exato |

Os nomes de material sao o ponto que mais falha em silencio. Se um acabamento
nao mudar nada na tela, abra o console: o viewer lista os materiais que
realmente existem no arquivo.

## Otimizacao

```bash
npx @gltf-transform/cli optimize entrada.glb poltrona.glb \
  --compress draco \
  --texture-compress webp \
  --texture-size 1024
```
