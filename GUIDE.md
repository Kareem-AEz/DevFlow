# 🧭 **Next.js Boilerplate Workflow Guide**

---

## ✅ **Step 1: Initialize and Push to GitHub**

```bash
git init
git remote add origin https://github.com/your-username/your-boilerplate.git
git add .
git commit -m "init: setup Next.js with Tailwind and config"
git push -u origin main
```

---

## 🌿 **Step 2: Branching Workflow**

> This keeps your `main` branch clean and stable.

### ➕ Create a Feature Branch

```bash
git checkout -b feature/button-component
```

Do your work…

### 📦 Stage and Commit Changes

```bash
git add .
git commit -m "feat(button): add primary and ghost variants"
```

### 🔄 Push the Branch to GitHub

```bash
git push -u origin feature/button-component
```

---

## 🔀 **Step 3: Merge Back into `dev` or `main`**

### Option A: **Via GitHub (Recommended)**

1. Go to GitHub → Create Pull Request (PR) from `feature/button-component` → `dev` or `main`
2. Review, squash commits if needed
3. Merge → Delete branch

### Option B: **Via CLI**

Make sure you’re on target branch (`dev` or `main`):

```bash
git checkout dev
git pull origin dev
git merge feature/button-component
git push origin dev
```

Then delete the merged branch:

```bash
git branch -d feature/button-component
git push origin --delete feature/button-component
```

---

## 🏷️ **Step 4: Tag a Version (Semantic Versioning)**

Update your `CHANGELOG.md`, then:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Use [Semantic Versioning](https://semver.org):

- `MAJOR`: breaking changes
- `MINOR`: new features (non-breaking)
- `PATCH`: fixes/improvements

---

## 📝 **Step 5: Use Conventional Commits**

| Type       | Purpose                       |
| ---------- | ----------------------------- |
| `feat`     | New feature                   |
| `fix`      | Bug fix                       |
| `style`    | Code formatting only          |
| `refactor` | Code change (not fix/feature) |
| `chore`    | Tooling/config/dependencies   |
| `docs`     | Documentation only            |

**Example:**

```bash
git commit -m "chore(prettier): configure trailingComma and tabWidth"
```

Optional: Install [Commitizen](https://github.com/commitizen/cz-cli):

```bash
npm install -g commitizen
git cz
```

---

## 📦 **Final Push Checklist (Per Feature)**

✅ Finished work
✅ Tests (if any)
✅ Conventional commit message
✅ Pushed to feature branch
✅ Pull Request → dev/main
✅ Merged → deleted feature branch
✅ Tagged version (if needed)
