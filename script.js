/* =========================================================
   ESCOLA PIXEL
   RPG Point-and-Click Escolar
   JavaScript Vanilla
========================================================= */


/* =========================================================
   ESTADO GLOBAL
========================================================= */

const gameState = {

  player: {
    name: "Alex",
    class: "leader",
    xp: 0,
    level: 1,
    energy: 100
  },

  stats: {
    climate: 50,
    reputation: 50,
    innovation: 50
  },

  scene: "yard",

  time: "Manhã",

  inventory: [],

  quests: {

    trash: {
      started: true,
      done: false,
      progress: 0
    },

    fakeNews: {
      started: false,
      done: false,
      progress: 0
    },

    science: {
      started: false,
      done: false,
      progress: 0
    }

  },

  flags: {

    talkedJanitor: false,
    organizedStudents: false,

    studentAna: false,
    studentLeo: false,

    rumorDecision: false,

    componentFound: false,
    helpedScience: false

  }

};


/* Classe atualmente selecionada */

let selectedClass = "leader";


/* =========================================================
   DEFINIÇÃO DOS CENÁRIOS
========================================================= */

const scenes = {

  yard: {

    title: "Pátio Central",

    desc:
      "Árvores, bancos e um mural cheio de histórias.",

    hotspots: [

      {
        id: "janitor",
        x: 8,
        y: 48,
        emoji: "🧹",
        label: "Zelador",

        action: () => janitorDialogue()
      },

      {
        id: "ana",
        x: 35,
        y: 55,
        emoji: "👩‍🎓",
        label: "Ana",

        action: () => anaDialogue()
      },

      {
        id: "mural",
        x: 67,
        y: 42,
        emoji: "📌",
        label: "Mural",

        action: () => muralDialogue()
      },

      {
        id: "recycle",
        x: 83,
        y: 66,
        emoji: "♻️",
        label: "Reciclagem",

        action: () => recycleDialogue()
      },

      {
        id: "libraryDoor",
        x: 88,
        y: 18,
        emoji: "📚",
        label: "Biblioteca",

        action: () => changeScene("library")
      }

    ]

  },


  library: {

    title: "Biblioteca",

    desc:
      "Silêncio, livros e uma pista importante.",

    hotspots: [

      {
        id: "leo",
        x: 25,
        y: 55,
        emoji: "🧑‍🎓",
        label: "Leo",

        action: () => leoDialogue()
      },

      {
        id: "computer",
        x: 58,
        y: 53,
        emoji: "💻",
        label: "Computador",

        action: () => computerDialogue()
      },

      {
        id: "door",
        x: 85,
        y: 20,
        emoji: "🚪",
        label: "Voltar",

        action: () => changeScene("yard")
      }

    ]

  },


  lab: {

    title: "Laboratório de Ciências",

    desc:
      "Experimentos, bancadas e componentes eletrônicos.",

    hotspots: [

      {
        id: "component",
        x: 35,
        y: 56,
        emoji: "🔋",
        label: "Componente",

        action: () => componentDialogue()
      },

      {
        id: "scienceFriend",
        x: 62,
        y: 55,
        emoji: "🧪",
        label: "Bia",

        action: () => scienceDialogue()
      },

      {
        id: "door",
        x: 87,
        y: 18,
        emoji: "🚪",
        label: "Voltar",

        action: () => changeScene("yard")
      }

    ]

  },


  club: {

    title: "Sala do Grêmio",

    desc:
      "O lugar onde os estudantes planejam melhorias.",

    hotspots: [

      {
        id: "board",
        x: 35,
        y: 45,
        emoji: "🗺️",
        label: "Planejamento",

        action: () => clubDialogue()
      },

      {
        id: "console",
        x: 65,
        y: 53,
        emoji: "🎮",
        label: "Computador",

        action: () => computerDialogue()
      },

      {
        id: "door",
        x: 87,
        y: 18,
        emoji: "🚪",
        label: "Voltar",

        action: () => changeScene("yard")
      }

    ]

  }

};


/* =========================================================
   FUNÇÕES UTILITÁRIAS
========================================================= */

function clamp(value) {

  return Math.max(
    0,
    Math.min(100, value)
  );

}


/* =========================================================
   SISTEMA DE NOTIFICAÇÕES
========================================================= */

function toast(message) {

  const element =
    document.getElementById("toast");

  element.textContent = message;

  element.classList.add("show");

  setTimeout(() => {

    element.classList.remove("show");

  }, 2200);

}


/* =========================================================
   ATUALIZAÇÃO DOS ATRIBUTOS
========================================================= */

function updateStats(changes) {

  const stats = [
    "climate",
    "reputation",
    "innovation"
  ];

  stats.forEach(stat => {

    if (changes[stat]) {

      gameState.stats[stat] =
        clamp(
          gameState.stats[stat]
          + changes[stat]
        );

    }

  });


  /* Energia */

  if (changes.energy) {

    gameState.player.energy =
      clamp(
        gameState.player.energy
        + changes.energy
      );

  }


  /* Atualiza números */

  document.getElementById("climate")
    .textContent =
    gameState.stats.climate;

  document.getElementById("reputation")
    .textContent =
    gameState.stats.reputation;

  document.getElementById("innovation")
    .textContent =
    gameState.stats.innovation;


  /* Atualiza barras */

  document.getElementById("climateFill")
    .style.width =
    gameState.stats.climate + "%";

  document.getElementById("repFill")
    .style.width =
    gameState.stats.reputation + "%";

  document.getElementById("innovationFill")
    .style.width =
    gameState.stats.innovation + "%";

}


/* =========================================================
   SISTEMA DE XP
========================================================= */

function addXP(amount) {

  gameState.player.xp += amount;


  /* Level Up */

  while (
    gameState.player.xp >= 100
  ) {

    gameState.player.xp -= 100;

    gameState.player.level++;

    gameState.player.energy = 100;

    toast(
      "🎉 Você alcançou o nível "
      + gameState.player.level
      + "!"
    );

  }


  document.getElementById("level")
    .textContent =
    gameState.player.level;

  document.getElementById("xp")
    .textContent =
    gameState.player.xp + "/100";

}


/* =========================================================
   INVENTÁRIO
========================================================= */

function addItem(name, emoji) {

  const alreadyHas =
    gameState.inventory.some(
      item => item.name === name
    );

  if (alreadyHas) {
    return;
  }


  gameState.inventory.push({
    name,
    emoji
  });


  renderInventory();

  toast(
    "🎒 Item obtido: " + name
  );

}


function renderInventory() {

  const element =
    document.getElementById("inventory");


  if (
    gameState.inventory.length === 0
  ) {

    element.innerHTML = `
      <div style="
        color:var(--muted);
        grid-column:1/-1;
      ">
        Nenhum item ainda.
      </div>
    `;

    return;
  }


  element.innerHTML =
    gameState.inventory
      .map(item => `

        <div class="item">

          ${item.emoji}

          <small>
            ${item.name}
          </small>

        </div>

      `)
      .join("");

}


/* =========================================================
   MISSÕES
========================================================= */

function completeQuest(
  id,
  reward
) {

  const quest =
    gameState.quests[id];


  if (quest.done) {
    return;
  }


  quest.done = true;

  addXP(reward);

  renderQuests();

  toast(
    "✅ Missão concluída! +"
    + reward
    + " XP"
  );

}


function renderQuests() {

  const quests =
    gameState.quests;


  const data = [

    [
      "trash",
      "🗑️ Guerra de Lixo no Pátio",
      "Resolva a confusão do pátio."
    ],

    [
      "fakeNews",
      "📰 Mural das Fake News",
      "Converse com dois alunos e investigue o boato."
    ],

    [
      "science",
      "🔬 Feira de Ciências de Última Hora",
      "Encontre o componente e ajude sua colega."
    ]

  ];


  document.getElementById("quests")
    .innerHTML =

    data.map(
      ([id, title, description]) => {

        const quest =
          quests[id];


        return `

          <div class="
            quest
            ${quest.done ? "done" : ""}
          ">

            <strong>
              ${quest.done ? "✅ " : ""}
              ${title}
            </strong>

            <small>
              ${
                quest.done
                  ? "Concluída!"
                  : description
              }
            </small>

          </div>

        `;

      }
    ).join("");

}


/* =========================================================
   MUDANÇA DE CENÁRIO
========================================================= */

function changeScene(sceneId) {

  if (!scenes[sceneId]) {
    return;
  }


  gameState.scene = sceneId;


  const data =
    scenes[sceneId];


  const scene =
    document.getElementById("scene");


  document.getElementById("sceneTitle")
    .textContent =
    data.title;


  document.getElementById("sceneDescription")
    .textContent =
    data.desc;


  scene.dataset.scene =
    sceneId;


  scene.innerHTML = "";


  /* -----------------------------------------
     DECORAÇÕES DO PÁTIO
  ------------------------------------------ */

  if (sceneId === "yard") {

    scene.innerHTML = `

      <div
        class="bg-object cloud"
        style="
          left:12%;
          top:12%;
        ">
      </div>

      <div
        class="bg-object cloud"
        style="
          right:20%;
          top:20%;
        ">
      </div>

      <div
        class="bg-object tree small"
        style="
          left:92%;
        ">
        🌳
      </div>

      <div
        class="bg-object tree"
        style="
          left:52%;
        ">
        🌳
      </div>

      <div
        class="bg-object tree big"
        style="
          left:19%;
        ">
        🌳
      </div>

    `;

  }


  /* -----------------------------------------
     BIBLIOTECA
  ------------------------------------------ */

  else if (sceneId === "library") {

    scene.innerHTML = `

      <div
        class="bg-object"
        style="
          left:4%;
          top:20%;
          font-size:100px;
        ">
        📚
      </div>

      <div
        class="bg-object"
        style="
          right:4%;
          top:20%;
          font-size:100px;
        ">
        📚
      </div>

      <div
        class="bg-object desk"
        style="
          left:43%;
          top:48%;
        ">
        🪑
      </div>

    `;

  }


  /* -----------------------------------------
     LABORATÓRIO
  ------------------------------------------ */

  else if (sceneId === "lab") {

    scene.innerHTML = `

      <div
        class="bg-object"
        style="
          left:8%;
          top:25%;
          font-size:100px;
        ">
        🧫
      </div>

      <div
        class="bg-object"
        style="
          right:5%;
          top:25%;
          font-size:100px;
        ">
        ⚗️
      </div>

    `;

  }


  /* -----------------------------------------
     GRÊMIO
  ------------------------------------------ */

  else {

    scene.innerHTML = `

      <div
        class="bg-object"
        style="
          left:8%;
          top:25%;
          font-size:100px;
        ">
        🖼️
      </div>

      <div
        class="bg-object"
        style="
          right:8%;
          top:25%;
          font-size:100px;
        ">
        📋
      </div>

    `;

  }


  /* Piso — o pátio é gramado, então a faixa só entra nos cenários internos */

  if (sceneId !== "yard") {

    scene.innerHTML += `
      <div class="floor"></div>
    `;

  }


  /* -----------------------------------------
     CRIA HOTSPOTS
  ------------------------------------------ */

  data.hotspots.forEach(
    hotspot => {

      const button =
        document.createElement("button");


      button.className =
        "hotspot";


      button.style.left =
        hotspot.x + "%";


      button.style.top =
        hotspot.y + "%";


      button.innerHTML = `

        <span class="emoji">
          ${hotspot.emoji}
        </span>

        ${hotspot.label}

      `;


      button.onclick =
        hotspot.action;


      scene.appendChild(button);

    }
  );


  showDialogue({

    speaker: "Narrador",

    text:
      data.desc
      + " Clique nos personagens e objetos para interagir.",

    choices: []

  });

}


/* =========================================================
   SISTEMA DE DIÁLOGOS
========================================================= */

function showDialogue(node) {

  const box =
    document.getElementById("dialogue");


  box.innerHTML = `

    <div class="speaker">
      ${node.speaker || "Narrador"}
    </div>

    <div class="dialogue-text">
      ${node.text || ""}
    </div>

    <div class="options"></div>

  `;


  const options =
    box.querySelector(".options");


  (node.choices || [])
    .forEach(choice => {

      const button =
        document.createElement("button");


      button.className =
        "choice";


      button.textContent =
        choice.text;


      button.onclick = () => {

        if (choice.effect) {
          choice.effect();
        }

        if (choice.next) {
          showDialogue(choice.next);
        }

      };


      options.appendChild(button);

    });

}


/* =========================================================
   DIÁLOGO INICIAL
========================================================= */

const introNode = {

  speaker: "Diretora Luna",

  text:
    "Temos uma semana importante pela frente. "
    + "A escola está cheia de pequenos problemas. "
    + "Você pode ajudar a transformar tudo isso.",

  choices: [

    {

      text:
        "Pode contar comigo! 🤝",

      effect: () => {

        updateStats({
          climate: 3,
          reputation: 2
        });

        addXP(10);

      }

    },

    {

      text:
        "Quero investigar tudo. 🔎",

      effect: () => {

        updateStats({
          innovation: 3
        });

        addXP(10);

      }

    }

  ]

};


/* =========================================================
   MISSÃO 1
   GUERRA DE LIXO NO PÁTIO
========================================================= */

function janitorDialogue() {

  gameState.quests.trash.started =
    true;


  if (
    !gameState.flags.talkedJanitor
  ) {

    showDialogue({

      speaker:
        "Sr. Bento — Zelador",

      text:
        "O pátio está cheio de lixo "
        + "depois do recreio. Se ninguém agir, "
        + "vai ficar pior.",

      choices: [

        {

          text:
            "Vou organizar os alunos.",

          effect: () => {

            gameState.flags
              .talkedJanitor = true;

            gameState.flags
              .organizedStudents = true;


            updateStats({
              climate: 8,
              reputation: 4
            });


            addXP(30);


            completeQuest(
              "trash",
              40
            );


            showDialogue({

              speaker:
                "Sr. Bento",

              text:
                "Excelente! Quando os alunos "
                + "trabalham juntos, tudo fica melhor.",

              choices: []

            });

          }

        },

        {

          text:
            "Vamos criar um plano de reciclagem.",

          effect: () => {

            gameState.flags
              .talkedJanitor = true;


            updateStats({
              innovation: 8,
              climate: 4
            });


            addItem(
              "Plano de Reciclagem",
              "♻️"
            );


            addXP(25);


            completeQuest(
              "trash",
              40
            );

          }

        }

      ]

    });

  }

  else {

    showDialogue({

      speaker:
        "Sr. Bento",

      text:
        "O pátio está muito melhor "
        + "graças à sua ajuda!",

      choices: []

    });

  }

}


/* =========================================================
   RECICLAGEM
========================================================= */

function recycleDialogue() {

  if (
    !gameState.flags.talkedJanitor
  ) {

    showDialogue({

      speaker: "Narrador",

      text:
        "Talvez seja melhor conversar "
        + "com o zelador antes de organizar "
        + "a reciclagem.",

      choices: []

    });

    return;
  }


  addItem(
    "Material Reciclável",
    "♻️"
  );


  updateStats({
    climate: 2,
    innovation: 2
  });


  addXP(10);


  showDialogue({

    speaker: "Narrador",

    text:
      "Você separou os materiais corretamente.",

    choices: []

  });

}


/* =========================================================
   MISSÃO 2 — ANA
========================================================= */

function anaDialogue() {

  if (!gameState.flags.studentAna) {

    gameState.flags.studentAna =
      true;


    gameState.quests.fakeNews.started =
      true;


    gameState.quests.fakeNews.progress++;


    renderQuests();


    showDialogue({

      speaker: "Ana",

      text:
        "Você viu o mural? Estão dizendo "
        + "que a escola vai cancelar a feira. "
        + "Eu não sei se é verdade.",

      choices: [

        {

          text:
            "Vamos verificar antes de acreditar.",

          effect: () => {

            updateStats({
              reputation: 3,
              innovation: 3
            });

            addXP(20);

          }

        },

        {

          text:
            "Vou investigar quem publicou.",

          effect: () => {

            updateStats({
              innovation: 5
            });

            addXP(20);

          }

        }

      ]

    });

  }

  else {

    showDialogue({

      speaker: "Ana",

      text:
        "Ainda precisamos descobrir "
        + "a origem daquele boato.",

      choices: []

    });

  }

}


/* =========================================================
   MISSÃO 2 — LEO
========================================================= */

function leoDialogue() {

  if (!gameState.flags.studentLeo) {

    gameState.flags.studentLeo =
      true;


    gameState.quests.fakeNews.started =
      true;


    gameState.quests.fakeNews.progress++;


    renderQuests();


    showDialogue({

      speaker: "Leo",

      text:
        "Eu ouvi o mesmo boato. "
        + "Mas ninguém apresentou nenhuma fonte.",

      choices: [

        {

          text:
            "Vamos procurar informação oficial.",

          effect: () => {

            updateStats({
              reputation: 4,
              climate: 3
            });

            addXP(20);

            fakeNewsDecision();

          }

        },

        {

          text:
            "Melhor não espalhar até confirmar.",

          effect: () => {

            updateStats({
              climate: 5,
              reputation: 2
            });

            addXP(20);

            fakeNewsDecision();

          }

        }

      ]

    });

  }

  else {

    fakeNewsDecision();

  }

}


/* =========================================================
   CONCLUSÃO DAS FAKE NEWS
========================================================= */

function fakeNewsDecision() {

  if (
    gameState.flags.rumorDecision
  ) {
    return;
  }


  if (
    gameState.flags.studentAna &&
    gameState.flags.studentLeo
  ) {

    gameState.flags.rumorDecision =
      true;


    completeQuest(
      "fakeNews",
      50
    );


    showDialogue({

      speaker: "Narrador",

      text:
        "Vocês compararam as informações "
        + "e descobriram que o boato não tinha "
        + "fonte oficial. O mural agora terá "
        + "uma área para fontes verificadas.",

      choices: []

    });

  }

}


/* =========================================================
   MURAL
========================================================= */

function muralDialogue() {

  showDialogue({

    speaker:
      "Mural de Avisos",

    text:
      "Um papel diz: "
      + "'A feira de ciências foi cancelada!' "
      + "Não há assinatura nem fonte.",

    choices: [

      {

        text:
          "Investigar com os alunos.",

        effect: () => {

          gameState.quests.fakeNews.started =
            true;

          renderQuests();

          changeScene("library");

        }

      }

    ]

  });

}


/* =========================================================
   COMPUTADOR
========================================================= */

function computerDialogue() {

  if (
    gameState.player.class === "tech"
  ) {

    updateStats({
      innovation: 5
    });

    addXP(15);


    showDialogue({

      speaker:
        "Computador",

      text:
        "Você encontrou informações úteis "
        + "rapidamente graças ao seu conhecimento técnico.",

      choices: []

    });

  }

  else {

    showDialogue({

      speaker:
        "Computador",

      text:
        "Há registros da escola disponíveis. "
        + "Talvez conversar com alguém ajude "
        + "a interpretar os dados.",

      choices: []

    });

  }

}


/* =========================================================
   MISSÃO 3 — COMPONENTE
========================================================= */

function componentDialogue() {

  if (
    !gameState.flags.componentFound
  ) {

    gameState.flags.componentFound =
      true;


    addItem(
      "Microcontrolador",
      "🔌"
    );


    updateStats({
      innovation: 5
    });


    addXP(25);


    showDialogue({

      speaker: "Narrador",

      text:
        "Você encontrou o componente "
        + "que faltava para o projeto da feira!",

      choices: []

    });

  }

  else {

    showDialogue({

      speaker: "Narrador",

      text:
        "A bancada está organizada. "
        + "Você já pegou o componente.",

      choices: []

    });

  }

}


/* =========================================================
   MISSÃO 3 — BIA
========================================================= */

function scienceDialogue() {

  gameState.quests.science.started =
    true;


  if (
    !gameState.flags.componentFound
  ) {

    showDialogue({

      speaker: "Bia",

      text:
        "Meu projeto está quase pronto, "
        + "mas falta um microcontrolador. "
        + "Você viu algum?",

      choices: [

        {

          text:
            "Vou procurar!",

          effect: () => {

            changeScene("lab");

            toast(
              "🔎 Procure o componente na bancada."
            );

          }

        }

      ]

    });

    return;
  }


  if (
    !gameState.flags.helpedScience
  ) {

    gameState.flags.helpedScience =
      true;


    updateStats({
      innovation: 8,
      reputation: 5
    });


    addXP(30);


    completeQuest(
      "science",
      60
    );


    showDialogue({

      speaker: "Bia",

      text:
        "Funcionou! Nosso projeto está "
        + "pronto para a feira. Obrigada!",

      choices: []

    });

  }

  else {

    showDialogue({

      speaker: "Bia",

      text:
        "Nosso experimento está pronto "
        + "para apresentação!",

      choices: []

    });

  }

}


/* =========================================================
   GRÊMIO
========================================================= */

function clubDialogue() {

  showDialogue({

    speaker:
      "Grêmio Estudantil",

    text:
      "O conselho estudantil está reunindo "
      + "ideias para melhorar a escola.",

    choices: [

      {

        text:
          "Propor uma campanha de convivência.",

        effect: () => {

          updateStats({
            climate: 6,
            reputation: 3
          });

          addXP(20);

          toast(
            "💡 Ideia registrada!"
          );

        }

      },

      {

        text:
          "Propor um laboratório de tecnologia.",

        effect: () => {

          updateStats({
            innovation: 7,
            reputation: 2
          });

          addXP(20);

          toast(
            "💡 Projeto tecnológico registrado!"
          );

        }

      }

    ]

  });

}


/* =========================================================
   CRIAÇÃO DO PERSONAGEM
========================================================= */

function selectClass(element) {

  document
    .querySelectorAll(".class-card")
    .forEach(card => {

      card.classList.remove(
        "selected"
      );

    });


  element.classList.add(
    "selected"
  );


  selectedClass =
    element.dataset.class;

}


/* =========================================================
   INICIAR JOGO
========================================================= */

function startGame() {

  const name =
    document
      .getElementById("nameInput")
      .value
      .trim()
      || "Alex";


  gameState.player.name =
    name;

  gameState.player.class =
    selectedClass;


  /* Bônus da classe */

  if (
    selectedClass === "leader"
  ) {

    gameState.stats.climate += 10;

  }

  else if (
    selectedClass === "tech"
  ) {

    gameState.stats.innovation += 10;

  }

  else {

    gameState.player.energy =
      100;

    toast(
      "⚡ Energia extra de Atleta!"
    );

  }


  /* Esconde modal */

  document
    .getElementById("characterModal")
    .style.display = "none";


  /* Nome da classe */

  const names = {

    leader:
      "👑 Líder Estudantil",

    tech:
      "💻 Prodígio Tech",

    athlete:
      "🏃 Atleta / Motivador"

  };


  document
    .getElementById("playerClass")
    .textContent =
    names[selectedClass];


  updateStats({});

  renderInventory();

  renderQuests();

  changeScene("yard");

  showDialogue(
    introNode
  );

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document
  .getElementById("playerName")
  .textContent = "Alex";


document
  .getElementById("playerClass")
  .textContent =
  "Escolha sua classe";


updateStats({});

renderInventory();

renderQuests();


