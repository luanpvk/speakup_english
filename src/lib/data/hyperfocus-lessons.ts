import type { LessonGame, LessonSpec, QuizEntry, WordEntry } from "./lesson-builder";
import { focusModuleSlug, getHyperfocusTheme, type HyperfocusId } from "./hyperfocus";

/**
 * Capítulos extras de hiperfoco: um por tema, sempre liberado para quem escolheu o tema
 * (e para todos a partir do nível FOCUS_REQUIRED_LEVEL). Lições mais completas que as da trilha:
 * história própria, hora de falar, dois minijogos, monte a frase e 5 perguntas.
 */

type FocusLesson = {
  title: string;
  /** 5 palavras: [inglês, português, emoji] */
  words: WordEntry[];
  story: [string, string][];
  /** [frase em inglês, tradução] */
  speak: [string, string];
  /** Frase do "Monte a frase": [inglês, português] */
  order: [string, string];
};

type FocusChapter = {
  theme: HyperfocusId;
  title: string;
  description: string;
  lessons: FocusLesson[];
};

const FOCUS_REQUIRED_LEVEL = 10;

/** Pares de minijogos alternados entre as lições */
const GAME_PAIRS: LessonGame[][] = [
  ["memory", "puzzle"],
  ["match", "drag-fit"],
  ["drag-fit", "puzzle"],
  ["memory", "match"],
  ["match", "puzzle"],
];

const SPEAK_TIP = "Fale devagar, depois um pouco mais rápido. Repita três vezes!";

const FOCUS_CHAPTERS: FocusChapter[] = [
  {
    theme: "animals",
    title: "Safári Selvagem",
    description: "Savana, floresta e o que os animais fazem",
    lessons: [
      {
        title: "Animais da savana",
        words: [
          ["Lion", "Leão", "🦁"],
          ["Elephant", "Elefante", "🐘"],
          ["Giraffe", "Girafa", "🦒"],
          ["Rhino", "Rinoceronte", "🦏"],
          ["Hippo", "Hipopótamo", "🦛"],
        ],
        story: [
          ["The lion is the king.", "O leão é o rei."],
          ["The giraffe has a long neck.", "A girafa tem o pescoço comprido."],
          ["The elephant drinks water.", "O elefante bebe água."],
        ],
        speak: ["I see a lion", "Eu vejo um leão"],
        order: ["The elephant is big", "O elefante é grande"],
      },
      {
        title: "Animais da floresta",
        words: [
          ["Bear", "Urso", "🐻"],
          ["Fox", "Raposa", "🦊"],
          ["Wolf", "Lobo", "🐺"],
          ["Deer", "Veado", "🦌"],
          ["Squirrel", "Esquilo", "🐿️"],
        ],
        story: [
          ["The fox is orange.", "A raposa é laranja."],
          ["The bear sleeps in winter.", "O urso dorme no inverno."],
          ["The squirrel eats nuts.", "O esquilo come nozes."],
        ],
        speak: ["The wolf howls at night", "O lobo uiva à noite"],
        order: ["The bear is brown", "O urso é marrom"],
      },
      {
        title: "Partes dos animais",
        words: [
          ["Tail", "Rabo", "🐕"],
          ["Paw", "Pata", "🐾"],
          ["Fur", "Pelo", "🐑"],
          ["Claw", "Garra", "🐯"],
          ["Horn", "Chifre", "🦏"],
        ],
        story: [
          ["The cat has soft fur.", "O gato tem pelo macio."],
          ["The dog wags its tail.", "O cachorro balança o rabo."],
          ["The rhino has a horn.", "O rinoceronte tem um chifre."],
        ],
        speak: ["My dog has four paws", "Meu cachorro tem quatro patas"],
        order: ["The tiger has sharp claws", "O tigre tem garras afiadas"],
      },
      {
        title: "O que os animais fazem",
        words: [
          ["Roar", "Rugir", "🦁"],
          ["Hop", "Saltitar", "🐇"],
          ["Climb", "Escalar", "🐒"],
          ["Hunt", "Caçar", "🐆"],
          ["Hide", "Esconder-se", "🙈"],
        ],
        story: [
          ["The lion can roar.", "O leão sabe rugir."],
          ["The rabbit can hop.", "O coelho sabe saltitar."],
          ["The monkey can climb trees.", "O macaco sabe subir em árvores."],
        ],
        speak: ["The monkey can climb", "O macaco sabe escalar"],
        order: ["The rabbit can hop", "O coelho sabe saltitar"],
      },
      {
        title: "Onde os animais vivem",
        words: [
          ["Jungle", "Selva", "🌴"],
          ["Desert", "Deserto", "🏜️"],
          ["Farm", "Fazenda", "🚜"],
          ["Zoo", "Zoológico", "🦓"],
          ["Cave", "Caverna", "🪨"],
        ],
        story: [
          ["Camels live in the desert.", "Os camelos vivem no deserto."],
          ["Cows live on the farm.", "As vacas vivem na fazenda."],
          ["Bats sleep in a cave.", "Os morcegos dormem numa caverna."],
        ],
        speak: ["I want to visit the zoo", "Eu quero visitar o zoológico"],
        order: ["Monkeys live in the jungle", "Os macacos vivem na selva"],
      },
    ],
  },
  {
    theme: "space",
    title: "Missão Espacial",
    description: "Planetas, foguetes e astronautas",
    lessons: [
      {
        title: "Os planetas",
        words: [
          ["Sun", "Sol", "☀️"],
          ["Jupiter", "Júpiter", "🪐"],
          ["Saturn", "Saturno", "🪐"],
          ["Venus", "Vênus", "✨"],
          ["Mercury", "Mercúrio", "🌑"],
        ],
        story: [
          ["The Sun is a big star.", "O Sol é uma estrela grande."],
          ["Jupiter is the biggest planet.", "Júpiter é o maior planeta."],
          ["Saturn has beautiful rings.", "Saturno tem anéis lindos."],
        ],
        speak: ["Mercury is close to the Sun", "Mercúrio fica perto do Sol"],
        order: ["Saturn has rings", "Saturno tem anéis"],
      },
      {
        title: "Viagem de foguete",
        words: [
          ["Countdown", "Contagem regressiva", "🔟"],
          ["Blast off", "Decolar", "🚀"],
          ["Space helmet", "Capacete espacial", "👩‍🚀"],
          ["Spaceship", "Nave espacial", "🛸"],
          ["Crew", "Tripulação", "👨‍🚀"],
        ],
        story: [
          ["The crew is ready.", "A tripulação está pronta."],
          ["Ten, nine, eight... blast off!", "Dez, nove, oito... decolar!"],
          ["The spaceship flies to the Moon.", "A nave espacial voa até a Lua."],
        ],
        speak: ["Three, two, one, blast off!", "Três, dois, um, decolar!"],
        order: ["The rocket goes up", "O foguete sobe"],
      },
      {
        title: "No céu da noite",
        words: [
          ["Constellation", "Constelação", "✨"],
          ["Crater", "Cratera", "🌑"],
          ["Asteroid", "Asteroide", "☄️"],
          ["Milky Way", "Via Láctea", "🌌"],
          ["Black hole", "Buraco negro", "🕳️"],
        ],
        story: [
          ["The Moon has many craters.", "A Lua tem muitas crateras."],
          ["We live in the Milky Way.", "Nós vivemos na Via Láctea."],
          ["A black hole is very dark.", "Um buraco negro é muito escuro."],
        ],
        speak: ["I see a constellation", "Eu vejo uma constelação"],
        order: ["The asteroid is fast", "O asteroide é rápido"],
      },
      {
        title: "Vida de astronauta",
        words: [
          ["Float", "Flutuar", "🎈"],
          ["Spacewalk", "Caminhada espacial", "👩‍🚀"],
          ["Oxygen", "Oxigênio", "🫧"],
          ["Space food", "Comida espacial", "🥫"],
          ["Weightless", "Sem peso", "🪶"],
        ],
        story: [
          ["Astronauts float in space.", "Os astronautas flutuam no espaço."],
          ["They need oxygen to breathe.", "Eles precisam de oxigênio para respirar."],
          ["Space food comes in bags.", "A comida espacial vem em saquinhos."],
        ],
        speak: ["I can float in space", "Eu consigo flutuar no espaço"],
        order: ["Astronauts need oxygen", "Os astronautas precisam de oxigênio"],
      },
      {
        title: "Explorando o universo",
        words: [
          ["Rover", "Jipe espacial", "🚙"],
          ["Satellite", "Satélite", "🛰️"],
          ["Signal", "Sinal", "📡"],
          ["Light-year", "Ano-luz", "💫"],
          ["Explorer", "Explorador", "🧭"],
        ],
        story: [
          ["The rover drives on Mars.", "O jipe espacial anda em Marte."],
          ["The satellite sends a signal.", "O satélite manda um sinal."],
          ["I want to be an explorer.", "Eu quero ser um explorador."],
        ],
        speak: ["The satellite goes around the Earth", "O satélite gira em volta da Terra"],
        order: ["The rover is on Mars", "O jipe espacial está em Marte"],
      },
    ],
  },
  {
    theme: "vehicles",
    title: "Garagem dos Veículos",
    description: "Estrada, trilhos, céu e mar",
    lessons: [
      {
        title: "Na estrada",
        words: [
          ["Truck", "Caminhão", "🚚"],
          ["Motorcycle", "Moto", "🏍️"],
          ["Fire truck", "Caminhão de bombeiros", "🚒"],
          ["Bicycle", "Bicicleta", "🚲"],
          ["Tractor", "Trator", "🚜"],
        ],
        story: [
          ["The truck is very long.", "O caminhão é muito comprido."],
          ["I ride my bicycle to the park.", "Eu ando de bicicleta até o parque."],
          ["The tractor works on the farm.", "O trator trabalha na fazenda."],
        ],
        speak: ["The fire truck is red", "O caminhão de bombeiros é vermelho"],
        order: ["I ride my bicycle", "Eu ando de bicicleta"],
      },
      {
        title: "Nos trilhos",
        words: [
          ["Train", "Trem", "🚆"],
          ["Steam train", "Trem a vapor", "🚂"],
          ["Railway", "Ferrovia", "🛤️"],
          ["Train driver", "Maquinista", "👷"],
          ["Wagon", "Vagão", "🚃"],
        ],
        story: [
          ["The steam train goes choo choo.", "O trem a vapor faz piuí."],
          ["The train has many wagons.", "O trem tem muitos vagões."],
          ["The train driver waves hello.", "O maquinista acena para dar oi."],
        ],
        speak: ["All aboard the train!", "Todos a bordo do trem!"],
        order: ["The train is on the railway", "O trem está na ferrovia"],
      },
      {
        title: "No céu",
        words: [
          ["Airplane", "Avião", "✈️"],
          ["Runway", "Pista de pouso", "🛬"],
          ["Hot air balloon", "Balão de ar quente", "🎈"],
          ["Jet", "Jato", "🛩️"],
          ["Parachute", "Paraquedas", "🪂"],
        ],
        story: [
          ["The airplane is on the runway.", "O avião está na pista de pouso."],
          ["The jet is very fast.", "O jato é muito rápido."],
          ["The hot air balloon flies slowly.", "O balão de ar quente voa devagar."],
        ],
        speak: ["The airplane takes off", "O avião decola"],
        order: ["The jet flies high", "O jato voa alto"],
      },
      {
        title: "Na água",
        words: [
          ["Ship", "Navio", "🚢"],
          ["Sailboat", "Veleiro", "⛵"],
          ["Submarine", "Submarino", "🌊"],
          ["Canoe", "Canoa", "🛶"],
          ["Ferry", "Balsa", "⛴️"],
        ],
        story: [
          ["The ship is huge.", "O navio é enorme."],
          ["The submarine goes under the water.", "O submarino vai embaixo da água."],
          ["We cross the river by ferry.", "Nós atravessamos o rio de balsa."],
        ],
        speak: ["The sailboat uses the wind", "O veleiro usa o vento"],
        order: ["The submarine is yellow", "O submarino é amarelo"],
      },
      {
        title: "Peças e sinais",
        words: [
          ["Traffic light", "Semáforo", "🚦"],
          ["Horn", "Buzina", "📯"],
          ["Brake", "Freio", "🛑"],
          ["Steering wheel", "Volante", "🚗"],
          ["Tire", "Pneu", "🛞"],
        ],
        story: [
          ["Red light means stop.", "Luz vermelha quer dizer pare."],
          ["The driver uses the brake.", "O motorista usa o freio."],
          ["Beep beep! That is the horn.", "Bi-bi! Essa é a buzina."],
        ],
        speak: ["Green light means go", "Luz verde quer dizer siga"],
        order: ["The car has four tires", "O carro tem quatro pneus"],
      },
    ],
  },
  {
    theme: "ocean",
    title: "Fundo do Mar",
    description: "Peixes, gigantes do mar e mergulho",
    lessons: [
      {
        title: "Peixes e amigos",
        words: [
          ["Fish", "Peixe", "🐟"],
          ["Seahorse", "Cavalo-marinho", "🌊"],
          ["Turtle", "Tartaruga", "🐢"],
          ["Clownfish", "Peixe-palhaço", "🐠"],
          ["Eel", "Enguia", "🌊"],
        ],
        story: [
          ["The turtle swims slowly.", "A tartaruga nada devagar."],
          ["The clownfish is orange and white.", "O peixe-palhaço é laranja e branco."],
          ["The seahorse is very small.", "O cavalo-marinho é muito pequeno."],
        ],
        speak: ["I love sea turtles", "Eu amo tartarugas marinhas"],
        order: ["The fish swims fast", "O peixe nada rápido"],
      },
      {
        title: "Gigantes do mar",
        words: [
          ["Blue whale", "Baleia-azul", "🐋"],
          ["Killer whale", "Orca", "🐳"],
          ["Manta ray", "Arraia-jamanta", "🌊"],
          ["Giant squid", "Lula gigante", "🦑"],
          ["Walrus", "Morsa", "🦭"],
        ],
        story: [
          ["The blue whale is the biggest animal.", "A baleia-azul é o maior animal."],
          ["The giant squid has long arms.", "A lula gigante tem braços compridos."],
          ["The walrus has big teeth.", "A morsa tem dentes grandes."],
        ],
        speak: ["The blue whale is huge", "A baleia-azul é enorme"],
        order: ["The walrus lives in the cold", "A morsa vive no frio"],
      },
      {
        title: "Debaixo d'água",
        words: [
          ["Reef", "Recife de coral", "🪸"],
          ["Seaweed", "Alga marinha", "🌿"],
          ["Bubble", "Bolha", "🫧"],
          ["Pearl", "Pérola", "🦪"],
          ["Sea floor", "Fundo do mar", "🌊"],
        ],
        story: [
          ["Many fish live on the reef.", "Muitos peixes vivem no recife de coral."],
          ["I see bubbles in the water.", "Eu vejo bolhas na água."],
          ["The pearl is inside the shell.", "A pérola está dentro da concha."],
        ],
        speak: ["Look at the bubbles!", "Olha as bolhas!"],
        order: ["The seaweed is green", "A alga marinha é verde"],
      },
      {
        title: "Mergulhador",
        words: [
          ["Diver", "Mergulhador", "🤿"],
          ["Fins", "Nadadeiras", "🤿"],
          ["Goggles", "Óculos de natação", "🥽"],
          ["Oxygen tank", "Cilindro de oxigênio", "🫧"],
          ["Underwater", "Debaixo d'água", "🌊"],
        ],
        story: [
          ["The diver wears fins.", "O mergulhador usa nadadeiras."],
          ["I wear goggles to swim.", "Eu uso óculos de natação para nadar."],
          ["We swim underwater.", "Nós nadamos debaixo d'água."],
        ],
        speak: ["I want to be a diver", "Eu quero ser mergulhador"],
        order: ["The diver swims underwater", "O mergulhador nada debaixo d'água"],
      },
      {
        title: "Cuidando do oceano",
        words: [
          ["Clean beach", "Praia limpa", "🏖️"],
          ["Plastic bag", "Sacola plástica", "🛍️"],
          ["Protect the sea", "Proteger o mar", "💙"],
          ["Marine biologist", "Biólogo marinho", "🔬"],
          ["Sea turtle", "Tartaruga marinha", "🐢"],
        ],
        story: [
          ["Plastic bags hurt sea animals.", "As sacolas plásticas machucam os animais do mar."],
          ["We keep the beach clean.", "Nós mantemos a praia limpa."],
          ["A marine biologist studies the ocean.", "Um biólogo marinho estuda o oceano."],
        ],
        speak: ["Let us protect the sea", "Vamos proteger o mar"],
        order: ["Keep the beach clean", "Mantenha a praia limpa"],
      },
    ],
  },
  {
    theme: "calendar",
    title: "Relógios e Calendários",
    description: "Horas, dias e o calendário",
    lessons: [
      {
        title: "As horas",
        words: [
          ["O'clock", "Em ponto", "🕐"],
          ["Half past", "E meia", "🕧"],
          ["Quarter past", "E quinze", "🕒"],
          ["Minute", "Minuto", "⏱️"],
          ["Hour", "Hora", "⏰"],
        ],
        story: [
          ["It is seven o'clock.", "São sete horas em ponto."],
          ["School starts at half past seven.", "A escola começa às sete e meia."],
          ["One hour has sixty minutes.", "Uma hora tem sessenta minutos."],
        ],
        speak: ["What time is it?", "Que horas são?"],
        order: ["It is three o'clock", "São três horas em ponto"],
      },
      {
        title: "O relógio",
        words: [
          ["Clock", "Relógio de parede", "🕰️"],
          ["Watch", "Relógio de pulso", "⌚"],
          ["Hour hand", "Ponteiro das horas", "🕰️"],
          ["Minute hand", "Ponteiro dos minutos", "🕰️"],
          ["Tick tock", "Tique-taque", "⏰"],
        ],
        story: [
          ["The clock says tick tock.", "O relógio faz tique-taque."],
          ["My watch is on my wrist.", "Meu relógio de pulso está no meu braço."],
          ["The minute hand is long.", "O ponteiro dos minutos é comprido."],
        ],
        speak: ["I can read the clock", "Eu sei ler o relógio"],
        order: ["My watch is blue", "Meu relógio de pulso é azul"],
      },
      {
        title: "Ontem, hoje e amanhã",
        words: [
          ["Weekday", "Dia de semana", "📅"],
          ["Weekend", "Fim de semana", "🎉"],
          ["Yesterday", "Ontem", "⬅️"],
          ["Today", "Hoje", "📍"],
          ["Tomorrow", "Amanhã", "➡️"],
        ],
        story: [
          ["Today is Monday.", "Hoje é segunda-feira."],
          ["Yesterday was Sunday.", "Ontem foi domingo."],
          ["The weekend is fun!", "O fim de semana é divertido!"],
        ],
        speak: ["Tomorrow is Friday", "Amanhã é sexta-feira"],
        order: ["Today is my birthday", "Hoje é meu aniversário"],
      },
      {
        title: "O calendário",
        words: [
          ["Calendar", "Calendário", "📅"],
          ["Week", "Semana", "🗓️"],
          ["Leap year", "Ano bissexto", "📆"],
          ["Century", "Século", "🏛️"],
          ["Decade", "Década", "🔟"],
        ],
        story: [
          ["A week has seven days.", "Uma semana tem sete dias."],
          ["A decade has ten years.", "Uma década tem dez anos."],
          ["A century has one hundred years.", "Um século tem cem anos."],
        ],
        speak: ["A year has twelve months", "Um ano tem doze meses"],
        order: ["A week has seven days", "Uma semana tem sete dias"],
      },
      {
        title: "Cedo ou tarde?",
        words: [
          ["Early", "Cedo", "🌅"],
          ["Late", "Atrasado", "⌛"],
          ["Soon", "Em breve", "⏳"],
          ["Later", "Mais tarde", "🕓"],
          ["Alarm", "Alarme", "⏰"],
        ],
        story: [
          ["I wake up early.", "Eu acordo cedo."],
          ["Do not be late for school.", "Não chegue atrasado na escola."],
          ["The party starts soon.", "A festa começa em breve."],
        ],
        speak: ["See you later!", "Até mais tarde!"],
        order: ["I wake up early", "Eu acordo cedo"],
      },
    ],
  },
  {
    theme: "numbers",
    title: "Mundo dos Números",
    description: "Contas, medidas e posições",
    lessons: [
      {
        title: "Contando de dez em dez",
        words: [
          ["Twenty", "Vinte", "🔢"],
          ["Thirty", "Trinta", "🔢"],
          ["Forty", "Quarenta", "🔢"],
          ["Fifty", "Cinquenta", "🔢"],
          ["One hundred", "Cem", "💯"],
        ],
        story: [
          ["I have twenty crayons.", "Eu tenho vinte gizes de cera."],
          ["My grandpa is fifty.", "Meu avô tem cinquenta anos."],
          ["One hundred is a big number.", "Cem é um número grande."],
        ],
        speak: ["I can count to one hundred", "Eu sei contar até cem"],
        order: ["I have thirty stickers", "Eu tenho trinta adesivos"],
      },
      {
        title: "Fazendo contas",
        words: [
          ["Plus", "Mais", "➕"],
          ["Minus", "Menos", "➖"],
          ["Equals", "É igual a", "🟰"],
          ["Times", "Vezes", "✖️"],
          ["Divided by", "Dividido por", "➗"],
        ],
        story: [
          ["Two plus two equals four.", "Dois mais dois é igual a quatro."],
          ["Five minus one equals four.", "Cinco menos um é igual a quatro."],
          ["Two times three equals six.", "Dois vezes três é igual a seis."],
        ],
        speak: ["Two plus two equals four", "Dois mais dois é igual a quatro"],
        order: ["Ten minus five equals five", "Dez menos cinco é igual a cinco"],
      },
      {
        title: "Par, ímpar e metade",
        words: [
          ["Even", "Par", "2️⃣"],
          ["Odd", "Ímpar", "3️⃣"],
          ["Half", "Metade", "🌗"],
          ["Double", "Dobro", "✌️"],
          ["Number line", "Reta numérica", "📏"],
        ],
        story: [
          ["Two is an even number.", "Dois é um número par."],
          ["Three is an odd number.", "Três é um número ímpar."],
          ["Half of ten is five.", "A metade de dez é cinco."],
        ],
        speak: ["Four is an even number", "Quatro é um número par"],
        order: ["Seven is an odd number", "Sete é um número ímpar"],
      },
      {
        title: "Medindo as coisas",
        words: [
          ["Centimeter", "Centímetro", "📏"],
          ["Meter", "Metro", "📐"],
          ["Kilogram", "Quilo", "⚖️"],
          ["Liter", "Litro", "🥛"],
          ["Thermometer", "Termômetro", "🌡️"],
        ],
        story: [
          ["The table is one meter long.", "A mesa tem um metro de comprimento."],
          ["I drink one liter of water.", "Eu bebo um litro de água."],
          ["The bag weighs two kilograms.", "A sacola pesa dois quilos."],
        ],
        speak: ["My pencil is ten centimeters long", "Meu lápis tem dez centímetros"],
        order: ["I drink one liter of water", "Eu bebo um litro de água"],
      },
      {
        title: "Primeiro e último",
        words: [
          ["First", "Primeiro", "🥇"],
          ["Second", "Segundo", "🥈"],
          ["Third", "Terceiro", "🥉"],
          ["Last", "Último", "🏁"],
          ["Next", "Próximo", "➡️"],
        ],
        story: [
          ["I am first in line.", "Eu sou o primeiro da fila."],
          ["My friend is second.", "Meu amigo é o segundo."],
          ["Who is next?", "Quem é o próximo?"],
        ],
        speak: ["I came in first place", "Eu fiquei em primeiro lugar"],
        order: ["You are the next one", "Você é o próximo"],
      },
    ],
  },
  {
    theme: "games",
    title: "Games e Robôs",
    description: "Videogame, botões e programação",
    lessons: [
      {
        title: "Jogando videogame",
        words: [
          ["Controller", "Controle", "🎮"],
          ["Level", "Fase", "🪜"],
          ["Player", "Jogador", "🧑"],
          ["High score", "Recorde", "🏆"],
          ["Game over", "Fim de jogo", "🛑"],
        ],
        story: [
          ["I hold the controller.", "Eu seguro o controle."],
          ["This level is hard.", "Esta fase é difícil."],
          ["I got a new high score!", "Eu bati um novo recorde!"],
        ],
        speak: ["Press start to play", "Aperte start para jogar"],
        order: ["I am player one", "Eu sou o jogador um"],
      },
      {
        title: "Dentro do jogo",
        words: [
          ["Lives", "Vidas", "❤️"],
          ["Power-up", "Poder especial", "⭐"],
          ["Boss", "Chefão", "👾"],
          ["Checkpoint", "Ponto de salvamento", "🚩"],
          ["Treasure chest", "Baú do tesouro", "🧰"],
        ],
        story: [
          ["I have three lives.", "Eu tenho três vidas."],
          ["The power-up makes me fast.", "O poder especial me deixa rápido."],
          ["The boss is very strong.", "O chefão é muito forte."],
        ],
        speak: ["I found a treasure chest", "Eu achei um baú do tesouro"],
        order: ["I beat the boss", "Eu venci o chefão"],
      },
      {
        title: "Botões e comandos",
        words: [
          ["Press", "Apertar", "👆"],
          ["Pause", "Pausar", "⏸️"],
          ["Restart", "Recomeçar", "🔁"],
          ["Settings", "Configurações", "⚙️"],
          ["Save the game", "Salvar o jogo", "💾"],
        ],
        story: [
          ["Press the green button.", "Aperte o botão verde."],
          ["I pause the game to eat.", "Eu pauso o jogo para comer."],
          ["Do not forget to save the game.", "Não esqueça de salvar o jogo."],
        ],
        speak: ["Press the button", "Aperte o botão"],
        order: ["I save the game", "Eu salvo o jogo"],
      },
      {
        title: "Robôs e programação",
        words: [
          ["Code", "Código", "💻"],
          ["Program", "Programar", "🧑‍💻"],
          ["Bug", "Erro no código", "🐛"],
          ["Robot arm", "Braço robótico", "🦾"],
          ["Build a robot", "Montar um robô", "🤖"],
        ],
        story: [
          ["I write code on the computer.", "Eu escrevo código no computador."],
          ["My robot has a robot arm.", "Meu robô tem um braço robótico."],
          ["There is a bug in the code.", "Tem um erro no código."],
        ],
        speak: ["I can program a robot", "Eu sei programar um robô"],
        order: ["I build a robot", "Eu monto um robô"],
      },
      {
        title: "Jogando junto",
        words: [
          ["Teammate", "Colega de equipe", "🤝"],
          ["Multiplayer", "Multijogador", "👥"],
          ["Good game", "Bom jogo", "👍"],
          ["Turn", "Vez", "🔄"],
          ["Win together", "Vencer juntos", "🏅"],
        ],
        story: [
          ["My teammate helps me.", "Meu colega de equipe me ajuda."],
          ["It is your turn now.", "Agora é a sua vez."],
          ["We say good game at the end.", "No final, nós dizemos bom jogo."],
        ],
        speak: ["Good game, friend!", "Bom jogo, amigo!"],
        order: ["It is my turn", "É a minha vez"],
      },
    ],
  },
  {
    theme: "music",
    title: "Palco da Música",
    description: "Instrumentos, partituras e show",
    lessons: [
      {
        title: "Instrumentos de cordas",
        words: [
          ["Cello", "Violoncelo", "🎻"],
          ["Harp", "Harpa", "🎵"],
          ["Bass", "Contrabaixo", "🎻"],
          ["Strings", "Cordas", "🎸"],
          ["Bow", "Arco", "🎻"],
        ],
        story: [
          ["The cello has a deep sound.", "O violoncelo tem um som grave."],
          ["The harp has many strings.", "A harpa tem muitas cordas."],
          ["I play the violin with a bow.", "Eu toco violino com um arco."],
        ],
        speak: ["I play the harp", "Eu toco harpa"],
        order: ["The cello is big", "O violoncelo é grande"],
      },
      {
        title: "Percussão",
        words: [
          ["Xylophone", "Xilofone", "🎵"],
          ["Tambourine", "Pandeiro", "🪘"],
          ["Cymbals", "Pratos", "🥁"],
          ["Drumsticks", "Baquetas", "🥢"],
          ["Drum kit", "Bateria", "🥁"],
        ],
        story: [
          ["I hit the cymbals.", "Eu bato os pratos."],
          ["Shake the tambourine!", "Sacuda o pandeiro!"],
          ["My brother plays the drum kit.", "Meu irmão toca bateria."],
        ],
        speak: ["I hit the drum with drumsticks", "Eu bato no tambor com as baquetas"],
        order: ["I play the xylophone", "Eu toco xilofone"],
      },
      {
        title: "Sopro e teclas",
        words: [
          ["Saxophone", "Saxofone", "🎷"],
          ["Clarinet", "Clarinete", "🎵"],
          ["Keys", "Teclas", "🎹"],
          ["Harmonica", "Gaita", "🎵"],
          ["Recorder", "Flauta doce", "🎵"],
        ],
        story: [
          ["The saxophone is shiny.", "O saxofone é brilhante."],
          ["I learn the recorder at school.", "Eu aprendo flauta doce na escola."],
          ["The piano has black and white keys.", "O piano tem teclas pretas e brancas."],
        ],
        speak: ["I blow the harmonica", "Eu sopro a gaita"],
        order: ["The saxophone is loud", "O saxofone é barulhento"],
      },
      {
        title: "Lendo música",
        words: [
          ["Beat", "Batida", "🥁"],
          ["Rest", "Pausa", "🤫"],
          ["Sheet music", "Partitura", "🎼"],
          ["Scale", "Escala musical", "🎶"],
          ["Composer", "Compositor", "✍️"],
        ],
        story: [
          ["Clap to the beat.", "Bata palmas na batida."],
          ["The composer writes sheet music.", "O compositor escreve partituras."],
          ["I practice my scale every day.", "Eu pratico minha escala musical todo dia."],
        ],
        speak: ["Clap to the beat", "Bata palmas na batida"],
        order: ["I read sheet music", "Eu leio partitura"],
      },
      {
        title: "Hora do show",
        words: [
          ["Audience", "Plateia", "👏"],
          ["Encore", "Bis", "🔁"],
          ["Take a bow", "Agradecer com reverência", "🙇"],
          ["Spotlight", "Holofote", "🔦"],
          ["Rehearsal", "Ensaio", "🗓️"],
        ],
        story: [
          ["The audience claps.", "A plateia aplaude."],
          ["We have a rehearsal today.", "Nós temos ensaio hoje."],
          ["The singer stands in the spotlight.", "O cantor fica embaixo do holofote."],
        ],
        speak: ["Encore! One more song!", "Bis! Mais uma música!"],
        order: ["The audience is happy", "A plateia está feliz"],
      },
    ],
  },
  {
    theme: "sports",
    title: "Campeonato Esportivo",
    description: "Futebol, quadra e competição",
    lessons: [
      {
        title: "Futebol",
        words: [
          ["Soccer", "Futebol", "⚽"],
          ["Goalkeeper", "Goleiro", "🧤"],
          ["Penalty", "Pênalti", "🥅"],
          ["Jersey", "Camisa do time", "👕"],
          ["Corner kick", "Escanteio", "🚩"],
        ],
        story: [
          ["I love soccer.", "Eu amo futebol."],
          ["The goalkeeper catches the ball.", "O goleiro pega a bola."],
          ["He scores a penalty.", "Ele marca um pênalti."],
        ],
        speak: ["Pass me the ball!", "Passa a bola pra mim!"],
        order: ["The goalkeeper is tall", "O goleiro é alto"],
      },
      {
        title: "Na quadra",
        words: [
          ["Net", "Rede", "🥅"],
          ["Racket", "Raquete", "🎾"],
          ["Hoop", "Cesta de basquete", "🏀"],
          ["Dribble", "Driblar", "⛹️"],
          ["Point", "Ponto", "1️⃣"],
        ],
        story: [
          ["I hit the ball with my racket.", "Eu bato na bola com a raquete."],
          ["The ball goes over the net.", "A bola passa por cima da rede."],
          ["She throws the ball in the hoop.", "Ela joga a bola na cesta."],
        ],
        speak: ["I can dribble the ball", "Eu sei driblar com a bola"],
        order: ["We win one point", "Nós ganhamos um ponto"],
      },
      {
        title: "Esportes radicais",
        words: [
          ["Skateboard", "Skate", "🛹"],
          ["Rock climbing", "Escalada", "🧗"],
          ["Cycling", "Ciclismo", "🚴"],
          ["Karate", "Caratê", "🥋"],
          ["Gymnastics", "Ginástica", "🤸"],
        ],
        story: [
          ["I do karate after school.", "Eu faço caratê depois da escola."],
          ["Gymnastics makes me strong.", "A ginástica me deixa forte."],
          ["We go cycling on Sunday.", "Nós vamos pedalar no domingo."],
        ],
        speak: ["I do gymnastics", "Eu faço ginástica"],
        order: ["My skateboard is fast", "Meu skate é rápido"],
      },
      {
        title: "Corpo em movimento",
        words: [
          ["Warm up", "Aquecer", "🔥"],
          ["Sweat", "Suar", "💦"],
          ["Muscles", "Músculos", "💪"],
          ["Energy", "Energia", "⚡"],
          ["Water break", "Pausa para água", "🚰"],
        ],
        story: [
          ["We warm up before the game.", "Nós aquecemos antes do jogo."],
          ["Exercise makes my muscles strong.", "O exercício deixa meus músculos fortes."],
          ["Time for a water break!", "Hora da pausa para água!"],
        ],
        speak: ["I have a lot of energy", "Eu tenho muita energia"],
        order: ["We warm up first", "Nós aquecemos primeiro"],
      },
      {
        title: "A grande final",
        words: [
          ["Trophy", "Troféu", "🏆"],
          ["Gold medal", "Medalha de ouro", "🥇"],
          ["Finish line", "Linha de chegada", "🏁"],
          ["Podium", "Pódio", "🥈"],
          ["Teamwork", "Trabalho em equipe", "🤝"],
        ],
        story: [
          ["She crosses the finish line.", "Ela cruza a linha de chegada."],
          ["Our team wins the trophy.", "Nosso time ganha o troféu."],
          ["Teamwork is important.", "O trabalho em equipe é importante."],
        ],
        speak: ["We are the champions!", "Nós somos os campeões!"],
        order: ["I won a gold medal", "Eu ganhei uma medalha de ouro"],
      },
    ],
  },
  {
    theme: "nature",
    title: "Explorador da Natureza",
    description: "Árvores, paisagens e trilhas",
    lessons: [
      {
        title: "As árvores",
        words: [
          ["Trunk", "Tronco", "🌳"],
          ["Bark", "Casca da árvore", "🪵"],
          ["Pine tree", "Pinheiro", "🌲"],
          ["Acorn", "Bolota", "🌰"],
          ["Treetop", "Copa da árvore", "🌳"],
        ],
        story: [
          ["The tree has a thick trunk.", "A árvore tem um tronco grosso."],
          ["Squirrels love acorns.", "Os esquilos adoram bolotas."],
          ["Birds sing in the treetop.", "Os pássaros cantam na copa da árvore."],
        ],
        speak: ["I hug the tree", "Eu abraço a árvore"],
        order: ["The pine tree is green", "O pinheiro é verde"],
      },
      {
        title: "Paisagens",
        words: [
          ["Valley", "Vale", "🏞️"],
          ["Waterfall", "Cachoeira", "💧"],
          ["Volcano", "Vulcão", "🌋"],
          ["Meadow", "Campo florido", "🌼"],
          ["Canyon", "Cânion", "🏜️"],
        ],
        story: [
          ["The waterfall is beautiful.", "A cachoeira é linda."],
          ["The volcano is very hot.", "O vulcão é muito quente."],
          ["Cows eat grass in the meadow.", "As vacas comem grama no campo florido."],
        ],
        speak: ["Look at the waterfall!", "Olha a cachoeira!"],
        order: ["The volcano is tall", "O vulcão é alto"],
      },
      {
        title: "A vida da planta",
        words: [
          ["Sprout", "Broto", "🌱"],
          ["Bud", "Botão de flor", "🌷"],
          ["Petal", "Pétala", "🌸"],
          ["Pollen", "Pólen", "🐝"],
          ["Bloom", "Florescer", "🌺"],
        ],
        story: [
          ["The seed becomes a sprout.", "A semente vira um broto."],
          ["Bees carry pollen.", "As abelhas carregam pólen."],
          ["The flower blooms in spring.", "A flor floresce na primavera."],
        ],
        speak: ["The flower has pink petals", "A flor tem pétalas cor-de-rosa"],
        order: ["The sprout is small", "O broto é pequeno"],
      },
      {
        title: "Trilha na mata",
        words: [
          ["Trail", "Trilha", "🥾"],
          ["Backpack", "Mochila", "🎒"],
          ["Compass", "Bússola", "🧭"],
          ["Flashlight", "Lanterna", "🔦"],
          ["Binoculars", "Binóculo", "🔭"],
        ],
        story: [
          ["We walk on the trail.", "Nós andamos na trilha."],
          ["The compass shows north.", "A bússola mostra o norte."],
          ["I see birds with binoculars.", "Eu vejo pássaros com o binóculo."],
        ],
        speak: ["I have a compass", "Eu tenho uma bússola"],
        order: ["My backpack is ready", "Minha mochila está pronta"],
      },
      {
        title: "O céu e o tempo",
        words: [
          ["Rainbow", "Arco-íris", "🌈"],
          ["Thunder", "Trovão", "⛈️"],
          ["Lightning", "Relâmpago", "⚡"],
          ["Fog", "Neblina", "🌫️"],
          ["Breeze", "Brisa", "🍃"],
        ],
        story: [
          ["After the rain, I see a rainbow.", "Depois da chuva, eu vejo um arco-íris."],
          ["Thunder is very loud.", "O trovão é muito barulhento."],
          ["There is fog in the morning.", "Tem neblina de manhã."],
        ],
        speak: ["Look at the rainbow!", "Olha o arco-íris!"],
        order: ["The breeze is cool", "A brisa é fresquinha"],
      },
    ],
  },
  {
    theme: "food",
    title: "Chef de Cozinha",
    description: "Frutas, sabores e receitas",
    lessons: [
      {
        title: "Frutas",
        words: [
          ["Strawberry", "Morango", "🍓"],
          ["Pineapple", "Abacaxi", "🍍"],
          ["Watermelon", "Melancia", "🍉"],
          ["Grapes", "Uvas", "🍇"],
          ["Mango", "Manga", "🥭"],
        ],
        story: [
          ["I love strawberries.", "Eu amo morangos."],
          ["The watermelon is big and red.", "A melancia é grande e vermelha."],
          ["Mango is sweet.", "A manga é doce."],
        ],
        speak: ["Can I have some grapes?", "Posso comer umas uvas?"],
        order: ["The pineapple is sweet", "O abacaxi é doce"],
      },
      {
        title: "Legumes e verduras",
        words: [
          ["Carrot", "Cenoura", "🥕"],
          ["Broccoli", "Brócolis", "🥦"],
          ["Corn", "Milho", "🌽"],
          ["Potato", "Batata", "🥔"],
          ["Lettuce", "Alface", "🥬"],
        ],
        story: [
          ["Rabbits like carrots.", "Os coelhos gostam de cenoura."],
          ["Broccoli looks like a tree.", "O brócolis parece uma árvore."],
          ["I eat corn at the party.", "Eu como milho na festa."],
        ],
        speak: ["I eat my vegetables", "Eu como meus legumes"],
        order: ["The carrot is orange", "A cenoura é laranja"],
      },
      {
        title: "Café da manhã",
        words: [
          ["Pancakes", "Panquecas", "🥞"],
          ["Toast", "Torrada", "🍞"],
          ["Scrambled eggs", "Ovos mexidos", "🍳"],
          ["Honey", "Mel", "🍯"],
          ["Yogurt", "Iogurte", "🥛"],
        ],
        story: [
          ["I eat pancakes with honey.", "Eu como panquecas com mel."],
          ["Dad makes scrambled eggs.", "O papai faz ovos mexidos."],
          ["Yogurt is good for you.", "O iogurte faz bem para você."],
        ],
        speak: ["I want toast, please", "Eu quero torrada, por favor"],
        order: ["I like pancakes with honey", "Eu gosto de panquecas com mel"],
      },
      {
        title: "Sabores",
        words: [
          ["Salty", "Salgado", "🧂"],
          ["Spicy", "Apimentado", "🌶️"],
          ["Bitter", "Amargo", "☕"],
          ["Crunchy", "Crocante", "🥨"],
          ["Juicy", "Suculento", "🍑"],
        ],
        story: [
          ["Chips are salty and crunchy.", "Batatinhas são salgadas e crocantes."],
          ["This sauce is spicy!", "Este molho é apimentado!"],
          ["The peach is juicy.", "O pêssego é suculento."],
        ],
        speak: ["This soup is too spicy", "Esta sopa está apimentada demais"],
        order: ["The apple is crunchy", "A maçã é crocante"],
      },
      {
        title: "Na cozinha do chef",
        words: [
          ["Apron", "Avental", "👨‍🍳"],
          ["Whisk", "Batedor", "🥣"],
          ["Cutting board", "Tábua de cortar", "🔪"],
          ["Rolling pin", "Rolo de massa", "🥖"],
          ["Dough", "Massa", "🍞"],
        ],
        story: [
          ["The chef wears an apron.", "O chef usa um avental."],
          ["We roll the dough with a rolling pin.", "Nós abrimos a massa com o rolo de massa."],
          ["Mix the eggs with a whisk.", "Misture os ovos com o batedor."],
        ],
        speak: ["Let us bake a cake", "Vamos fazer um bolo"],
        order: ["The chef wears an apron", "O chef usa um avental"],
      },
    ],
  },
  {
    theme: "art",
    title: "Ateliê de Arte",
    description: "Materiais, cores e museu",
    lessons: [
      {
        title: "Materiais de arte",
        words: [
          ["Paintbrush", "Pincel", "🖌️"],
          ["Crayon", "Giz de cera", "🖍️"],
          ["Glue", "Cola", "🧴"],
          ["Scissors", "Tesoura", "✂️"],
          ["Canvas", "Tela de pintura", "🖼️"],
        ],
        story: [
          ["I paint with a paintbrush.", "Eu pinto com um pincel."],
          ["Use glue to stick the paper.", "Use cola para colar o papel."],
          ["Be careful with scissors.", "Cuidado com a tesoura."],
        ],
        speak: ["Pass me the crayons, please", "Me passa os gizes de cera, por favor"],
        order: ["I need the scissors", "Eu preciso da tesoura"],
      },
      {
        title: "Misturando cores",
        words: [
          ["Mix colors", "Misturar cores", "🎨"],
          ["Turquoise", "Turquesa", "🎨"],
          ["Beige", "Bege", "🎨"],
          ["Gold", "Dourado", "✨"],
          ["Silver", "Prateado", "🥈"],
        ],
        story: [
          ["Red and blue make purple.", "Vermelho e azul fazem roxo."],
          ["The crown is gold.", "A coroa é dourada."],
          ["The spoon is silver.", "A colher é prateada."],
        ],
        speak: ["I mix colors", "Eu misturo cores"],
        order: ["The star is gold", "A estrela é dourada"],
      },
      {
        title: "Tipos de arte",
        words: [
          ["Painting", "Pintura", "🖼️"],
          ["Drawing", "Desenho", "✏️"],
          ["Sculpture", "Escultura", "🗿"],
          ["Collage", "Colagem", "✂️"],
          ["Clay", "Massinha de modelar", "🧱"],
        ],
        story: [
          ["I make a sculpture with clay.", "Eu faço uma escultura com massinha de modelar."],
          ["My drawing is on the wall.", "Meu desenho está na parede."],
          ["We make a collage with paper.", "Nós fazemos uma colagem com papel."],
        ],
        speak: ["Look at my painting!", "Olha a minha pintura!"],
        order: ["I love my drawing", "Eu amo meu desenho"],
      },
      {
        title: "Desenhando",
        words: [
          ["Line", "Linha", "✏️"],
          ["Outline", "Contorno", "✏️"],
          ["Sketch", "Rascunho", "📝"],
          ["Eraser", "Borracha", "🧽"],
          ["Color in", "Colorir", "🖍️"],
        ],
        story: [
          ["First, I draw a sketch.", "Primeiro, eu faço um rascunho."],
          ["I use an eraser to fix it.", "Eu uso uma borracha para consertar."],
          ["Now I color in the picture.", "Agora eu coloro o desenho."],
        ],
        speak: ["I draw a straight line", "Eu desenho uma linha reta"],
        order: ["I color in the flower", "Eu coloro a flor"],
      },
      {
        title: "No museu",
        words: [
          ["Museum", "Museu", "🏛️"],
          ["Masterpiece", "Obra-prima", "🌟"],
          ["Portrait", "Retrato", "🖼️"],
          ["Gallery", "Galeria", "🏛️"],
          ["Frame", "Moldura", "🖼️"],
        ],
        story: [
          ["We visit the art museum.", "Nós visitamos o museu de arte."],
          ["The portrait has a gold frame.", "O retrato tem uma moldura dourada."],
          ["This painting is a masterpiece.", "Esta pintura é uma obra-prima."],
        ],
        speak: ["I want to be an artist", "Eu quero ser artista"],
        order: ["The portrait is beautiful", "O retrato é lindo"],
      },
    ],
  },
];

/** 5 perguntas, alternando inglês → português e português → inglês */
function quizFor(words: WordEntry[], seed: number): QuizEntry[] {
  return words.map(([en, pt], i) => {
    const askMeaning = i % 2 === 0;
    const others = words.filter((_, j) => j !== i).map(([oEn, oPt]) => (askMeaning ? oPt : oEn));
    const distractors = [...others.slice(i % others.length), ...others.slice(0, i % others.length)].slice(0, 3);
    const correctIndex = (i + seed) % 4;
    const options = [...distractors];
    options.splice(correctIndex, 0, askMeaning ? pt : en);
    return [askMeaning ? `${en} significa:` : `Como dizemos "${pt}" em inglês?`, options, correctIndex];
  });
}

export function buildHyperfocusContent(firstChapterOrder: number, firstGlobalOrder: number) {
  const modules = FOCUS_CHAPTERS.map((chapter, c) => {
    const theme = getHyperfocusTheme(chapter.theme)!;
    return {
      slug: focusModuleSlug(chapter.theme),
      title: `Tema extra: ${chapter.title}`,
      description: chapter.description,
      icon: theme.icon,
      order: firstChapterOrder + c,
      requiredLevel: FOCUS_REQUIRED_LEVEL,
      xpReward: 150,
    };
  });

  let globalOrder = firstGlobalOrder;
  const specs: LessonSpec[] = FOCUS_CHAPTERS.flatMap((chapter, c) =>
    chapter.lessons.map((lesson, l): LessonSpec => {
      const en = lesson.words.map(([word]) => word);
      const tokens = lesson.order[0].split(" ");
      return {
        moduleSlug: modules[c].slug,
        chapterTitle: modules[c].title,
        lessonNum: l + 1,
        globalOrder: globalOrder++,
        slug: `${modules[c].slug}-l${l + 1}`,
        title: `Lição ${l + 1}: ${lesson.title}`,
        description: `${lesson.title}: ${en.join(", ")}`,
        icon: modules[c].icon,
        objective: `Hoje você vai aprender ${en.slice(0, 3).join(", ")} e mais algumas palavras.`,
        learn: en,
        words: lesson.words,
        story: lesson.story,
        speak: { phrase: lesson.speak[0], translation: lesson.speak[1], tip: SPEAK_TIP },
        wordOrder: { ptLabel: lesson.order[1], words: [...tokens].reverse(), correct: lesson.order[0] },
        quiz: quizFor(lesson.words, c + l),
        games: GAME_PAIRS[(c + l) % GAME_PAIRS.length],
        xpReward: 55 + l * 5,
      };
    })
  );

  return { modules, specs };
}
