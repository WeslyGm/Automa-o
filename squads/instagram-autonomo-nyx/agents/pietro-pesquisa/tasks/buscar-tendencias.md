---
task: "Buscar Tendências de IA"
order: 1
input: |
  - keyword: O foco específico da pesquisa definido pelo usuário.
  - time_range: O período de tempo (ex: 24h, 7 dias).
output: |
  - news_list: Lista de 3-5 notícias/ferramentas com resumo e link.
  - selection_criteria: Por que essas pautas foram escolhidas.
---

# Buscar Tendências de IA

Esta tarefa consiste em realizar uma varredura estratégica na web para encontrar temas relevantes para a audiência da NYX Cybernech.

## Process

1. **Search & Scrape:** Realize uma busca no Google/Twitter pelas palavras-chave fornecidas. Filtre pelos últimos dias conforme o `time_range`.
2. **Filter & Rank:** Selecione as 3-5 notícias mais impactantes para o setor de Landing Pages, Design ou Automação. 
3. **Synthesize:** Para cada pauta, extraia: Título, Fonte, Resumo de 2 frases e o "Gancho Visual" (o que pode virar imagem/vídeo).

## Output Format

```yaml
findings:
  - title: "..."
    source: "..."
    relevance: "Impacto Alto/Médio/Baixo"
    summary: "..."
    hook_idea: "..."
```

## Output Example

> Use as quality reference, not as rigid template.

```yaml
findings:
  - title: "Canva lança 'Magic Design' para Interfaces 3D"
    source: "Canva Blog (02/04/2026)"
    relevance: "Impacto Alto"
    summary: "Nova ferramenta permite gerar layouts de landing pages imersivas a partir de prompts de texto, otimizando o scroll 3D."
    hook_idea: "Mostrar um comparativo de um site 'flat' vs o '3D' gerado pela IA."
```

## Quality Criteria

- [ ] Mínimo de 3 descobertas reais.
- [ ] Links incluídos para cada descoberta.
- [ ] Cada item tem uma ideia de "Gancho Visual" associada.

## Veto Conditions

Reject and redo if ANY are true:
1. Notícias com mais de 30 dias de idade.
2. Temas que não tenham NENHUMA relação com os serviços da NYX.
