# Invoxia 🚀

**AI-Powered Interview Preparation Platform**

Master your interviews with Invoxia — an intelligent platform that provides end-to-end interview readiness, from resume building to concept revision to mock interview practice.

---

## 🌟 Features

| Module | Description | Owner |
|--------|-------------|-------|
| 📄 **Resume Builder** | Build ATS-friendly resumes with real-time preview & PDF export | Member 1 |
| 📚 **Concept Revision** | Interactive flashcards, structured notes, and quick quizzes | Member 2 |
| 🎙️ **Mock Interview** | AI-powered mock interviews with role-based questions & scoring | Member 3 |

---

## 📁 Project Architecture

```
Invoxia/
├── index.html                    # Landing page (shared)
├── css/
│   ├── global.css                # 🔒 Design system & shared styles (DO NOT modify on feature branches)
│   ├── landing.css               # Landing page styles
│   ├── resume.css                # Resume builder styles        → Member 1
│   ├── revision.css              # Concept revision styles      → Member 2
│   └── mock-interview.css        # Mock interview styles        → Member 3
├── js/
│   ├── app.js                    # 🔒 Shared utilities & navbar (DO NOT modify on feature branches)
│   ├── resume.js                 # Resume builder logic          → Member 1
│   ├── revision.js               # Concept revision logic        → Member 2
│   └── mock-interview.js         # Mock interview logic          → Member 3
├── pages/
│   ├── resume.html               # Resume builder page           → Member 1
│   ├── revision.html             # Concept revision page         → Member 2
│   └── mock-interview.html       # Mock interview page           → Member 3
├── assets/                       # Images, icons, media
├── README.md                     # This file
└── .gitignore
```

---

## 🔀 Branch Strategy

### Branch Structure

| Branch | Purpose | Owner |
|--------|---------|-------|
| `main` | Production-ready code | All (via PR) |
| `develop` | Integration branch | All |
| `feature/resume-builder` | Resume Builder module | Member 1 |
| `feature/concept-revision` | Concept Revision module | Member 2 |
| `feature/mock-interview` | Mock Interview module | Member 3 |

### Workflow

```
main
 └── develop
      ├── feature/resume-builder      → Member 1
      ├── feature/concept-revision    → Member 2
      └── feature/mock-interview      → Member 3
```

1. **Create your feature branch** from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Work on your module files only** to avoid merge conflicts:
   - **Member 1**: `css/resume.css`, `js/resume.js`, `pages/resume.html`
   - **Member 2**: `css/revision.css`, `js/revision.js`, `pages/revision.html`
   - **Member 3**: `css/mock-interview.css`, `js/mock-interview.js`, `pages/mock-interview.html`

3. **Commit and push** regularly:
   ```bash
   git add .
   git commit -m "feat(resume): add experience section"
   git push origin feature/resume-builder
   ```

4. **Create a Pull Request** to merge into `develop`.

5. **After review**, merge into `develop`, then periodically merge `develop` → `main`.

### ⚠️ Important Rules
- **NEVER modify shared files** (`global.css`, `app.js`, `index.html`) on feature branches without team agreement
- **Always pull `develop`** before starting new work
- **Use descriptive commit messages** with prefixes: `feat()`, `fix()`, `style()`, `docs()`

---

## 🚀 Getting Started

### Prerequisites
- Git installed
- Any web browser
- A code editor (VS Code recommended)

### Setup

```bash
# Clone the repository
git clone https://github.com/Rajendra7250/Invoxia.git
cd Invoxia

# Create develop branch
git checkout -b develop
git push -u origin develop

# Create your feature branch
git checkout -b feature/resume-builder    # Member 1
git checkout -b feature/concept-revision  # Member 2
git checkout -b feature/mock-interview    # Member 3
```

### Running Locally

Simply open `index.html` in your browser, or use Live Server in VS Code:

1. Install the "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

---

## 🛠️ Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** — No frameworks, pure JS
- **Google Fonts** — Inter & Space Grotesk

---

## 👥 Team

| Member | Module | Branch |
|--------|--------|--------|
| Member 1 | Resume Builder | `feature/resume-builder` |
| Member 2 | Concept Revision | `feature/concept-revision` |
| Member 3 | Mock Interview | `feature/mock-interview` |

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for interview success
</p>
