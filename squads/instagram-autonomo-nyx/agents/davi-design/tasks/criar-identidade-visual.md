---
task: "Criar Identidade Visual do Post"
order: 1
input: |
  - content_draft: O rascunho do copy e estrutura de slides.
  - template_reference: (Opcional) Referência de template no Canva.
output: |
  - visual_creation: Descrição da arte gerada, prompts usados e link/arquivo do Canva finalizado.
---

# Criar Identidade Visual do Post

Coordena a geração de imagens por IA e o acabamento final em templates de marca.

## Process

1. **Concepção Visual:** Foque no contraste Antes vs. Depois ou no Showcase de janelas holográficas.
2. **Geração por IA:** Use a skill `image-ai-generator` para criar fundos de alta tecnologia ou mockups 3D.
3. **Montagem no Canva (PT-BR OBRIGATÓRIO):** Aplique textos chamativos como "ESTÉTICA QUE CONVERTE" ou "AUTOMAÇÃO DE ESCALA". A imagem deve vender o serviço visualmente.
4. **Filtros Holográficos:** Adicione bordas neon e transparências sobre os elementos.

## Output Format

```markdown
### 🌅 Conceito Artístico
[Descrição da visão do Davi para a arte]

### 🤖 Geração por IA (Prompt)
[Prompt exato usado na IA]

### 🎨 Design Final (Canva/Preview)
[Descritivo do arquivo finalizado e link/referência se houver]
```

## Output Example

```markdown
### 🌅 Conceito Artístico
"Para o post sobre 'Sistemas de IA', criei uma renderização de um cérebro cibernético flutuando sobre uma cidade futurista. Usei luzes violetas e azuis para dar o tom da NYX."

### 🤖 Geração por IA (Prompt)
"A futuristic floating cybernetic brain made of glass and glowing circuits, cinematic lighting, purple and teal neon accents, dark background, 8k resolution, unreal engine 5 render style."

### 🎨 Design Final (Canva/Preview)
"Slide 1 finalizado no Canva usando o template 'NYX-Alpha'. Logo aplicado no canto superior direito. Exportado em PNG 1080x1350."
```

## Quality Criteria

- [ ] A arte principal é visualmente impactante.
- [ ] O logo da NYX está visível e correto.
- [ ] O design segue o padrão de 1080x1350 para feed.
