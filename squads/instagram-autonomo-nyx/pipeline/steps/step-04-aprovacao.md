---
type: checkpoint
inputFile: squads/instagram-autonomo-nyx/output/content-draft.md
---

# Step 04: Aprovação do Conteúdo

Este é o ÚNICO ponto de aprovação. Revise o texto, a estrutura e o conceito visual antes de avançar para a produção.

## Instructions

Apresente ao usuário:
1. O conteúdo completo (slides/legenda).
2. O caminho do arquivo para revisão detalhada.
3. Pergunte:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✍️ Conteúdo pronto para aprovação
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Revise: {caminho do content-draft.md}

1. ✅ Aprovar e seguir (Design + Postagem automática)
2. ✏️ Preciso de ajustes (descreva o que mudar)

⚠️ Ao aprovar, o Davi renderiza as artes,
a Valéria faz o review e o post vai pro ar automaticamente.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Se o usuário aprovar, o pipeline segue sem mais paradas até a publicação.
Se pedir ajustes, volte ao step 3 com o feedback.

## Review Loop
on_reject: 3
max_review_cycles: 2
