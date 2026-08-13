# KPOP Studio

Jogo mobile de gerenciamento de uma agência de K-pop, desenvolvido com React Native, Expo, TypeScript e Expo Router.

## Estado atual

A fundação técnica do aplicativo está pronta. O próximo milestone é criar a Splash Screen do KPOP Studio.

## Executar o projeto

No PowerShell, entre na pasta do projeto e instale as dependências:

```powershell
Set-Location "C:\Users\Mía\Projects\KPOPSTUDIO"
npm.cmd install
```

Inicie o Expo:

```powershell
npm.cmd start
```

O Expo mostrará as opções disponíveis para abrir o aplicativo. Para testar no celular, instale o Expo Go e leia o QR Code exibido pelo terminal, desde que o computador e o celular estejam na mesma rede.

## Verificações

```powershell
npx.cmd tsc --noEmit
npx.cmd eslint src eslint.config.js --no-cache
```

## Documentação

- `docs/PROJECT_CONTEXT.md`: contexto mestre e decisões de produto.
- `docs/MVP.md`: escopo e loop da Fase 1.
- `docs/TECHNICAL.md`: stack, estrutura e fluxo de desenvolvimento.
