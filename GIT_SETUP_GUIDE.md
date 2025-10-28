# Git Setup Guide - Connect Your LMS Project to GitHub

## 🚀 Quick Setup (3 Steps)

### Step 1: Initialize Git in Your Project
```bash
cd "d:\Second Year 1st Sem\Web Application Development\e_learning_lms\lms_e_learn"
git init
```

### Step 2: Create .gitignore File
This file tells Git what NOT to upload (like compiled files, secrets, etc.)

### Step 3: Connect to GitHub and Push
```bash
# Add all files
git add .

# Create first commit
git commit -m "Initial commit: LMS project with User API and database schema"

# Connect to your GitHub repo (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 📋 Detailed Step-by-Step Guide

### Option 1: Create New Repository on GitHub

#### 1. Create Repository on GitHub
1. Go to https://github.com
2. Click the **+** icon (top right) → **New repository**
3. Fill in details:
   - **Repository name**: `lms-elearning-platform` (or your choice)
   - **Description**: `E-Learning Management System built with Spring Boot and React`
   - **Visibility**: Public or Private
   - ❌ **DON'T** check "Initialize with README" (we already have files)
4. Click **Create repository**

#### 2. Copy the Repository URL
You'll see something like:
```
https://github.com/YOUR_USERNAME/lms-elearning-platform.git
```

#### 3. Connect Your Local Project
```bash
# Navigate to your project
cd "d:\Second Year 1st Sem\Web Application Development\e_learning_lms\lms_e_learn"

# Initialize git (if not done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: LMS project setup with database and User API"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/lms-elearning-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

### Option 2: Clone Existing Repository

If you already have a repository:

```bash
# Clone the repository
cd "d:\Second Year 1st Sem\Web Application Development\e_learning_lms"
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Copy your files into the cloned folder
# Then commit and push
cd YOUR_REPO_NAME
git add .
git commit -m "Add LMS project files"
git push
```

---

## 📝 Important: Create .gitignore First!

Before committing, create a `.gitignore` file to exclude unnecessary files.

---

## 🔐 Authentication Options

### Option 1: HTTPS (Recommended for Beginners)
When you push, GitHub will ask for credentials:
- **Username**: Your GitHub username
- **Password**: Use **Personal Access Token** (not your GitHub password)

**Create Personal Access Token:**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **Generate new token (classic)**
3. Give it a name: "LMS Project"
4. Select scopes: `repo` (full control)
5. Click **Generate token**
6. **COPY THE TOKEN** (you won't see it again!)
7. Use this token as password when pushing

### Option 2: SSH (Advanced)
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
# Then use SSH URL instead:
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
```

---

## 📦 Common Git Commands

### Daily Workflow
```bash
# Check status
git status

# Add specific files
git add filename.java

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull
```

### Branching
```bash
# Create new branch
git checkout -b feature/course-api

# Switch branches
git checkout main

# List branches
git branch

# Merge branch
git checkout main
git merge feature/course-api

# Delete branch
git branch -d feature/course-api
```

### Undo Changes
```bash
# Discard changes in file
git checkout -- filename.java

# Unstage file
git reset HEAD filename.java

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### View History
```bash
# View commit history
git log

# View compact history
git log --oneline

# View changes
git diff
```

---

## 🎯 Recommended Commit Messages

Use clear, descriptive commit messages:

**Good Examples:**
```bash
git commit -m "Add User entity and repository"
git commit -m "Implement JWT authentication"
git commit -m "Create Course CRUD API endpoints"
git commit -m "Fix bug in enrollment service"
git commit -m "Update database schema with new tables"
git commit -m "Add Postman collection for testing"
```

**Bad Examples:**
```bash
git commit -m "update"
git commit -m "fix"
git commit -m "changes"
git commit -m "asdfgh"
```

---

## 📂 Suggested Branch Strategy

### Main Branches
- `main` - Production-ready code
- `develop` - Development branch

### Feature Branches
- `feature/user-management` - User CRUD operations
- `feature/course-api` - Course management
- `feature/authentication` - JWT auth
- `feature/frontend-setup` - React setup
- `feature/payment-integration` - Payment features

### Workflow
```bash
# Start new feature
git checkout develop
git checkout -b feature/course-api

# Work on feature...
git add .
git commit -m "Add course entity and repository"

# Push feature branch
git push -u origin feature/course-api

# When done, merge to develop
git checkout develop
git merge feature/course-api

# Push develop
git push
```

---

## 🔄 Syncing with Team

If working with others:

```bash
# Before starting work
git pull

# After making changes
git add .
git commit -m "Your changes"
git pull  # Get latest changes
git push  # Push your changes
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "fatal: not a git repository"
**Solution:**
```bash
git init
```

### Issue 2: "fatal: remote origin already exists"
**Solution:**
```bash
git remote remove origin
git remote add origin YOUR_REPO_URL
```

### Issue 3: "Permission denied (publickey)"
**Solution:** Use HTTPS instead of SSH, or setup SSH keys properly.

### Issue 4: "Updates were rejected"
**Solution:**
```bash
git pull --rebase
git push
```

### Issue 5: Merge Conflicts
**Solution:**
1. Open conflicted files
2. Look for `<<<<<<<`, `=======`, `>>>>>>>`
3. Edit to keep desired changes
4. Remove conflict markers
5. `git add .` and `git commit`

---

## 📊 Check Your Git Status

```bash
# See what's changed
git status

# See remote repository
git remote -v

# See current branch
git branch

# See commit history
git log --oneline -10
```

---

## 🎉 First Push Checklist

Before your first push, make sure:

- ✅ `.gitignore` file is created
- ✅ No sensitive data (passwords, API keys) in code
- ✅ `target/` folder is ignored
- ✅ Database passwords are in environment variables
- ✅ All files are added (`git add .`)
- ✅ Commit message is descriptive
- ✅ Remote repository is set
- ✅ You have GitHub credentials ready

---

## 📱 GitHub Desktop (Alternative)

If you prefer GUI:

1. Download **GitHub Desktop**: https://desktop.github.com/
2. Install and sign in
3. Click **Add** → **Add Existing Repository**
4. Select your project folder
5. Create `.gitignore` (GitHub Desktop can generate it)
6. Commit and push using the GUI

---

## 🔗 Useful Git Resources

- **Git Documentation**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com/
- **Git Cheat Sheet**: https://education.github.com/git-cheat-sheet-education.pdf
- **Learn Git Branching**: https://learngitbranching.js.org/

---

## 🎯 Next Steps After Pushing

1. **Add README.md** with project description
2. **Add LICENSE** file
3. **Setup GitHub Actions** for CI/CD
4. **Enable GitHub Issues** for bug tracking
5. **Create Project Board** for task management
6. **Add collaborators** if working in team
7. **Setup branch protection** for main branch

---

**Happy Coding! 🚀**
