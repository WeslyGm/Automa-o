---
task: "Revisar Conteúdo e Dar Veredito"
order: 1
input: |
  - content_draft: Todo o conteúdo e design produzido.
output: |
  - review_scoring: Nota de 0 a 10 conforme os critérios.
  - feedback: Ajustes necessários ou elogios.
  - status: APROVADO ou REJEITADO.
---

# Revisar Conteúdo e Dar Veredito

Analisa o trabalho final do squad e decide se ele atende aos padrões NYX para postagem.

## Process

1. **Checklist de Branding:** Verifique se o logo, as fontes e as cores estão corretos no design do Davi.
2. **Checklist de Copy:** O Hook é forte? A legenda é escaneável? O CTA é específico?
3. **Avaliação Estratégica:** O conteúdo é "salvável" ou "compartilhável" conforme a tendência de 2026?
4. **Cálculo de Score:** Atribua uma nota de 0 a 10 baseada nos critérios de qualidade.
   - **Score >= 9:** APROVADO.
   - **Score < 9:** REJEITADO (explique os motivos e redirecione).

## Output Format

```markdown
### ⚖️ Veredito da Valéria
**Status:** [APROVADO / REJEITADO]
**Score Final:** [X/10]

---

### 📝 Feedback Detalhado
- **Positivos:** [O que ficou muito bom]
- **Pontos de Melhoria:** [O que deve ser ajustado]

### 🔄 Próximos Passos
[Encerramento ou retorno ao copy/design]
```

## Output Example

```markdown
### ⚖️ Veredito da Valéria
**Status:** APROVADO
**Score Final:** 9.5/10

---

### 📝 Feedback Detalhado
- **Positivos:** O hook do primeiro slide ("O fim dos sites estáticos") é um dos melhores que já vi. Cores muito alinhadas.
- **Pontos de Melhoria:** Aumentar ligeiramente a margem do CTA final no Slide 5 para evitar corte no feed 4:5.

### 🔄 Próximos Passos
Conteúdo liberado para o agendador no Instagram Publisher. ✨
```

## Quality Criteria

- [ ] Critério de Veto: Rejeitar se não houver CTA com palavra-chave.
- [ ] Critério de Veto: Rejeitar se houver erros gramaticais gritantes.
- [ ] A nota deve ser justificada item por item.
