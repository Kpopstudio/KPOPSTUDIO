# KPOP STUDIO — CONTEXTO MESTRE DO PROJETO

Você está entrando como agente de desenvolvimento do projeto **KPOP Studio**.

Leia este documento antes de implementar qualquer funcionalidade. Ele representa as decisões de produto, conceito, arquitetura e escopo tomadas até agora.

A prioridade neste momento é construir a **Fase 1 — MVP**.

Não implemente funcionalidades da versão 2.0 sem solicitação explícita.

---

# 1. VISÃO DO PRODUTO

**KPOP Studio** é um jogo/app mobile de gerenciamento de uma agência de K-pop.

A fantasia principal do jogador é:

> Criar sua própria empresa de entretenimento, descobrir trainees, formar um girl group, treiná-lo e levá-lo ao debut.

A experiência mistura elementos de:

- simulador de agência;
- gerenciamento;
- criação de grupo;
- coleção/seleção de personagens;
- narrativa leve;
- progressão;
- decisões estratégicas;
- universo visual inspirado na indústria do K-pop.

Existe também uma inspiração de **Visual Novel + simulador de agência**, mas o MVP deve permanecer simples.

O jogo deve transmitir a sensação:

> "Estou administrando minha própria empresa de K-pop e tentando criar o próximo fenômeno mundial."

---

# 2. PLATAFORMA

O projeto deve nascer como **aplicativo mobile**, e não como um site posteriormente convertido em app.

Plataformas alvo:

- Android
- iOS

Uma única base de código deve atender às duas plataformas sempre que possível.

---

# 3. STACK TECNOLÓGICA DECIDIDA

Stack principal:

- **React Native**
- **Expo**
- **TypeScript**

Outras tecnologias planejadas:

- **Expo Router** — navegação
- **Supabase** — backend, banco de dados, autenticação e saves quando necessário
- **GitHub** — versionamento
- **EAS Build** — builds Android/iOS
- **Figma** — planejamento/design de UI quando necessário

O desenvolvimento deve seguir padrões modernos do ecossistema React Native/Expo.

Prioridades técnicas:

1. código organizado;
2. componentes reutilizáveis;
3. TypeScript bem tipado;
4. arquitetura preparada para crescer;
5. evitar overengineering no MVP;
6. experiência mobile-first;
7. boa performance;
8. código compreensível e fácil de modificar com agentes de IA.

Não criar complexidade de backend antes de ela ser necessária.

---

# 4. PAPEL DO CODEX

O Codex será responsável por grande parte da implementação.

A desenvolvedora/proprietária do projeto tomará as decisões de produto e acompanhará o desenvolvimento, aprendendo durante o processo.

O fluxo de trabalho será:

**Planejar → definir visual/UX → implementar → testar → ajustar → commit**

Antes de grandes mudanças:

- entender o requisito;
- verificar a estrutura existente;
- reutilizar componentes;
- evitar quebrar telas já funcionando.

Não redesenhar funcionalidades ou mudar decisões de produto por conta própria.

Quando houver uma decisão de produto ainda não definida, perguntar ou deixar preparado para decisão posterior, em vez de inventar sistemas complexos.

---

# 5. ORGANIZAÇÃO PREVISTA DO PROJETO

A estrutura pode evoluir conforme as boas práticas do Expo Router, mas conceitualmente teremos áreas como:

```text
kpop-studio/
│
├── app/
│
├── assets/
│   ├── images/
│   ├── icons/
│   ├── music/
│   └── fonts/
│
├── components/
│
├── services/
│
├── database/
│
├── types/
│
├── utils/
│
└── docs/
```

Não criar uma pasta `screens` separada se a arquitetura atual do Expo Router tornar isso redundante.

---

# 6. DOCUMENTAÇÃO DO PROJETO

A pasta `/docs` deverá funcionar como memória técnica e de produto.

Documentos previstos:

- Bíblia do Projeto
- MVP
- Backlog 2.0
- Personagens
- Trainees
- Mecânicas
- Interface / Design System
- Economia do jogo

Sempre que uma decisão estrutural importante for tomada, devemos manter a documentação coerente com o código.

---

# 7. ESCOPO DA FASE 1 — MVP

O MVP deve validar se a experiência de:

**criar empresa → criar grupo → escolher trainees → definir posições → treinar → debutar**

é divertida.

O objetivo NÃO é construir todo o simulador agora.

---

# 8. ETAPA 1 — CRIAÇÃO DA EMPRESA

O jogador cria sua própria empresa de entretenimento.

No MVP deverá poder escolher:

- nome da empresa;
- logo entre opções disponíveis.

Personalizações muito avançadas ficam para versões futuras.

---

# 9. ETAPA 2 — CRIAÇÃO DO GRUPO

O jogador cria o girl group da empresa.

Inicialmente poderá definir:

- nome do grupo;
- conceito;
- cor oficial;
- lightstick básico.

Exemplos de conceitos possíveis:

- Cute
- Girl Crush
- Elegant
- Teen Crush

A lista definitiva ainda poderá ser refinada.

O lightstick no MVP será simples.

Personalização avançada do lightstick fica para uma versão posterior.

---

# 10. ETAPA 3 — SISTEMA DE AUDIÇÕES / TRAINEES

Essa é uma das mecânicas centrais do KPOP Studio.

O universo poderá ter aproximadamente:

**100 trainees**

Porém, NÃO devemos mostrar todas em cada partida.

A ideia atual é que cada nova campanha apresente aproximadamente:

**20 trainees finalistas aleatórias**

e o jogador deverá escolher:

**5 integrantes**

para formar seu grupo.

Isso aumenta a rejogabilidade porque cada nova partida pode apresentar candidatas diferentes.

---

# 11. NARRATIVA DA AUDIÇÃO

Queremos que a seleção pareça uma audição real de uma empresa.

Exemplo de apresentação:

> "10.842 garotas se inscreveram para a audição da sua empresa."

Depois:

> "Sua equipe de recrutamento selecionou as 20 melhores candidatas para a avaliação final."

O número de inscritas é narrativo e poderá ser alterado posteriormente.

O importante é transmitir a sensação de que muitas pessoas participaram e apenas algumas chegaram à fase final.

---

# 12. CARDS DAS TRAINEES

Na seleção, cada trainee deverá ter um card.

Informações previstas:

- imagem/foto/avatar;
- nome;
- idade;
- nacionalidade;
- especialidade;
- Vocal;
- Dança;
- Rap;
- Carisma.

Também existe a possibilidade de mostrar Popularidade, mas a forma definitiva desse atributo ainda pode ser refinada.

Ao abrir o perfil da trainee, futuramente podemos mostrar:

- história;
- sonho;
- tempo de treinamento;
- curiosidades.

Esses detalhes ajudam o jogador a criar vínculo emocional com as personagens.

---

# 13. DADOS DAS TRAINEES

O sistema de personagens deve permitir diversidade.

Já pensamos em trainees de nacionalidades como:

- Coreia do Sul
- Japão
- China
- Tailândia
- Brasil
- Estados Unidos
- Canadá
- Argentina
- Espanha
- México
- Colômbia
- Venezuela
- Índia

A lista não precisa ficar limitada permanentemente a esses países.

Também consideramos características como:

- nacionalidade;
- tom de pele;
- aparência;
- idade;
- altura;
- vocal;
- dança;
- rap;
- carisma;
- popularidade inicial.

A representação das personagens deve ter variedade visual real.

---

# 14. MECÂNICA EMOCIONAL DAS AUDIÇÕES

Queremos evitar que a seleção seja apenas uma planilha de números.

Ao selecionar uma trainee, podemos usar pequenas reações.

Exemplo:

> "Obrigada por acreditar em mim!"

Também foi discutida a possibilidade de mostrar as candidatas não escolhidas deixando a audição.

O objetivo é fazer as escolhas terem peso emocional.

Essa mecânica ainda precisa ser desenhada em detalhes antes de ser implementada.

---

# 15. TRAINEES RARAS / LENDÁRIAS

Existe uma ideia para introduzir eventualmente trainees extremamente raras.

Exemplo:

**Trainee Lendária**

Ela poderia:

- aparecer raramente;
- ter apresentação especial;
- possuir efeitos visuais diferentes;
- gerar surpresa;
- aumentar a rejogabilidade.

Foi sugerida inicialmente uma chance em torno de 1%.

IMPORTANTE:

Isso é uma **ideia de produto**, não uma regra fechada do MVP.

Não implementar sistema de raridade ou probabilidades sem nova definição.

---

# 16. ETAPA 4 — POSIÇÕES DO GRUPO

Depois de escolher as cinco integrantes, o jogador poderá distribuir posições.

Posições consideradas:

- Líder
- Center
- Visual
- Vocal Principal
- Vocal Líder
- Rapper Principal
- Dançarina Principal
- Maknae

Uma integrante poderá eventualmente ocupar mais de uma função, dependendo das regras que definirmos.

Não criar regras rígidas sobre isso ainda sem confirmação.

---

# 17. ETAPA 5 — TREINAMENTO

Depois da formação do grupo, começa a preparação para o debut.

Atividades previstas para o MVP:

- aula de dança;
- aula de canto/vocal;
- aula de rap;
- academia;
- descanso.

As atividades devem afetar atributos ou preparação das integrantes.

O equilíbrio exato ainda será definido.

Existe também uma ideia anterior de treinamento com elementos de ritmo, combo, "Perfect" e energia, mas isso NÃO deve ser implementado automaticamente no primeiro MVP sem nova decisão.

Primeiro precisamos validar o loop básico de treinamento.

---

# 18. AVALIAÇÕES MENSAIS — NÃO FAZEM PARTE DO MVP

Foi considerada uma mecânica de avaliação mensal com notas para:

- Dança
- Vocal
- Rap
- Trabalho em equipe
- Popularidade

Depois decidimos REMOVER essa funcionalidade da Fase 1.

Ela pertence ao:

**Backlog 2.0**

Não implementar avaliações mensais no MVP.

---

# 19. EVENTO FINAL DO MVP — SHOWCASE DE DEBUT

O grande objetivo da primeira versão é levar o grupo até:

# SHOWCASE DE DEBUT

O resultado deverá considerar, de alguma forma, o desenvolvimento acumulado durante os treinamentos.

Possíveis resultados:

- grande sucesso;
- sucesso moderado;
- começo difícil.

Os critérios e fórmulas ainda serão definidos.

O importante é que o jogador perceba que suas escolhas anteriores influenciaram o debut.

Ao completar o debut, o jogador conclui o arco principal do MVP.

---

# 20. LOOP PRINCIPAL DO MVP

O fluxo conceitual é:

```text
Abrir jogo
   ↓
Criar empresa
   ↓
Criar grupo
   ↓
Abrir audições
   ↓
Receber 20 finalistas
   ↓
Escolher 5 trainees
   ↓
Definir posições
   ↓
Treinar grupo
   ↓
Preparar debut
   ↓
Showcase de Debut
   ↓
Resultado
```

Esse é o coração da Fase 1.

Qualquer funcionalidade nova deve ser avaliada com a pergunta:

> "Isso é necessário para tornar esse loop divertido?"

Se não for, provavelmente deve esperar.

---

# 21. PRIMEIRAS TELAS

O primeiro milestone funcional será:

```text
Splash Screen
      ↓
Bem-vindo
      ↓
Criar Empresa
```

Depois continuaremos o fluxo.

---

# 22. SPLASH / TELA INICIAL

Conceito pensado:

Uma abertura impactante relacionada ao universo K-pop.

Elementos imaginados:

- palco;
- iluminação;
- atmosfera de show;
- lightsticks na plateia;
- brilho;
- logo KPOP Studio.

Logo central:

**KPOP Studio**

Foi sugerido o slogan:

> Create. Train. Debut. Become Legendary.

O texto ainda pode ser alterado.

Depois aparece:

**COMEÇAR**

A tela deve ser limpa.

Ela não precisa explicar o jogo.

Sua função é gerar:

- impacto;
- curiosidade;
- expectativa.

A mensagem emocional é:

> "Você está entrando na indústria do K-pop."

---

# 23. TELA DE BOAS-VINDAS

Foi pensada uma introdução semelhante a:

> "Milhares de trainees sonham em se tornar idols. Apenas alguns chegam ao topo. Sua missão é criar a próxima sensação mundial do K-pop."

CTA:

**Criar minha empresa**

O texto ainda poderá ser refinado.

---

# 24. DIREÇÃO VISUAL

Queremos uma estética:

- moderna;
- mobile-first;
- jovem;
- sofisticada;
- brilhante;
- ligada ao universo K-pop;
- sem parecer um aplicativo antigo ou uma interface genérica.

Referências visuais já exploradas incluem:

- rosa;
- lavanda;
- branco;
- elementos cósmicos/celestiais;
- estrelas;
- brilhos;
- anéis/crescente;
- tipografia glossy;
- interfaces em cards.

Também foram exploradas três direções conceituais:

1. gerenciamento 2D/isométrico;
2. interface mobile moderna;
3. anime/chibi com customização.

Para a interface do app, a direção **mobile moderna com cards limpos e navegação intuitiva** é especialmente relevante.

Não transformar automaticamente todo o jogo em anime/chibi sem decisão específica.

---

# 25. LUNARIS

Existe dentro do universo criativo do projeto um girl group chamado:

**LUNARIS**

Personagens já criadas:

- Kim Miiya
- Stella
- Akemi
- Aiko
- Seo-Yeon

Já foram explorados:

- identidades;
- posições;
- photocards;
- conceito visual;
- capas;
- branding.

Também já existiu um conceito visual cósmico/celestial relacionado ao Lunaris.

IMPORTANTE:

Lunaris serve como referência e universo criativo do projeto, mas não assumir automaticamente que o grupo inicial de todo jogador será Lunaris.

O objetivo do KPOP Studio é permitir que **o jogador crie o próprio grupo**.

Lunaris poderá futuramente ser usado como:

- grupo do universo do jogo;
- grupo de demonstração;
- NPC;
- referência;
- conteúdo especial;

mas isso ainda não foi fechado.

---

# 26. IDEIAS ANTERIORES PARA EXPANSÃO

Durante a exploração do conceito também apareceram ideias como:

- agenda;
- gravação;
- promoção;
- loja;
- missões;
- rivalidades;
- capítulos narrativos;
- comeback;
- turnê mundial;
- cidades desbloqueáveis;
- sistema de energia;
- sinergia do grupo.

Essas ideias fazem parte da visão maior do produto.

NÃO significa que devam ser implementadas agora.

---

# 27. BACKLOG 2.0

Funcionalidades explicitamente deixadas para depois do MVP incluem:

- avaliações mensais;
- envelhecimento;
- grupos com mais de 5 integrantes;
- turnês mundiais;
- redes sociais completas;
- escândalos;
- relacionamentos;
- reality show;
- sistema avançado de fãs;
- geração de imagens por IA;
- personalização avançada de lightstick;
- grandes eventos/expansões.

Outras ideias complexas também devem ir para o backlog até serem priorizadas.

---

# 28. PRINCÍPIO DE DESENVOLVIMENTO

Queremos evitar o erro clássico de tentar construir o jogo inteiro antes de descobrir se ele é divertido.

Portanto:

### MVP primeiro.

Construir verticalmente.

Exemplo:

Em vez de criar 30 telas vazias, terminar um pequeno fluxo funcional.

A primeira meta técnica é conseguir:

```text
abrir o KPOP Studio
        ↓
ver a Splash
        ↓
continuar
        ↓
ver a introdução
        ↓
criar uma empresa
```

Quando isso estiver funcionando bem, avançamos.

---

# 29. UX MOBILE

O aplicativo deve ser pensado prioritariamente para celular.

Considerar:

- áreas seguras do dispositivo;
- diferentes tamanhos de tela;
- touch targets confortáveis;
- animações sem prejudicar performance;
- feedback visual de interação;
- navegação intuitiva;
- textos legíveis;
- acessibilidade;
- carregamento eficiente de imagens.

Evitar interfaces que pareçam simplesmente um site encaixado dentro de uma tela de celular.

---

# 30. ARQUITETURA DE COMPONENTES

Sempre que fizer sentido, criar componentes reutilizáveis.

Exemplos futuros:

```text
Button
ScreenContainer
Header
TraineeCard
StatBar
Avatar
Modal
ConceptCard
PositionSelector
ProgressBar
```

Não criar todos antecipadamente.

Criá-los conforme forem necessários.

---

# 31. DADOS E ESTADO

Separar claramente:

**dados do jogo**
de
**componentes visuais**.

Evitar colocar grandes listas de trainees diretamente dentro de componentes JSX.

Usar tipos TypeScript apropriados.

Exemplo conceitual:

```ts
type Trainee = {
  id: string;
  name: string;
  age: number;
  nationality: string;
  vocal: number;
  dance: number;
  rap: number;
  charisma: number;
};
```

O modelo definitivo será definido conforme construirmos o sistema.

---

# 32. SAVE DO JOGO

O jogo eventualmente deverá guardar progresso.

Exemplos:

- empresa criada;
- grupo;
- trainees escolhidas;
- posições;
- progresso de treinamento;
- estado da campanha.

Não construir infraestrutura excessiva de save/cloud antes de precisarmos dela.

Podemos começar localmente e conectar ao Supabase quando houver uma razão clara.

---

# 33. EXPERIÊNCIA DE DESENVOLVIMENTO

Ao implementar uma tarefa:

1. analise primeiro os arquivos existentes;
2. explique brevemente o plano quando a alteração for relevante;
3. faça mudanças pequenas e controladas;
4. não reescreva arquivos inteiros desnecessariamente;
5. preserve funcionalidades existentes;
6. execute TypeScript/lint/testes disponíveis;
7. corrija erros antes de considerar a tarefa concluída;
8. informe quais arquivos foram alterados;
9. informe como testar a mudança;
10. mantenha a documentação coerente quando necessário.

---

# 34. NÃO FAZER

Não:

- adicionar funcionalidades da 2.0 por iniciativa própria;
- trocar React Native/Expo por outra stack;
- transformar o projeto em web-first;
- adicionar dependências sem necessidade;
- criar backend complexo prematuramente;
- criar sistemas de monetização agora;
- inventar mecânicas importantes sem aprovação;
- misturar lógica do jogo com UI desnecessariamente;
- hardcodar conteúdo que deverá ser reutilizado;
- construir dezenas de telas antes de validar o primeiro fluxo.

---

# 35. FILOSOFIA DO PRODUTO

O KPOP Studio deve combinar três sensações:

### CRIATIVIDADE

"Esse grupo é meu."

### ESTRATÉGIA

"Minhas escolhas influenciam o resultado."

### CONEXÃO

"Eu me importo com essas trainees."

A tecnologia deve servir a essas três coisas.

---

# 36. OBJETIVO IMEDIATO

Estamos no início da implementação.

Antes de programar, verifique o estado atual do repositório/projeto.

Se ainda não existir projeto Expo, a próxima etapa será inicializá-lo corretamente com:

- React Native;
- Expo;
- TypeScript;
- Expo Router;
- estrutura inicial limpa;
- Git.

Depois devemos executar o app e confirmar que funciona antes de começar a primeira interface.

O primeiro objetivo visual será implementar a **Splash Screen do KPOP Studio**.

Não avance automaticamente para todas as outras telas.

Vamos construir o projeto incrementalmente, uma etapa por vez.
