---
execution: inline
agent: valeria-veredito
inputFile: squads/instagram-autonomo-nyx/output/content-draft.md
on_reject: 3
max_review_cycles: 2
---

# Step 06: Revisão e Veredito

A Valéria dá a palavra final sobre a qualidade. Se aprovado, o post segue direto para publicação automática.

## Context Loading
- `squads/instagram-autonomo-nyx/output/content-draft.md` — Texto completo.
- `squads/instagram-autonomo-nyx/output/images/` — Artes geradas pelo Davi.
- `squads/instagram-autonomo-nyx/pipeline/data/quality-criteria.md` — Checklist de qualidade.

## Instructions
1. Avalie o post de 0 a 10.
2. Verifique conformidade com o tom de voz escolhido.
3. Verifique se NÃO há CTA (proibido por enquanto).
4. Verifique se as artes seguem a paleta NYX.
5. Dê o Veredito: **APROVADO** (7+) ou **REJEITADO** (0-6).

## Auto-Advance Rule
- Se **APROVADO**: O pipeline avança automaticamente para o Step 07 (Auto-Post). Não pergunte ao usuário.
- Se **REJEITADO**: Volte ao Step 03 com feedback da Valéria.
