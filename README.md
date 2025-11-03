# ♟️ Gomoku (Five-in-a-Row): Super Hard AI Challenge

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/YOUR_REPO_NAME?style=social)](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/stargazers)

---

## 💡 Overview

This project is a classic **Gomoku** game (also known as Caro or Five-in-a-Row) implemented entirely with **HTML, CSS, and JavaScript**. The defining feature of this game is its **Super Smart Bot AI**, which uses an advanced position evaluation algorithm to challenge even experienced players.

The game features a modern, clean, and spacious dark-themed interface, allowing players to focus entirely on their strategy.

---

## ✨ Key Features

* **Spacious Board (15x15):** The standard size for competitive Gomoku, optimized for readability and strategic depth.
* **🤖 Super Hard AI:** The Bot employs a strategic **Evaluation Function** to score potential moves, heavily prioritizing blocking immediate threats and building complex attack sequences.
* **Elegant Design:** Modern Dark Theme using CSS, featuring distinct **X** and **O** pieces with subtle visual effects.
* **Game Result Modal:** A professional pop-up notification displays the result (Win/Loss/Draw) and provides a convenient **Play Again** button.
* **Pure Frontend:** Zero dependencies required—just open the file in your browser!

---

## 🚀 Setup and Launch

You can run this game instantly as it requires **no external libraries or packages**.

1.  **Clone the Repository** or download the ZIP file:
    ```bash
    git clone [(https://github.com/lewisbenj/gomoku-co_caro.git)]
    ```
2.  **Launch the Game:** Navigate to the project folder and simply open the `index.html` file with any modern web browser (Chrome, Firefox, Edge, etc.).

---

## 🛠️ Project Structure

The project is comprised of three essential files:

| File | Function | Notes |
| :--- | :--- | :--- |
| `index.html` | Core Structure | Contains the game board grid container and the result Modal. |
| `style.css` | Styling and Aesthetics | Defines the modern Dark Theme, piece appearance (X/O), and responsive layout. |
| `script.js` | Game Logic & AI | Implements the board state, user input handling, the `checkWin` function, and the core **Super Hard Bot** logic (`botMove`, `evaluatePosition`). |

---

## 🧠 AI Logic Deep Dive (For Developers)

The AI is designed to simulate deep search by calculating the strategic value of every plausible empty cell.

**Key Strategic Scores:**

| Situation | Score | Priority Goal |
| :--- | :--- | :--- |
| `WIN` | 1,000,000 | **Offense:** Guaranteed immediate win. |
| `BLOCK_WIN` | 500,000 | **Defense:** Block the player's immediate winning move. |
| `FOUR` | 10,000 | Create a sequence of 4 in a row. |
| `OPEN_THREE` | 500 | Create an "open three" (3 pieces with both ends open), a severe threat. |

The `botMove` function iterates through potential moves, temporarily places its piece, and uses the `evaluatePosition` function to calculate the highest possible strategic value, ensuring it always maximizes its offensive and defensive potential simultaneously.

---

## 🤝 OVERVIEW

[https://gomoku-co-caro.vercel.app/]

**© 2025 [Benjamin Lewis]**
