---
execution: inline
agent: sistema
inputFile: squads/instagram-autonomo-nyx/output/content-draft.md
---

# Step 07: Publicação Automática no Instagram

Após aprovação da Valéria, o post é publicado automaticamente via Playwright.

## Instructions

1. Leia `squads/instagram-autonomo-nyx/output/menu-inicial.md` para saber o FORMATO e o CANAL.
2. Liste as imagens em `squads/instagram-autonomo-nyx/output/images/` ordenadas por nome.
3. Extraia a legenda (caption + hashtags) do `content-draft.md`.
4. Execute o script Playwright apropriado:

```bash
# O sistema escolherá automaticamente entre postar-auto.js (Instagram) ou post-linkedin.js
node squads/instagram-autonomo-nyx/_scripts/post-router.js \
  --images "{comma-separated image paths}" \
  --caption "{caption text}"
```

5. Se o script retornar exit code 0: sucesso!
6. Se falhar: salve screenshot e informe o usuário.

## Safety Rules
- Máximo de 10 imagens por carousel.
- Caption máximo: 2200 caracteres.
- Aguardar 15s após publicação para confirmar.
- Salvar `auth.json` atualizado após cada post.
