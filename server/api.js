const express = require("express");
const router = express.Router();

// Mock data (replace with database in production)
let cards = [];
let decks = [];
let users = [];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  // In production, verify JWT token here
  next();
};

// Card routes
router.get("/cards", authenticateToken, (req, res) => {
  res.json(cards);
});

router.get("/cards/:id", authenticateToken, (req, res) => {
  const card = cards.find((c) => c.id === req.params.id);
  if (!card) {
    return res.status(404).json({ error: "Card not found" });
  }
  res.json(card);
});

router.post("/cards", authenticateToken, (req, res) => {
  const card = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  cards.push(card);
  res.status(201).json(card);
});

router.put("/cards/:id", authenticateToken, (req, res) => {
  const index = cards.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Card not found" });
  }
  cards[index] = {
    ...cards[index],
    ...req.body,
    updatedAt: new Date(),
  };
  res.json(cards[index]);
});

router.delete("/cards/:id", authenticateToken, (req, res) => {
  const index = cards.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Card not found" });
  }
  cards.splice(index, 1);
  res.status(204).send();
});

// Deck routes
router.get("/decks", authenticateToken, (req, res) => {
  res.json(decks);
});

router.get("/decks/:id", authenticateToken, (req, res) => {
  const deck = decks.find((d) => d.id === req.params.id);
  if (!deck) {
    return res.status(404).json({ error: "Deck not found" });
  }
  res.json(deck);
});

router.post("/decks", authenticateToken, (req, res) => {
  const deck = {
    id: Date.now().toString(),
    ...req.body,
    cards: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  decks.push(deck);
  res.status(201).json(deck);
});

router.put("/decks/:id", authenticateToken, (req, res) => {
  const index = decks.findIndex((d) => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Deck not found" });
  }
  decks[index] = {
    ...decks[index],
    ...req.body,
    updatedAt: new Date(),
  };
  res.json(decks[index]);
});

router.delete("/decks/:id", authenticateToken, (req, res) => {
  const index = decks.findIndex((d) => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Deck not found" });
  }
  decks.splice(index, 1);
  res.status(204).send();
});

// User routes
router.post("/auth/register", (req, res) => {
  const { email, username, password } = req.body;

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const user = {
    id: Date.now().toString(),
    email,
    username,
    password, // In production, hash password
    createdAt: new Date(),
    updatedAt: new Date(),
    preferences: {
      theme: "LIGHT",
      language: "ENGLISH",
      dailyGoal: 20,
      notifications: {
        email: true,
        push: true,
        dailyReminder: true,
        reminderTime: "09:00",
      },
    },
  };

  users.push(user);
  res.status(201).json(user);
});

router.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // In production, generate JWT token
  const token = "mock-jwt-token";
  res.json({ token, user });
});

router.get("/users/:id", authenticateToken, (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

router.put("/users/:id", authenticateToken, (req, res) => {
  const index = users.findIndex((u) => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  users[index] = {
    ...users[index],
    ...req.body,
    updatedAt: new Date(),
  };
  res.json(users[index]);
});

module.exports = router;
