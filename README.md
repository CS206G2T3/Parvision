# Parvision Frontend

React + Vite + Tailwind CSS frontend for Parvision, built from the Figma design.

## Getting Started

```bash
npm install
npm run dev
```

## Pushing to GitHub (New FrontEnd branch)

From inside the `parvision-frontend` folder:

```bash
# Initialize git
git init

# Add the Parvision repo as remote
git remote add origin https://github.com/CS206G2T3/Parvision.git

# Fetch existing branches
git fetch origin

# Create and switch to the new branch
git checkout -b "New FrontEnd"

# Stage all files
git add .

# Commit
git commit -m "feat: add frontend scaffold from Figma design (Login + Home screens)"

# Push the new branch
git push -u origin "New FrontEnd"
```

## Project Structure

```
src/
  pages/
    LoginPage.jsx   — Login screen (phone/email + password)
    HomePage.jsx    — Home screen (dashboard + bottom nav)
  App.jsx           — Router setup
  main.jsx          — Entry point
  index.css         — Tailwind + global styles
```

## Notes on Image Assets

The Figma asset URLs in the components are valid for **7 days** from when the design was extracted.
After that, replace them with locally hosted assets in `src/assets/`.

## Stack

- React 18
- React Router v6
- Vite 5
- Tailwind CSS 3
