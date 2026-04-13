---
task: "Criar Conteúdo para o Feed"
order: 2
input: |
  - selected_angle: O ângulo escolhido pelo usuário.
  - tone_selection: O tom de voz preferido para o post.
output: |
  - caption: Legenda estruturada.
  - slides: Estrutura visual dos slides (para carrossel).
---

# Criar Conteúdo para o Feed

Gera o copy final e a estrutura visual para um post de Feed (Carrossel ou Imagem Única).

## Process

1. **Estrutura de Slides (Foco em Vendas):** Use o framework de comparação (Antes/Depois) ou Showcase de Serviços.
   - Slide 1: Hook de Impacto (Comparativo ou Promessa Técnica).
   - Slides 2-3: A mágica da NYX em ação (Hologramas e Resultados).
   - Slide 4: CTA de Venda Direta do Serviço.
2. **Redação da Legenda (Venda de Mão de Obra):** Escreva vendendo a solução da NYX (Landing Pages, Automação ou Edição).
3. **Chamada Visual PT-BR:** Defina títulos curtos e fortes para o Davi colocar dentro da imagem.

## Output Format

```markdown
### 🗂️ Estrutura de Slides
- **Slide 1:** [Texto Central + Ideia Visual]
- **Slide 2:** [Texto de Apoio]
...
- **Slide Final:** [CTA Visual]

### 📝 Legenda do Post
[Texto da Legenda]

### 🔑 Palavra-Chave para Automação
[PALAVRA-CHAVE]
```

## Output Example

```markdown
### 🗂️ Estrutura de Slides
- **Slide 1:** "Parei de contratar designers. Veja o que estou usando agora. 🖌️🤖"
- **Slide 2:** "Landing pages imersivas não precisam ser complicadas..."

### 📝 Legenda do Post
Sites em 2026 não são mais lidos, são vividos. ✨

A nova Engenharia Visual da NYX chegou para transformar como sua marca se apresenta. 

🚀 O que mudou?
- Scroll 3D ativo
- Layouts imersivos
- IA gerando assets em segundos

Quer ver como aplicamos isso a sites de conversão?

👇 **Comente 'SITES' para receber nosso guia exclusivo de design imersivo.**
```

## Quality Criteria

- [ ] Hook matador no Slide 1.
- [ ] Legenda fácil de ler em dispositivos móveis.
- [ ] CTA explícito com palavra-chave.
