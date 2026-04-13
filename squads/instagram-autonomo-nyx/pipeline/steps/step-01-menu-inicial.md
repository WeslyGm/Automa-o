---
type: checkpoint
outputFile: squads/instagram-autonomo-nyx/output/menu-inicial.md
---

# Step 01: Menu Inicial

Defina tudo de uma vez para que o squad trabalhe de forma autônoma.

## Instructions

Apresente ao usuário o seguinte menu e aguarde UMA resposta com todas as escolhas:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 NYX Cybernech — Nova Publicação
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 Qual é o TEMA de hoje?
   (ex: "Novas IAs de vídeo", "Design 3D para landing pages")

📐 FORMATO do post:
   1. 📸 Post Único (1 imagem)
   2. 🎠 Carrossel (4 - 6 slides)

🗣️ TOM DE VOZ:
   1. Inspirador  2. Educativo  3. Provocador
   4. Autoritário  5. Inovador

📡 CANAL:
   1. 📱 Instagram
   2. 💼 LinkedIn

Exemplo de resposta: "IAs de vídeo, 2, 5, 2" (Tema, Formato, Tom, Canal)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Output Format

Salve a resposta do usuário no formato:

```markdown
# Menu Inicial

**Tema:** {tema digitado pelo usuário}
**Formato:** {Post Único | Carrossel}
**Tom de Voz:** {tom escolhido}
**Canal:** {Instagram | LinkedIn}
**Date:** {YYYY-MM-DD}
```
