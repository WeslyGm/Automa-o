---
task: "Gerar Ângulos Criativos"
order: 1
input: |
  - news_topic: Tópico/Notícia trazido pelo Pietro.
output: |
  - angles_list: 5 perspectivas emocionais/estratégicas para o conteúdo.
---

# Gerar Ângulos Criativos

Transforma uma notícia técnica em 5 abordagens diferentes para o Instagram.

## Process

1. **Analisar a Notícia:** Entenda o valor central do que foi descoberto.
2. **Divergir Ângulos:** Crie 5 opções baseadas nos seguintes arquétipos:
   - **Medo/Urgência:** O custo de não saber/usar isso.
   - **Oportunidade/Ganho:** Como isso te coloca à frente da concorrência agora.
   - **Educacional/Passo a Passo:** Um 'how-to' direto.
   - **Contrário/Polemista:** Desafiar um mito sobre esse tema.
   - **Inspiracional/Visão:** O impacto disso no futuro de 2026.
3. **Síntese:** Apresente os 5 ângulos com título e uma breve descrição da "Ideia Central".

## Output Format

```yaml
angles:
  - id: 1
    archetype: "..."
    title: "..."
    concept: "..."
```

## Output Example

```yaml
angles:
  - id: 1
    archetype: "Oportunidade/Ganho"
    title: "A Janela de Ouro do Design IA"
    concept: "Mostrar como dominar essa ferramenta agora é a única forma de cobrar 3x mais por landing pages."
```

## Quality Criteria

- [ ] 5 ângulos distintos.
- [ ] Títulos que funcionam como 'Hooks'.
- [ ] Cada ângulo deve ter um CTA compatível.

## Veto Conditions

Reject and redo if:
1. Mais de 2 ângulos forem muito parecidos.
2. Os ângulos não forem aplicáveis aos serviços da NYX.
