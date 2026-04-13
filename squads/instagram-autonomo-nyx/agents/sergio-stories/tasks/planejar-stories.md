---
task: "Planejar Sequência de Stories"
order: 1
input: |
  - topic: O tema principal do dia/semana.
output: |
  - story_sequence: Planejamento de 3-5 stories com CTAs.
---

# Planejar Sequência de Stories

Cria uma sequência narrativa para o Stories visando engajamento e cliques.

## Process

1. **Abertura (Hook):** Chame a atenção com uma pergunta ou um fato curioso (Story 1).
2. **Contexto:** Desenvolva o tema com uma dica ou bastidor (Story 2-3).
3. **Engajamento Ativo:** Insira uma enquete ou caixa de pergunta (Story 4).
4. **Fechamento (CTA):** Chamada para o Feed ou para o Direct (Story 5).

## Output Format

```markdown
### 📱 Sequência de Stories
- **Story 1 (Hook):** [Texto + Elemento de Interação]
- **Story 2 (Valor):** [Texto + Imagem/Vídeo sugerido]
- **Story 3 (Interação):** [Pergunta da Caixinha/Enquete]
- **Story 4 (CTA Final):** [Ação desejada]
```

## Output Example

```markdown
### 📱 Sequência de Stories
- **Story 1 (Hook):** "Sério que você ainda faz sites manuais? 🤯 [Enquete: Eu faço / Quero mudar]"
- **Story 2 (Valor):** "Aqui na NYX usamos [Ferramenta] para acelerar o design em 10x..."
- **Story 3 (Interação):** "Qual sua maior dificuldade no design hoje? [Caixinha de Pergunta]"
- **Story 4 (CTA Final):** "Acesse o post completo no nosso feed para ver o guia completo! ✨"
```

## Quality Criteria

- [ ] Mínimo 1 ferramenta de interação oficial.
- [ ] Sequência de 3 a 5 stories.
- [ ] Linguagem direta e humanizada.
