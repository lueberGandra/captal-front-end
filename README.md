# Frontend Architecture - Real Estate Project Platform (Captal)

## 📝 Introdução

O frontend do Captal é uma aplicação web moderna desenvolvida em **React** + **TypeScript**, focada em proporcionar uma experiência fluida para desenvolvedores e administradores de projetos imobiliários. A interface permite cadastro, acompanhamento, aprovação e rejeição de projetos, integrando-se à API backend via HTTP.

---

## 🏛️ Arquitetura MVVM

O projeto adota a arquitetura **MVVM (Model-View-ViewModel)**, que separa claramente a lógica de apresentação (View), a lógica de negócio e estado (ViewModel) e os modelos de dados (Model).  
**Benefícios do MVVM:**
- Facilita a manutenção e escalabilidade do código.
- Permite maior reutilização de lógica de negócio.
- Torna a interface mais desacoplada da lógica, facilitando mudanças visuais sem impactar regras de negócio.
- Melhora a testabilidade e organização do projeto.

---

## ⚙️ Tecnologias

| Ferramenta         | Finalidade                        |
|--------------------|-----------------------------------|
| React              | Biblioteca principal de UI         |
| TypeScript         | Tipagem estática                   |
| Vite               | Bundler e dev server               |
| TailwindCSS        | Estilização utilitária             |
| React Hook Form    | Gerenciamento de formulários       |
| Zod                | Validação de schemas               |
| Axios              | Requisições HTTP                   |
| Lucide React       | Ícones SVG modernos                |
| ESLint             | Linting de código                  |

---

## 🗂️ Estrutura de Pastas

```
src/
├── assets/         # Imagens e SVGs
├── components/     # Componentes reutilizáveis de UI
│   └── ui/         # Subconjunto de componentes de design system
├── contexts/       # Contextos globais (ex: autenticação)
├── lib/            # Bibliotecas utilitárias
├── models/         # Modelos de dados e DTOs
├── pages/          # Páginas principais (rotas)
├── services/       # Serviços de API e utilidades
├── types/          # Tipos e enums globais
├── utils/          # Funções utilitárias
├── viewmodels/     # Hooks de estado e lógica de negócio (MVVM)
└── index.css       # Estilos globais
```

---

## 🧩 Principais Módulos

### 1. **Autenticação**
- Fluxo de login, cadastro, confirmação de e-mail e recuperação de senha.
- Integração com AWS Cognito via backend.

### 2. **Gestão de Projetos**
- Listagem, criação e visualização de projetos.
- Aprovação/rejeição (admin) e acompanhamento (developer).

### 3. **Dashboard**
- Resumo de projetos por status, receita esperada e estatísticas.

### 4. **Componentização**
- Componentes reutilizáveis para formulários, cards, tabelas e layout.

---

## 🚦 Scripts

| Comando         | Descrição                        |
|-----------------|----------------------------------|
| `npm run dev`   | Inicia o servidor de desenvolvimento (Vite) |
| `npm run build` | Gera build de produção           |
| `npm run preview` | Visualiza build localmente      |
| `npm run lint`  | Executa o linter (ESLint)        |

---

## 🏁 Como rodar localmente

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acesse:**  
   Abra [http://localhost:5173](http://localhost:5173) no navegador.

---

## 🔗 Integração com Backend

- O frontend consome a API do backend Captal (NestJS/AWS Lambda).
- URLs e tokens são configurados via variáveis de ambiente (exemplo: `.env`).

---

## 📚 Observações

- O projeto utiliza aliases de importação (`@/`) configurados no `tsconfig.json`.
- Estilização baseada em TailwindCSS para agilidade e consistência visual.
- Documentação de API disponível via Swagger no backend.

---

Se precisar de exemplos de uso, detalhes de componentes ou instruções avançadas, é só pedir! 
