# AI-Powered Universal Content Creation Platform (MERN)

A full-stack MERN web application engineered for students, educators, job seekers, content creators, event organizers, and businesses to generate high-impact written copy and visual posters through structured AI workflows.

---

## 🌟 1. Core Concept & Key Innovation

> **User Requirement → Content-Type Selection → Structured Form → AI Multi-Modal Engine → Text and/or Visual Output → Live Edit, Save & Download**

### The Core Principle
Users select **what they want to create**—they do **not** need to identify as a business or organization first.
Instead of requiring complex prompt-engineering paragraphs, the platform guides the user through tailored dynamic forms. The backend synthesizes structured instructions, orchestrates generative AI models for text and visuals, and stores all creation history securely in MongoDB.

---

## 🛠 2. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | High-performance reactive user interface |
| **Styling** | Tailwind CSS v4 | Responsive modern glassmorphism aesthetic |
| **Icons & Visuals** | Lucide React + HTML5 Canvas | Dynamic poster canvas with live themes & PNG export |
| **Routing** | React Router DOM v7 | Single Page Application client-side routing |
| **Backend Runtime** | Node.js v24 | Scalable server-side JavaScript runtime |
| **API Framework** | Express.js | REST endpoints, middleware, and request validation |
| **Database** | MongoDB + Mongoose | User credentials, preferences, creations, & profiles |
| **Authentication** | JWT + bcryptjs | Protected private routes & user ownership enforcement |
| **AI Integration** | Gemini API / Pollinations / Smart Engine | Multi-modal text synthesis & neural image generation |

---

## 📂 3. Project Structure

```
ai-content-platform/
├── package.json               # Root scripts to run both client and server
├── start-dev.js               # Dual-process launcher script
├── .gitignore
├── README.md
├── server/
│   ├── config/
│   │   └── db.js              # MongoDB connection with zero-setup local fallback
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── contentCatalogController.js
│   │   ├── creationController.js
│   │   └── profileController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT verification & user session injection
│   │   └── errorHandler.js    # Standardized JSON error response handler
│   ├── models/
│   │   ├── User.js            # User credentials & global preferences schema
│   │   ├── Creation.js        # Creations, structured inputs, & generated outputs
│   │   └── Profile.js         # Optional organization & brand profile schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── contentCatalogRoutes.js
│   │   ├── creationRoutes.js
│   │   └── profileRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── contentCatalogService.js
│   │   ├── promptBuilder.js   # Section 12 prompt synthesizer
│   │   ├── aiTextService.js   # Text generator (Gemini + Smart Engine)
│   │   ├── aiImageService.js  # Visual generator (Neural image synthesizer)
│   │   ├── creationService.js # Lifecycle orchestration & ownership checks
│   │   └── dataStore.js       # Unified data access layer
│   ├── app.js                 # Express application setup
│   ├── server.js              # Server bootstrapper
│   └── test-api.js            # Automated API contract test suite
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── PosterCanvas.jsx  # Interactive HTML5 Canvas poster renderer
    │   │   └── Toast.jsx         # Toast notifications
    │   ├── context/
    │   │   └── AuthContext.jsx   # Authentication context & persistent tokens
    │   ├── layouts/
    │   │   └── AppLayout.jsx     # Route guarding & responsive container
    │   ├── pages/
    │   │   ├── LandingPage.jsx   # Universal showcase & demo
    │   │   ├── LoginPage.jsx     # Login with 1-click demo filler
    │   │   ├── RegisterPage.jsx  # User registration
    │   │   ├── DashboardPage.jsx # Quick stats, search, & categories
    │   │   ├── CreateCatalogPage.jsx # Category selector & blueprint grid
    │   │   ├── CreateFormPage.jsx    # Dynamic structured input form
    │   │   ├── CreationResultPage.jsx # Live text editor & canvas poster exporter
    │   │   ├── CreationsListPage.jsx  # My Creations library (Grid & List)
    │   │   ├── PreferencesPage.jsx    # Default language, tone, & visual style
    │   │   └── ProfilePage.jsx        # Optional brand kit & organization profile
    │   ├── services/
    │   │   └── api.js            # API client with Bearer auth headers
    │   ├── App.jsx               # React Router navigation tree
    │   └── main.jsx
    └── vite.config.js
```

---

## 🚀 4. How to Run Locally

### Quick Start (Runs both Frontend & Backend concurrently)

```bash
# From the project root (ai-content-platform):
npm run dev
```

- **Frontend Client:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Running Separately

```bash
# Terminal 1: Backend Server
cd server
npm start

# Terminal 2: Frontend Client
cd client
npm run dev
```

### Running Backend API Automated Tests

```bash
cd server
node test-api.js
```

---

## 🎯 5. Supported Content Blueprint Catalog (8 Categories)

1. **Events & Posters**: College hackathons, technical symposiums, sports meets, campus announcements.
2. **Professional & Career**: LinkedIn thought leadership posts, internship milestones, project portfolios.
3. **Invitations & Cards**: Celebratory birthday invites, wedding receptions, farewells, milestone gatherings.
4. **Business & Marketing**: Product launches, festival discount flyers, flash sale promotions.
5. **Content Creator Hub**: High-CTR YouTube thumbnail concepts, video descriptions, timestamps.
6. **Social Media**: Instagram captions, Twitter threads, aesthetic lifestyle posts.
7. **Academic & Workshops**: Bootcamp flyers, masterclasses, research symposiums.
8. **Personal & Motivation**: Daily motivational quote wallpapers, celebratory greetings.

---

## 🔒 6. Security & Ownership Rules

- **Bcrypt Password Hashing**: Plaintext passwords are never stored.
- **JWT Authorization**: Requests to `/api/creations/*` and `/api/profiles/*` require a valid Bearer token.
- **Strict Ownership Verification**: Queries in `creationService.js` strictly verify that `creation.ownerId === req.user._id` before reading, editing, regenerating, or deleting any creation.
- **Key Isolation**: External AI keys live exclusively in server-side `.env` and are never exposed in frontend bundles.

---

## 🎓 7. Project Presentation & Viva Highlights (Section 36)

- **Why Not Just Use ChatGPT?**
  General AI chatbots require typing long prompt instructions every time. Our platform provides guided workflows, dynamic domain-specific forms, multi-modal outputs, live interactive editing, canvas rendering, and persistent MongoDB history.
- **What Is the Innovation?**
  The innovation lies in the **workflow and architectural layer**: decoupling raw user requirements from complex prompt engineering and managing the complete content lifecycle.
- **Why MERN?**
  React provides a responsive component interface with dynamic form rendering; Express and Node manage secure API pipelines and AI orchestration; MongoDB provides schema flexibility for varying structured fields (`inputDetails`, `generatedText`, `outputMetadata`).
