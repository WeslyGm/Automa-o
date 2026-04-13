---
task: "Roteirizar Reels"
order: 1
input: |
  - selected_angle: O ângulo escolhido pelo usuário.
output: |
  - script: Roteiro segundo a segundo com falas e visuais.
---

# Roteirizar Reels

Cria o roteiro detalhado para um vídeo curto de alta retenção.

## Process

1. **Definição do Hook Visual:** O que aparece nos primeiros 1.5s para parar o scroll?
2. **Roteiro Segmentado:** Divida o vídeo em:
   - **00-02s (Hook):** Chamada de impacto.
   - **02-10s (Value):** Demonstração rápida ou explicação visual.
   - **10-15s (CTA):** Chamada para comentário.
3. **Instruções de Edição:** Indique textos na tela, zoom e músicas sugeridas (trend).

## Output Format

```markdown
### 🎥 Roteiro: [Título da Trend]
- **Hook (0-2s):** [Ação Visual + Fala]
- **Desenvolvimento:** [O que mostrar]
- **CTA Final:** [Chamada para comentário]

### ⌨️ Textos na Tela (Overlays)
1. "..."
2. "..."

### 📂 Sugestão de Áudio
[Gênero ou Estilo de Música/SFX]
```

## Output Example

```markdown
### 🎥 Roteiro: O Fim do Design Manual
- **Hook (0-2s):** [Close no rosto surpreso] "Parei de usar o Photoshop hoje."
- **Desenvolvimento:** [Tela do Canva IA gerando site em 3D rápido] "Sério, olha isso. Um site completo em 10 segundos..."
- **CTA Final:** "Comente 'WEB' para testar essa IA agora!"

### ⌨️ Textos na Tela (Overlays)
1. "Adeus Photoshop? 👋"
2. "Site 3D em 10s 🤯"
```

## Quality Criteria

- [ ] Hook matador no início.
- [ ] Roteiro rítmico (transições a cada 2-3s).
- [ ] CTA específico com palavra-chave.
