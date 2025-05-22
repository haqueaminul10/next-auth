const express = require('express');
const app = express();

const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const PORT = 5000;
// Middleware
app.use(cors());
app.use(express.json());

// Path to JSON database file
const dbPath = path.join(__dirname, 'database.json');

// Initialize JSON database if it doesn't exist
async function initializeDatabase() {
  try {
    const exists = await fs
      .access(dbPath)
      .then(() => true)
      .catch(() => false);
    if (!exists) {
      await fs.writeFile(dbPath, JSON.stringify({ users: [] }, null, 2));
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Read from JSON database
async function readDatabase() {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    const db = JSON.parse(data);

    return db;
  } catch (error) {
    console.error('Error reading database:', error);
    return { users: [] };
  }
}

// Write to JSON database
async function writeDatabase(data) {
  try {
    if (!data.session) {
      data.session = [];
    }
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to database:', error);
  }
}

// Register endpoint
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Email and password are required.' });
  }
  const db = await readDatabase();
  if (!db.users) db.users = [];
  const userExists = db.users.find((user) => user.email === email);
  if (userExists) {
    return res.status(409).json({ message: 'User already exists.' });
  }
  db.users.push({ email, password });
  await writeDatabase(db);
  res.status(201).json({ message: 'User registered successfully.' });
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Email and password are required.' });
  }
  const db = await readDatabase();
  const user = db.users.find(
    (user) => user.email === email && user.password === password
  );
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
  // Return user object for NextAuth
  res.status(200).json({ email: user.email });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
