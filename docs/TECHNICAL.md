# KPOP Studio — Direção técnica

## Stack

- React Native
- Expo
- TypeScript em modo estrito
- Expo Router
- EAS Build quando houver necessidade de gerar builds
- Save local inicialmente; Supabase apenas quando houver necessidade clara

## Estrutura atual

- `src/app`: rotas e telas do Expo Router
- `src/components`: componentes reutilizáveis criados conforme a necessidade
- `src/constants`: temas e constantes visuais
- `src/hooks`: hooks compartilhados
- `assets`: imagens e ícones do aplicativo
- `docs`: memória técnica e de produto

Novas pastas como `services`, `types`, `utils` e `database` devem surgir somente quando o código realmente precisar delas.

## Fluxo de desenvolvimento

Planejar → definir visual/UX → implementar → testar → ajustar → commit.

Cada entrega deve preservar o que já funciona, passar pelas verificações disponíveis e manter esta documentação coerente.
