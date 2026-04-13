---
execution: inline
agent: fabio-feed
format: instagram-feed
inputFile: squads/instagram-autonomo-nyx/output/trends-and-angles.md
outputFile: squads/instagram-autonomo-nyx/output/content-draft.md
---

# Step 03: Criação de Conteúdo

O Fábio Feed escreve o conteúdo completo baseado na pauta, ângulo e formato selecionados automaticamente.

## Context Loading
- `squads/instagram-autonomo-nyx/output/trends-and-angles.md` — Pauta + ângulo + formato + tom.
- `squads/instagram-autonomo-nyx/pipeline/data/tone-of-voice.md` — Guia de tons.

## Instructions
1. Leia o formato definido (Carrossel ou Post Único).
2. Se **Carrossel**: estruture 8-10 slides seguindo o format guide `instagram-feed`.
3. Se **Post Único**: escreva uma legenda de impacto + descrição visual detalhada para 1 imagem.
4. Aplique o tom de voz selecionado pelo usuário.
5. **Plataforma (Canal)**: 
   - Se **LinkedIn**: Priorize um tom mais corporativo/educativo, use parágrafos bem espaçados, inclua "hooks" (ganchos) profissionais e evite excesso de emojis. 
   - Se **Instagram**: Priorize o impacto visual, legendas mais curtas e dinâmicas, com uso estratégico de emojis e hashtags.
6. **NÃO inclua CTA** (proibição ativa na memória do squad).
7. Salve o draft completo no output.

## Output Format
Seguir o formato definido em `instagram-feed` best practices (slides + caption + hashtags).

## Veto Conditions
1. Post sem hook claro nos primeiros 125 caracteres.
2. Carrossel com menos de 8 slides.
3. Post Único com legenda menor que 200 caracteres.
4. Presença de CTA (proibido por enquanto).
