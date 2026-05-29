# SpeakUp English

Plataforma educacional de inglês para crianças — **Next.js full-stack** (App Router + API Routes), MongoDB, JWT com refresh tokens, design infantil premium e foco em acessibilidade.

## Stack


| Camada   | Tecnologias                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------- |
| Frontend | Next.js 16, React 19, TypeScript 6, Tailwind CSS 4, Shadcn/UI, Framer Motion 12, Zustand, React Query, Lucide |
| Backend  | Next.js API Routes (`/src/app/api`)                                                                           |
| Banco    | MongoDB + Mongoose                                                                                            |
| Auth     | JWT (access + refresh), bcryptjs, cookies httpOnly                                                            |


## Estrutura

```
src/
├── app/                 # Rotas App Router + API
│   ├── api/auth/        # Endpoints de autenticação
│   ├── (auth)/          # Login, cadastro, recuperação
│   └── (dashboard)/     # Painel autenticado
├── components/          # UI reutilizável
├── features/            # Fluxos por domínio
├── hooks/
├── services/            # Cliente HTTP (fetch)
├── store/               # Zustand (auth, tema/a11y)
├── lib/                 # MongoDB, JWT, utils
├── modules/             # Backend (MVC)
│   ├── controllers/
│   ├── services/
│   ├── repositories/models/
│   ├── middlewares/
│   └── utils/
├── context/
├── styles/
└── types/
```

## Começar

### 1. Variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha `MONGODB_URI`, `JWT_ACCESS_SECRET` e `JWT_REFRESH_SECRET`.

### 2. Instalar e rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### 3. MongoDB local (opcional)

```bash
docker run -d -p 27017:27017 --name speakup-mongo mongo:7
```

## API de autenticação


| Método | Rota                        | Descrição                      |
| ------ | --------------------------- | ------------------------------ |
| POST   | `/api/auth/register`        | Cadastro responsável           |
| POST   | `/api/auth/login/parent`    | Login responsável              |
| POST   | `/api/auth/login/child`     | Login criança (username + PIN) |
| POST   | `/api/auth/refresh`         | Renovar access token           |
| POST   | `/api/auth/logout`          | Encerrar sessão                |
| GET    | `/api/auth/me`              | Usuário atual                  |
| POST   | `/api/auth/forgot-password` | Solicitar reset                |
| POST   | `/api/auth/reset-password`  | Redefinir senha                |


## Modelos MongoDB

- **User** — conta base (parent | child)
- **Parent** — perfil do responsável
- **ChildProfile** — perfil infantil + PIN
- **AccessibilitySettings** — preferências a11y
- **Progress** — progresso por lição
- **Streak** — sequência de dias
- **RefreshToken** — sessões refresh

## Acessibilidade

- Reduzir animações (`prefers-reduced-motion` + toggle)
- Alto contraste
- Fonte Atkinson Hyperlegible
- Modo baixo estímulo
- Skip link, foco visível, contraste nas cores da marca

## Deploy

### Vercel (frontend + API)

1. Conecte o repositório à Vercel (root: `frontend/`).
2. Configure as variáveis de `.env.example` no painel.
3. Use **MongoDB Atlas** para `MONGODB_URI`.
4. `NEXT_PUBLIC_APP_URL` = URL de produção.

### MongoDB

- [MongoDB Atlas](https://www.mongodb.com/atlas) ou Railway MongoDB plugin.

> Conexão Mongoose usa cache global — otimizado para serverless (cold starts).

## Requisitos

- **Node.js 20.9+** (obrigatório para Next.js 16)
- MongoDB 6+

## Scripts

```bash
npm run dev      # Desenvolvimento (Turbopack por padrão no Next 16)
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # ESLint (Next 16 removeu `next lint`)
```

## Next.js 16

- `middleware.ts` foi renomeado para `**proxy.ts**` (export `proxy`)
- Turbopack é o bundler padrão em dev e build
- Tailwind CSS **v4** via `@tailwindcss/postcss`

## Próximos passos sugeridos

- CRUD de perfis infantis no dashboard (pai)
- Integração de e-mail (Resend) no forgot-password
- Módulo de lições e tracking de Progress/Streak
- API de AccessibilitySettings por usuário

## Licença

Projeto privado — SpeakUp English © 2026