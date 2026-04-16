# 🍲 Recipe Finder

A modern React-based web application to search and explore recipes using an external API. Built with a focus on clean UI, responsive behavior, and efficient state management.

---

## 🚀 Features

* 🔍 Search recipes dynamically via API
* 📋 View detailed recipe information
* ⏳ Loading states for better UX
* ⚠️ Error handling for failed requests
* ❌ Graceful handling of empty results

---

## 🧠 Approach

* Built using **React functional components**
* State management via **useState**
* API calls handled with **useEffect**
* Applied **conditional rendering** for different UI states (loading, success, error)

---

## 🏗️ Architecture

```(text)
App
 ├── SearchBar
 ├── RecipeList
 │    └── RecipeCard
 └── RecipeDetails (Modal/View)
```

---

## 🔌 API Used

* Spoonacular API

---

## ⚡ Challenges Faced

* Managing asynchronous API calls efficiently
* Handling loading and error states properly
* Dealing with empty or null API responses
* Structuring components for scalability

---

## ⚙️ Setup & Installation

Clone the repository:

```bash
git clone https://github.com/mukteswar-git/react/tree/main/PHASE%201%20-%20React%20Fundamentals/recipe-finder
cd recipe-finder
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

---

## 🌐 Live Demo

👉 [View Live App](https://recipe-finder-coral-beta.vercel.app/)

## 📄 License

This project is for learning and practice purposes.
