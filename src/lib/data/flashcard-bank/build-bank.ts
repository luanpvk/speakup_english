import type { FlashcardBankEntry } from "./types";

/** [english, portuguese, emoji?, example?] */
type Tuple = [string, string, string?, string?];

function pack(category: string, items: Tuple[], idPrefix: string): FlashcardBankEntry[] {
  return items.map(([word, translation, emoji, example], i) => ({
    id: `${idPrefix}-${i}`,
    word,
    translation,
    emoji,
    example,
    category,
  }));
}

const GREETINGS: Tuple[] = [
  ["Hello", "Olá", "👋", "Hello, friend!"],
  ["Hi", "Oi", "😊"],
  ["Good morning", "Bom dia", "🌅", "Good morning, teacher!"],
  ["Good afternoon", "Boa tarde", "☀️"],
  ["Good evening", "Boa noite", "🌆"],
  ["Good night", "Boa noite", "🌙", "Good night, mom!"],
  ["Goodbye", "Adeus", "🖐️"],
  ["Bye", "Tchau", "✌️"],
  ["See you", "Até logo", "👋"],
  ["See you later", "Até mais tarde"],
  ["Please", "Por favor", "🙏", "Water, please."],
  ["Thank you", "Obrigado", "🙏"],
  ["Thanks", "Valeu"],
  ["You're welcome", "De nada"],
  ["Sorry", "Desculpa", "😔"],
  ["Excuse me", "Com licença"],
  ["Yes", "Sim", "✅"],
  ["No", "Não", "❌"],
  ["Maybe", "Talvez"],
  ["OK", "OK", "👍"],
];

const PHRASES: Tuple[] = [
  ["How are you?", "Como vai?", "💬"],
  ["I'm fine", "Estou bem", "😊"],
  ["What's your name?", "Qual é o seu nome?"],
  ["My name is...", "Meu nome é..."],
  ["Nice to meet you", "Prazer em conhecer você"],
  ["How old are you?", "Quantos anos você tem?"],
  ["I am years old", "Eu tenho anos"],
  ["Where are you from?", "De onde você é?"],
  ["I am from Brazil", "Eu sou do Brasil", "🇧🇷"],
  ["I like English", "Eu gosto de inglês"],
  ["I love my family", "Eu amo minha família", "❤️"],
  ["Can you help me?", "Você pode me ajudar?"],
  ["I don't understand", "Eu não entendo"],
  ["Can you repeat?", "Pode repetir?"],
  ["Speak slowly, please", "Fale devagar, por favor"],
  ["What does it mean?", "O que significa?"],
  ["I am hungry", "Estou com fome", "🍽️"],
  ["I am thirsty", "Estou com sede", "💧"],
  ["I am tired", "Estou cansado", "😴"],
  ["I am happy", "Estou feliz", "😄"],
  ["I am sad", "Estou triste", "😢"],
  ["Let's go", "Vamos lá", "🚀"],
  ["Wait a minute", "Espere um minuto"],
  ["Come here", "Venha aqui"],
  ["Look at this", "Olhe isso", "👀"],
  ["Listen to me", "Me escute", "👂"],
  ["Be quiet", "Fique quieto", "🤫"],
  ["Sit down", "Sente-se"],
  ["Stand up", "Levante-se"],
  ["Open the door", "Abra a porta", "🚪"],
  ["Close the window", "Feche a janela", "🪟"],
  ["I need help", "Preciso de ajuda"],
  ["It's time to eat", "Hora de comer"],
  ["It's time to sleep", "Hora de dormir", "🛏️"],
  ["Happy birthday!", "Feliz aniversário!", "🎂"],
  ["Merry Christmas!", "Feliz Natal!", "🎄"],
  ["Happy New Year!", "Feliz Ano Novo!", "🎉"],
  ["Good luck!", "Boa sorte!", "🍀"],
  ["Have fun!", "Divirta-se!"],
  ["See you tomorrow", "Até amanhã"],
  ["What time is it?", "Que horas são?", "🕐"],
  ["I am ready", "Estou pronto"],
  ["I am late", "Estou atrasado"],
  ["Where is the bathroom?", "Onde fica o banheiro?"],
  ["I lost my pencil", "Perdi meu lápis"],
  ["Can I go out?", "Posso sair?"],
  ["I finished my homework", "Terminei a lição de casa"],
  ["What is this?", "O que é isso?"],
  ["Who is that?", "Quem é aquele?"],
  ["When is the test?", "Quando é a prova?"],
  ["Why are you sad?", "Por que você está triste?"],
  ["How do you say...?", "Como se diz...?"],
  ["I want to learn", "Eu quero aprender", "📚"],
  ["Practice makes perfect", "A prática leva à perfeição"],
  ["Don't give up", "Não desista", "💪"],
  ["You can do it", "Você consegue"],
  ["Well done!", "Muito bem!", "⭐"],
  ["Try again", "Tente de novo"],
  ["One more time", "Mais uma vez"],
  ["I agree", "Eu concordo"],
  ["I disagree", "Eu discordo"],
  ["That's correct", "Está correto", "✅"],
  ["That's wrong", "Está errado"],
  ["I think so", "Acho que sim"],
  ["I don't know", "Eu não sei", "🤷"],
  ["Let me think", "Deixe-me pensar", "🤔"],
  ["It doesn't matter", "Não importa"],
  ["No problem", "Sem problema"],
  ["Of course", "Claro"],
  ["Not yet", "Ainda não"],
  ["Already", "Já"],
  ["Never", "Nunca"],
  ["Always", "Sempre"],
  ["Sometimes", "Às vezes"],
  ["Today", "Hoje"],
  ["Tomorrow", "Amanhã"],
  ["Yesterday", "Ontem"],
  ["Right now", "Agora mesmo"],
  ["In the morning", "De manhã"],
  ["In the afternoon", "À tarde"],
  ["At night", "À noite"],
  ["On Monday", "Na segunda-feira"],
  ["On the weekend", "No fim de semana"],
  ["This is my book", "Este é meu livro", "📖"],
  ["That is your bag", "Essa é sua mochila", "🎒"],
  ["These are my friends", "Estes são meus amigos"],
  ["Those are birds", "Aqueles são pássaros", "🐦"],
  ["I have a pet", "Eu tenho um bicho de estimação"],
  ["Do you like pizza?", "Você gosta de pizza?", "🍕"],
  ["I want some water", "Eu quero um pouco de água"],
  ["May I play?", "Posso brincar?"],
  ["It's raining", "Está chovendo", "🌧️"],
  ["It's sunny", "Está ensolarado", "☀️"],
  ["It's cold", "Está frio", "🥶"],
  ["It's hot", "Está quente", "🥵"],
  ["I feel sick", "Estou doente", "🤒"],
  ["I feel better", "Estou melhor"],
  ["Wash your hands", "Lave as mãos", "🧼"],
  ["Brush your teeth", "Escove os dentes", "🪥"],
  ["Get dressed", "Vista-se"],
  ["Put on your shoes", "Calce seus sapatos", "👟"],
  ["Take off your coat", "Tire seu casaco", "🧥"],
  ["Line up, please", "Façam fila, por favor"],
  ["Raise your hand", "Levante a mão", "✋"],
  ["Pay attention", "Preste atenção"],
  ["Work in pairs", "Trabalhem em duplas"],
  ["Read aloud", "Leia em voz alta"],
  ["Write your name", "Escreva seu nome"],
  ["Draw a picture", "Desenhe um desenho", "🎨"],
  ["Color the picture", "Pinte o desenho"],
  ["Cut and paste", "Recorte e cole", "✂️"],
  ["Turn the page", "Vire a página"],
  ["Pack your bag", "Arrume sua mochila"],
  ["Don't run in the hall", "Não corra no corredor"],
  ["Share with your friend", "Compartilhe com seu amigo"],
  ["Say please and thank you", "Diga por favor e obrigado"],
];

const ANIMALS: Tuple[] = [
  ["cat", "gato", "🐱"], ["dog", "cachorro", "🐶"], ["bird", "pássaro", "🐦"],
  ["fish", "peixe", "🐟"], ["cow", "vaca", "🐄"], ["pig", "porco", "🐷"],
  ["horse", "cavalo", "🐴"], ["sheep", "ovelha", "🐑"], ["goat", "cabra", "🐐"],
  ["chicken", "galinha", "🐔"], ["duck", "pato", "🦆"], ["rabbit", "coelho", "🐰"],
  ["mouse", "rato", "🐭"], ["hamster", "hamster", "🐹"], ["turtle", "tartaruga", "🐢"],
  ["frog", "sapo", "🐸"], ["snake", "cobra", "🐍"], ["lion", "leão", "🦁"],
  ["tiger", "tigre", "🐯"], ["bear", "urso", "🐻"], ["elephant", "elefante", "🐘"],
  ["monkey", "macaco", "🐵"], ["giraffe", "girafa", "🦒"], ["zebra", "zebra", "🦓"],
  ["panda", "panda", "🐼"], ["koala", "coala", "🐨"], ["kangaroo", "canguru", "🦘"],
  ["whale", "baleia", "🐋"], ["dolphin", "golfinho", "🐬"], ["shark", "tubarão", "🦈"],
  ["octopus", "polvo", "🐙"], ["crab", "caranguejo", "🦀"], ["butterfly", "borboleta", "🦋"],
  ["bee", "abelha", "🐝"], ["ant", "formiga", "🐜"], ["spider", "aranha", "🕷️"],
  ["owl", "coruja", "🦉"], ["eagle", "águia", "🦅"], ["parrot", "papagaio", "🦜"],
  ["penguin", "pinguim", "🐧"], ["fox", "raposa", "🦊"], ["wolf", "lobo", "🐺"],
  ["deer", "veado", "🦌"], ["hippo", "hipopótamo", "🦛"], ["rhino", "rinoceronte", "🦏"],
  ["camel", "camelo", "🐫"], ["bat", "morcego", "🦇"], ["snail", "caracol", "🐌"],
];

const FOOD: Tuple[] = [
  ["apple", "maçã", "🍎"], ["banana", "banana", "🍌"], ["orange", "laranja", "🍊"],
  ["grape", "uva", "🍇"], ["strawberry", "morango", "🍓"], ["watermelon", "melancia", "🍉"],
  ["pineapple", "abacaxi", "🍍"], ["mango", "manga", "🥭"], ["peach", "pêssego", "🍑"],
  ["pear", "pera", "🍐"], ["cherry", "cereja", "🍒"], ["lemon", "limão", "🍋"],
  ["carrot", "cenoura", "🥕"], ["tomato", "tomate", "🍅"], ["potato", "batata", "🥔"],
  ["onion", "cebola", "🧅"], ["corn", "milho", "🌽"], ["broccoli", "brócolis", "🥦"],
  ["lettuce", "alface", "🥬"], ["cucumber", "pepino", "🥒"], ["pepper", "pimentão", "🫑"],
  ["bread", "pão", "🍞"], ["rice", "arroz", "🍚"], ["pasta", "macarrão", "🍝"],
  ["pizza", "pizza", "🍕"], ["burger", "hambúrguer", "🍔"], ["hot dog", "cachorro-quente", "🌭"],
  ["sandwich", "sanduíche", "🥪"], ["cheese", "queijo", "🧀"], ["egg", "ovo", "🥚"],
  ["milk", "leite", "🥛"], ["water", "água", "💧"], ["juice", "suco", "🧃"],
  ["soda", "refrigerante", "🥤"], ["coffee", "café", "☕"], ["tea", "chá", "🍵"],
  ["cake", "bolo", "🎂"], ["cookie", "biscoito", "🍪"], ["chocolate", "chocolate", "🍫"],
  ["ice cream", "sorvete", "🍦"], ["candy", "doce", "🍬"], ["soup", "sopa", "🍲"],
  ["salad", "salada", "🥗"], ["meat", "carne", "🥩"], ["fish food", "peixe", "🐟"],
  ["chicken food", "frango", "🍗"], ["fries", "batata frita", "🍟"], ["popcorn", "pipoca", "🍿"],
  ["honey", "mel", "🍯"], ["salt", "sal", "🧂"], ["sugar", "açúcar"],
  ["breakfast", "café da manhã"], ["lunch", "almoço"], ["dinner", "jantar"],
  ["snack", "lanche"], ["breakfast cereal", "cereal", "🥣"],
];

const FAMILY: Tuple[] = [
  ["mother", "mãe", "👩"], ["father", "pai", "👨"], ["mom", "mamãe"],
  ["dad", "papai"], ["parents", "pais"], ["baby", "bebê", "👶"],
  ["boy", "menino", "👦"], ["girl", "menina", "👧"], ["brother", "irmão"],
  ["sister", "irmã"], ["family", "família", "👨‍👩‍👧"], ["grandmother", "avó", "👵"],
  ["grandfather", "avô", "👴"], ["uncle", "tio"], ["aunt", "tia"],
  ["cousin", "primo"], ["son", "filho"], ["daughter", "filha"],
  ["husband", "marido"], ["wife", "esposa"], ["friend", "amigo", "🤝"],
  ["best friend", "melhor amigo"], ["neighbor", "vizinho"], ["classmate", "colega de classe"],
  ["teacher", "professor", "👩‍🏫"], ["student", "estudante"], ["baby sister", "irmãzinha"],
];

const SCHOOL: Tuple[] = [
  ["school", "escola", "🏫"], ["classroom", "sala de aula"], ["desk", "carteira"],
  ["chair", "cadeira", "🪑"], ["book", "livro", "📖"], ["notebook", "caderno", "📓"],
  ["pencil", "lápis", "✏️"], ["pen", "caneta", "🖊️"], ["eraser", "borracha"],
  ["ruler", "régua", "📏"], ["scissors", "tesoura", "✂️"], ["glue", "cola"],
  ["paper", "papel", "📄"], ["backpack", "mochila", "🎒"], ["homework", "lição de casa"],
  ["test", "prova"], ["lesson", "lição"], ["subject", "matéria"],
  ["math", "matemática", "➕"], ["science", "ciências", "🔬"], ["history", "história"],
  ["geography", "geografia", "🌍"], ["art", "arte", "🎨"], ["music", "música", "🎵"],
  ["PE", "educação física", "⚽"], ["English", "inglês", "🇬🇧"], ["Portuguese", "português", "🇧🇷"],
  ["question", "pergunta", "❓"], ["answer", "resposta"], ["dictionary", "dicionário", "📕"],
  ["computer", "computador", "💻"], ["tablet", "tablet"], ["board", "quadro", "🖊️"],
  ["marker", "marcador"], ["crayon", "giz de cera"], ["paint", "tinta"],
  ["library", "biblioteca", "📚"], ["playground", "parquinho", "🛝"],
  ["recess", "intervalo"], ["principal", "diretor"], ["grade", "nota"],
  ["pass", "passar"], ["fail", "reprovar"], ["study", "estudar", "📖"],
  ["learn", "aprender"], ["teach", "ensinar"], ["read", "ler"],
  ["write", "escrever"], ["spell", "soletrar"], ["count", "contar"],
  ["calculate", "calcular"], ["draw", "desenhar"], ["circle", "círculo"],
  ["square", "quadrado"], ["triangle", "triângulo"], ["line", "linha"],
];

const COLORS: Tuple[] = [
  ["red", "vermelho", "🔴"], ["blue", "azul", "🔵"], ["green", "verde", "🟢"],
  ["yellow", "amarelo", "🟡"], ["orange", "laranja", "🟠"], ["purple", "roxo", "🟣"],
  ["pink", "rosa", "🩷"], ["brown", "marrom", "🟤"], ["black", "preto", "⚫"],
  ["white", "branco", "⚪"], ["gray", "cinza"], ["gold", "dourado", "✨"],
  ["silver", "prateado"], ["light blue", "azul claro"], ["dark green", "verde escuro"],
];

const VERBS: Tuple[] = [
  ["run", "correr", "🏃"], ["walk", "andar", "🚶"], ["jump", "pular", "🦘"],
  ["swim", "nadar", "🏊"], ["fly", "voar", "✈️"], ["climb", "escalar"],
  ["sit", "sentar"], ["stand", "ficar em pé"], ["sleep", "dormir", "😴"],
  ["wake up", "acordar", "⏰"], ["eat", "comer", "🍽️"], ["drink", "beber"],
  ["cook", "cozinhar", "👨‍🍳"], ["play", "brincar", "🎮"], ["sing", "cantar", "🎤"],
  ["dance", "dançar", "💃"], ["draw", "desenhar"], ["paint", "pintar"],
  ["read", "ler", "📖"], ["write", "escrever", "✍️"], ["speak", "falar", "🗣️"],
  ["listen", "ouvir", "👂"], ["watch", "assistir", "📺"], ["see", "ver", "👀"],
  ["look", "olhar"], ["hear", "ouvir"], ["smell", "cheirar", "👃"],
  ["touch", "tocar", "✋"], ["think", "pensar", "🤔"], ["know", "saber"],
  ["learn", "aprender"], ["teach", "ensinar"], ["study", "estudar"],
  ["work", "trabalhar"], ["help", "ajudar"], ["ask", "perguntar"],
  ["answer", "responder"], ["tell", "contar"], ["say", "dizer"],
  ["call", "chamar", "📞"], ["open", "abrir"], ["close", "fechar"],
  ["push", "empurrar"], ["pull", "puxar"], ["throw", "jogar", "⚾"],
  ["catch", "pegar"], ["kick", "chutar", "⚽"], ["hit", "bater"],
  ["break", "quebrar"], ["fix", "consertar"], ["build", "construir"],
  ["clean", "limpar", "🧹"], ["wash", "lavar"], ["dry", "secar"],
  ["cut", "cortar"], ["carry", "carregar"], ["hold", "segurar"],
  ["give", "dar"], ["take", "pegar"], ["bring", "trazer"], ["buy", "comprar", "🛒"],
  ["sell", "vender"], ["pay", "pagar"], ["find", "encontrar"], ["lose", "perder"],
  ["win", "ganhar", "🏆"], ["start", "começar"], ["finish", "terminar"],
  ["stop", "parar"], ["wait", "esperar"], ["hurry", "apressar"],
  ["come", "vir"], ["go", "ir"], ["leave", "sair"], ["arrive", "chegar"],
  ["travel", "viajar", "✈️"], ["visit", "visitar"], ["live", "morar"],
  ["stay", "ficar"], ["move", "mover"], ["change", "mudar"],
  ["grow", "crescer", "🌱"], ["plant", "plantar"], ["water plants", "regar plantas", "💧"],
  ["love", "amar", "❤️"], ["like", "gostar", "👍"], ["hate", "odiar"],
  ["want", "querer"], ["need", "precisar"], ["have", "ter"],
  ["make", "fazer"], ["do", "fazer"], ["use", "usar"],
  ["try", "tentar"], ["can", "poder"], ["must", "dever"],
  ["should", "deveria"], ["will", "vai"], ["feel", "sentir"],
  ["hurt", "doer"], ["laugh", "rir", "😂"], ["cry", "chorar", "😢"],
  ["smile", "sorrir", "😊"], ["shout", "gritar"], ["whisper", "sussurrar"],
];

const PLACES: Tuple[] = [
  ["house", "casa", "🏠"], ["home", "lar"], ["room", "quarto", "🛏️"],
  ["kitchen", "cozinha", "🍳"], ["bathroom", "banheiro", "🚿"], ["bedroom", "quarto"],
  ["living room", "sala"], ["garden", "jardim", "🌻"], ["yard", "quintal"],
  ["street", "rua"], ["city", "cidade", "🏙️"], ["town", "cidade pequena"],
  ["country", "país"], ["world", "mundo", "🌍"], ["park", "parque", "🌳"],
  ["store", "loja", "🏪"], ["supermarket", "supermercado", "🛒"],
  ["market", "feira"], ["restaurant", "restaurante", "🍽️"],
  ["hospital", "hospital", "🏥"], ["pharmacy", "farmácia", "💊"],
  ["bank", "banco", "🏦"], ["post office", "correios", "📮"],
  ["library", "biblioteca", "📚"], ["museum", "museu", "🏛️"],
  ["zoo", "zoológico", "🦁"], ["beach", "praia", "🏖️"], ["sea", "mar", "🌊"],
  ["ocean", "oceano"], ["river", "rio"], ["lake", "lago"], ["mountain", "montanha", "⛰️"],
  ["forest", "floresta", "🌲"], ["farm", "fazenda", "🚜"], ["airport", "aeroporto", "✈️"],
  ["station", "estação", "🚉"], ["bus stop", "ponto de ônibus", "🚌"],
  ["school", "escola", "🏫"], ["office", "escritório", "🏢"],
  ["factory", "fábrica"], ["church", "igreja"], ["stadium", "estádio", "🏟️"],
  ["pool", "piscina", "🏊"], ["gym", "academia", "🏋️"],
];

const BODY: Tuple[] = [
  ["head", "cabeça"], ["hair", "cabelo", "💇"], ["face", "rosto"],
  ["eye", "olho", "👁️"], ["eyes", "olhos"], ["ear", "orelha", "👂"],
  ["nose", "nariz", "👃"], ["mouth", "boca", "👄"], ["tooth", "dente", "🦷"],
  ["teeth", "dentes"], ["tongue", "língua"], ["neck", "pescoço"],
  ["shoulder", "ombro"], ["arm", "braço", "💪"], ["hand", "mão", "✋"],
  ["finger", "dedo"], ["leg", "perna", "🦵"], ["knee", "joelho"],
  ["foot", "pé", "🦶"], ["toe", "dedo do pé"], ["back", "costas"],
  ["stomach", "barriga"], ["heart", "coração", "❤️"], ["brain", "cérebro", "🧠"],
  ["bone", "osso"], ["skin", "pele"], ["body", "corpo"],
];

const CLOTHES: Tuple[] = [
  ["shirt", "camisa", "👕"], ["T-shirt", "camiseta"], ["pants", "calça", "👖"],
  ["shorts", "shorts"], ["dress", "vestido", "👗"], ["skirt", "saia"],
  ["coat", "casaco", "🧥"], ["jacket", "jaqueta"], ["sweater", "suéter"],
  ["hat", "chapéu", "🎩"], ["cap", "boné", "🧢"], ["shoes", "sapatos", "👟"],
  ["socks", "meias", "🧦"], ["boots", "botas", "🥾"], ["sandals", "sandálias"],
  ["glasses", "óculos", "👓"], ["sunglasses", "óculos de sol", "🕶️"],
  ["watch", "relógio", "⌚"], ["ring", "anel", "💍"], ["bag", "bolsa", "👜"],
  ["umbrella", "guarda-chuva", "☂️"], ["pajamas", "pijama"],
];

const WEATHER: Tuple[] = [
  ["sun", "sol", "☀️"], ["moon", "lua", "🌙"], ["star", "estrela", "⭐"],
  ["cloud", "nuvem", "☁️"], ["rain", "chuva", "🌧️"], ["snow", "neve", "❄️"],
  ["wind", "vento", "💨"], ["storm", "tempestade", "⛈️"], ["lightning", "raio", "⚡"],
  ["rainbow", "arco-íris", "🌈"], ["hot weather", "calor"], ["cold weather", "frio"],
  ["warm", "morno"], ["cool", "fresco"], ["fog", "neblina", "🌫️"],
];

const HOUSEHOLD: Tuple[] = [
  ["table", "mesa"], ["bed", "cama", "🛏️"], ["sofa", "sofá", "🛋️"],
  ["lamp", "lâmpada", "💡"], ["TV", "TV", "📺"], ["phone", "telefone", "📱"],
  ["clock", "relógio", "🕐"], ["door", "porta", "🚪"], ["window", "janela", "🪟"],
  ["key", "chave", "🔑"], ["box", "caixa", "📦"], ["toy", "brinquedo", "🧸"],
  ["ball", "bola", "⚽"], ["doll", "boneca"], ["car toy", "carrinho", "🚗"],
  ["bike", "bicicleta", "🚲"], ["game", "jogo", "🎮"], ["puzzle", "quebra-cabeça", "🧩"],
];

const ADJECTIVES: Tuple[] = [
  ["big", "grande"], ["small", "pequeno"], ["tall", "alto"], ["short", "baixo"],
  ["long", "longo"], ["fast", "rápido"], ["slow", "lento"], ["new", "novo"],
  ["old", "velho"], ["young", "jovem"], ["good", "bom"], ["bad", "ruim"],
  ["happy", "feliz", "😊"], ["sad", "triste", "😢"], ["angry", "bravo", "😠"],
  ["scared", "assustado", "😨"], ["brave", "corajoso"], ["kind", "gentil"],
  ["nice", "legal"], ["funny", "engraçado", "😄"], ["smart", "inteligente", "🧠"],
  ["clever", "esperto"], ["strong", "forte", "💪"], ["weak", "fraco"],
  ["rich", "rico"], ["poor", "pobre"], ["clean", "limpo"], ["dirty", "sujo"],
  ["beautiful", "bonito", "✨"], ["ugly", "feio"], ["easy", "fácil"],
  ["hard", "difícil"], ["loud", "barulhento"], ["quiet", "silencioso", "🤫"],
  ["full", "cheio"], ["empty", "vazio"], ["heavy", "pesado"], ["light", "leve"],
  ["right", "certo"], ["wrong", "errado"], ["same", "igual"], ["different", "diferente"],
  ["first", "primeiro"], ["last", "último"], ["next", "próximo"], ["many", "muitos"],
  ["few", "poucos"], ["some", "alguns"], ["all", "todos"], ["every", "cada"],
  ["other", "outro"], ["favorite", "favorito", "⭐"], ["special", "especial"],
  ["important", "importante"], ["possible", "possível"], ["ready", "pronto"],
  ["busy", "ocupado"], ["free", "livre"], ["safe", "seguro"], ["dangerous", "perigoso"],
];

const PT_NUMBERS = [
  "zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove",
  "dez", "onze", "doze", "treze", "catorze", "quinze", "dezesseis", "dezessete",
  "dezoito", "dezenove", "vinte", "vinte e um", "vinte e dois", "vinte e três",
  "vinte e quatro", "vinte e cinco", "vinte e seis", "vinte e sete", "vinte e oito",
  "vinte e nove", "trinta", "quarenta", "cinquenta", "sessenta", "setenta",
  "oitenta", "noventa", "cem",
];

function buildNumbers(): FlashcardBankEntry[] {
  const entries: FlashcardBankEntry[] = [];
  for (let n = 0; n <= 100; n++) {
    entries.push({
      id: `num-${n}`,
      word: String(n),
      translation: PT_NUMBERS[n] ?? String(n),
      category: "numbers",
      emoji: n <= 10 ? "🔢" : undefined,
    });
  }
  return entries;
}

const ORDINALS: Tuple[] = [
  ["first", "primeiro", "1️⃣"], ["second", "segundo", "2️⃣"], ["third", "terceiro", "3️⃣"],
  ["fourth", "quarto"], ["fifth", "quinto"], ["sixth", "sexto"], ["seventh", "sétimo"],
  ["eighth", "oitavo"], ["ninth", "nono"], ["tenth", "décimo"],
];

const DAYS: Tuple[] = [
  ["Monday", "segunda-feira"], ["Tuesday", "terça-feira"], ["Wednesday", "quarta-feira"],
  ["Thursday", "quinta-feira"], ["Friday", "sexta-feira"], ["Saturday", "sábado"],
  ["Sunday", "domingo"], ["week", "semana"], ["month", "mês"], ["year", "ano"],
];

const MONTHS: Tuple[] = [
  ["January", "janeiro"], ["February", "fevereiro"], ["March", "março"],
  ["April", "abril"], ["May", "maio"], ["June", "junho"],
  ["July", "julho"], ["August", "agosto"], ["September", "setembro"],
  ["October", "outubro"], ["November", "novembro"], ["December", "dezembro"],
];

const SPORTS: Tuple[] = [
  ["soccer", "futebol", "⚽"], ["basketball", "basquete", "🏀"], ["volleyball", "vôlei", "🏐"],
  ["tennis", "tênis", "🎾"], ["baseball", "beisebol", "⚾"], ["swimming sport", "natação", "🏊"],
  ["running", "corrida", "🏃"], ["cycling", "ciclismo", "🚴"], ["skating", "patinação", "⛸️"],
  ["skiing", "esqui", "⛷️"], ["surfing", "surfe", "🏄"], ["gymnastics", "ginástica", "🤸"],
  ["team", "time"], ["player", "jogador"], ["coach", "treinador"], ["game match", "partida"],
  ["score", "placar"], ["goal", "gol"], ["win", "vencer"], ["lose", "perder"],
];

const TRANSPORT: Tuple[] = [
  ["car", "carro", "🚗"], ["bus", "ônibus", "🚌"], ["train", "trem", "🚆"],
  ["subway", "metrô"], ["plane", "avião", "✈️"], ["boat", "barco", "⛵"],
  ["ship", "navio", "🚢"], ["helicopter", "helicóptero", "🚁"], ["taxi", "táxi", "🚕"],
  ["truck", "caminhão", "🚚"], ["motorcycle", "moto", "🏍️"], ["bicycle", "bicicleta", "🚲"],
  ["traffic light", "semáforo", "🚦"], ["road", "estrada"], ["bridge", "ponte", "🌉"],
];

const NATURE: Tuple[] = [
  ["tree", "árvore", "🌳"], ["flower", "flor", "🌸"], ["grass", "grama", "🌿"],
  ["leaf", "folha", "🍃"], ["rock", "pedra", "🪨"], ["sand", "areia", "🏖️"],
  ["earth", "terra", "🌍"], ["sky", "céu"], ["fire", "fogo", "🔥"],
  ["water nature", "água", "💧"], ["ice", "gelo", "🧊"], ["plant", "planta", "🌱"],
  ["seed", "semente"], ["fruit", "fruta"], ["vegetable", "legume", "🥕"],
];

/** Frases com padrão: I like the + noun ("I like car" não é inglês correto) */
function buildLikePhrases(nouns: Tuple[]): FlashcardBankEntry[] {
  return nouns.slice(0, 80).map(([noun, pt, emoji], i) => ({
    id: `like-${i}`,
    word: `I like the ${noun}`,
    translation: `Eu gosto do(a) ${pt}`,
    emoji,
    example: `I like the ${noun}.`,
    category: "phrases-pattern",
  }));
}

/** This is a + noun */
function buildThisIsPhrases(nouns: Tuple[]): FlashcardBankEntry[] {
  return nouns.slice(0, 60).map(([noun, pt, emoji], i) => ({
    id: `this-${i}`,
    word: `This is a ${noun}`,
    translation: `Isto é um/uma ${pt}`,
    emoji,
    category: "phrases-pattern",
  }));
}

/** I have a + noun */
function buildHavePhrases(nouns: Tuple[]): FlashcardBankEntry[] {
  return nouns.slice(0, 60).map(([noun, pt, emoji], i) => ({
    id: `have-${i}`,
    word: `I have a ${noun}`,
    translation: `Eu tenho um/uma ${pt}`,
    emoji,
    category: "phrases-pattern",
  }));
}

/** Where is the + place */
function buildWherePhrases(places: Tuple[]): FlashcardBankEntry[] {
  return places.slice(0, 40).map(([place, pt], i) => ({
    id: `where-${i}`,
    word: `Where is the ${place}?`,
    translation: `Onde fica ${pt}?`,
    category: "phrases-pattern",
  }));
}

export function buildFlashcardBank(): FlashcardBankEntry[] {
  const nounPool = [...ANIMALS, ...FOOD, ...SCHOOL, ...HOUSEHOLD, ...TRANSPORT];

  const all: FlashcardBankEntry[] = [
    ...pack("greetings", GREETINGS, "gr"),
    ...pack("phrases", PHRASES, "ph"),
    ...pack("animals", ANIMALS, "an"),
    ...pack("food", FOOD, "fd"),
    ...pack("family", FAMILY, "fm"),
    ...pack("school", SCHOOL, "sc"),
    ...pack("colors", COLORS, "cl"),
    ...pack("verbs", VERBS, "vb"),
    ...pack("places", PLACES, "pl"),
    ...pack("body", BODY, "bd"),
    ...pack("clothes", CLOTHES, "ct"),
    ...pack("weather", WEATHER, "wt"),
    ...pack("household", HOUSEHOLD, "hh"),
    ...pack("adjectives", ADJECTIVES, "adj"),
    ...buildNumbers(),
    ...pack("ordinals", ORDINALS, "ord"),
    ...pack("days", DAYS, "day"),
    ...pack("months", MONTHS, "mon"),
    ...pack("sports", SPORTS, "sp"),
    ...pack("transport", TRANSPORT, "tr"),
    ...pack("nature", NATURE, "nt"),
    ...buildLikePhrases(nounPool),
    ...buildThisIsPhrases(nounPool),
    ...buildHavePhrases(nounPool),
    ...buildWherePhrases(PLACES),
  ];

  const seen = new Set<string>();
  const unique: FlashcardBankEntry[] = [];
  for (const e of all) {
    const key = e.word.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(e);
  }

  return unique;
}
