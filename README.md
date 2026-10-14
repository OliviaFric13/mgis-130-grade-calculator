# mgis-130-grade-calculator
# MyCourses Weighted Grade Tracker

A custom single-page web application designed to solve the MyCourses grade-visibility gap at RIT. This tool allows students to input syllabus category weights, log individual assignment scores, and instantly view their live percentage and estimated letter grade.

This project demonstrates the **Three-Layer Architecture** of information systems.

---

## 🏗️ Three-Layer Architecture Breakdown

This application strictly separates concerns into three distinct layers:

### 1. Data Layer (Information Storage)
* **User Inputs:** Captures course names, category names, syllabus percentage weights, and individual assignment scores (earned points vs. points possible).
* **Local Persistence:** Utilizes browser `localStorage` to save and retrieve structured course, category, and assignment objects in JSON format.
* **State Preservation:** Automatically loads saved records on page refresh, ensuring data continuity without needing an external database.

### 2. Processing Layer (Business Logic)
* **Category Aggregation:** Automatically groups assignments by category, summing earned and possible points to compute individual category percentages.
* **Weighted Grade Formula:** Calculates the overall live percentage by multiplying each category's score by its syllabus weight and dividing by active weights:
  $$\text{Overall Grade \%} = \frac{\sum (\text{Category \%} \times \text{Category Weight})}{\sum \text{Active Weights}}$$
* **Letter Grade Conversion:** Translates the final percentage into an estimated RIT letter grade (`A` down to `F`).
* **Validation Guards:** Warns users if syllabus category weights do not total 100%.

### 3. User Interface Layer (Presentation)
* **Semantic HTML5:** Clean accessible form structures, dynamic dropdowns, category badge lists, and summary dashboard metrics.
* **Modern CSS Styling:** Polished pink color palette, CSS grid/flexbox layouts, responsive design, and clear visual hierarchy.
* **Dynamic DOM Manipulation:** Instantly renders added assignments, updates live calculations in real time, and provides empty-state feedback.

---

## 🚀 Features

* ⚙️ **Custom Course Setup:** Track any RIT course name or code.
* 📊 **Syllabus Category Weights:** Define your grading breakdown (e.g., Exams 40%, Homework 30%, Quizzes 30%) with automatic 100% total validation.
* 📝 **Assignment Tracker:** Log points earned and total points possible for each assignment under its specific category.
* ⚡ **Live Calculations:** Instantly view your real-time cumulative percentage and official letter grade.
* 💾 **Auto-Save Storage:** Keep your data persistent across browser sessions using local storage.
* 📱 **Mobile-Friendly:** Fully responsive interface for checking grades on the go.

---

## 🛠️ Built With

* **HTML5** – Structure & Forms
* **CSS3** – Responsive Styling & Variables
* **JavaScript (ES6+)** – Application Logic & DOM Rendering
* **Google Gemini AI** – Architecture Planning & Development Assistance
* **GitHub Pages** – Free Web Hosting & Deployment

---

## 🌐 Live Demo

Access the live deployed application here:
👉 `https://<YOUR-GITHUB-USERNAME>.github.io/<YOUR-REPO-NAME>/`

---

## 📖 How to Run Locally

1. Clone the repository:
   ```bash
   git clone [https://github.com/](https://github.com/)<YOUR-GITHUB-USERNAME>/<YOUR-REPO-NAME>.git
