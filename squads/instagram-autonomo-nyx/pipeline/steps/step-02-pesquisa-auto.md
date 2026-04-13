---
execution: subagent
agent: pietro-pesquisa
inputFile: squads/instagram-autonomo-nyx/output/menu-inicial.md
outputFile: squads/instagram-autonomo-nyx/output/trends-and-angles.md
model_tier: fast
---

# Step 02: Pesquisa + Seleção Automática

O Pietro pesquisa as tendências e o runner seleciona automaticamente a pauta de maior impacto. Sem checkpoint — o squad decide sozinho.

## Context Loading
- `squads/instagram-autonomo-nyx/output/menu-inicial.md` — Tema, formato e tom definidos pelo usuário.
- `squads/instagram-autonomo-nyx/pipeline/data/research-brief.md` — Diretrizes de pesquisa.
- `squads/instagram-autonomo-nyx/pipeline/data/domain-framework.md` — Metodologia de ângulos.

## Instructions
1. Realize a busca conforme o tema definido no menu inicial (últimos 7 dias).
2. Extraia 3-5 fontes relevantes e confiáveis.
3. **Selecione automaticamente** a pauta de maior impacto (relevance: "Impacto Alto").
4. Gere 3 ângulos para a pauta selecionada (baseado no tom de voz escolhido).
5. **Selecione automaticamente** o ângulo mais alinhado com o tom escolhido.
6. Salve tudo no output: pauta selecionada + ângulo vencedor + contexto para o Fábio.

## Output Format
```yaml
selected_topic:
  title: "..."
  source: "..."
  summary: "..."
  hook_idea: "..."

selected_angle:
  archetype: "..."
  title: "..."
  concept: "..."

format: "Carrossel" | "Post Único"
tone: "..."
```

## Veto Conditions
1. Notícias com mais de 30 dias.
2. Temas sem relação com os serviços da NYX.
3. Menos de 3 fontes encontradas.
