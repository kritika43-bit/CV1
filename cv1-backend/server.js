// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

/**
 * =========================
 * Settings & Utilities
 * =========================
 */
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
const DB_FILE = process.env.DB_FILE || 'database.db';

// Simple input validators (keep deps minimal)
const isEmail = (s) => typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const nonEmpty = (s) => typeof s === 'string' && s.trim().length > 0;
const isPositiveInt = (n) => Number.isInteger(n) && n > 0;
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

/**
 * =========================
 * DB Initialization (Singleton)
 * =========================
 */
let db; // shared handle

async function initDB() {
  const handle = await open({
    filename: DB_FILE,
    driver: sqlite3.Database
  });

  // Performance & correctness pragmas
  await handle.exec(`
    PRAGMA journal_mode = WAL;            -- better write concurrency & durability
    PRAGMA synchronous = NORMAL;          -- good balance for WAL
    PRAGMA foreign_keys = ON;             -- enforce FKs
    PRAGMA busy_timeout = 5000;           -- wait for up to 5s if DB is busy
  `);

  // Schema (normalized, indexed, timestamps)
  await handle.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);

    -- Club accounts include auth fields (email/password)
    CREATE TABLE IF NOT EXISTS clubs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_clubs_email ON clubs(email);
    CREATE INDEX IF NOT EXISTS idx_clubs_name ON clubs(name);

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      club_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      date DATETIME,
      capacity INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_events_club_id ON events(club_id);
    CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      message TEXT,
      rating INTEGER CHECK (rating BETWEEN 1 AND 5),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_feedback_event_id ON feedback(event_id);
    CREATE INDEX IF NOT EXISTS idx_feedback_student_id ON feedback(student_id);
  `);

  return handle;
}

/**
 * =========================
 * Auth Helpers
 * =========================
 */
function signToken(payload, expiry = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiry });
}

function authRequired(role /* 'student' | 'club' */) {
  return (req, res, next) => {
    try {
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      if (!token) return res.status(401).json({ error: 'Missing token' });

      const decoded = jwt.verify(token, JWT_SECRET);
      if (!decoded || decoded.role !== role) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      req.user = decoded; // { id, role }
      next();
    } catch (e) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

/**
 * =========================
 * Server Setup
 * =========================
 */
const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

/**
 * =========================
 * Auth: Students
 * =========================
 */
app.post('/auth/student/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!nonEmpty(name) || !isEmail(email) || !nonEmpty(password)) {
      return res.status(400).json({ error: 'Invalid name, email, or password' });
    }

    const hash = await bcrypt.hash(password, 12);
    const result = await db.run(
      'INSERT INTO students (name, email, password_hash) VALUES (?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), hash]
    );
    const token = signToken({ id: result.lastID, role: 'student' });
    return res.json({ id: result.lastID, token });
  } catch (e) {
    if (String(e.message).includes('UNIQUE constraint failed: students.email')) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    return res.status(500).json({ error: e.message });
  }
});

app.post('/auth/student/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!isEmail(email) || !nonEmpty(password)) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const student = await db.get('SELECT * FROM students WHERE email = ?', [email.toLowerCase().trim()]);
    if (!student) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, student.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken({ id: student.id, role: 'student' });
    return res.json({ id: student.id, name: student.name, token });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

/**
 * =========================
 * Auth: Clubs
 * =========================
 */
app.post('/auth/club/signup', async (req, res) => {
  try {
    const { name, description = '', email, password } = req.body || {};
    if (!nonEmpty(name) || !isEmail(email) || !nonEmpty(password)) {
      return res.status(400).json({ error: 'Invalid name, email, or password' });
    }
    const hash = await bcrypt.hash(password, 12);
    const result = await db.run(
      'INSERT INTO clubs (name, description, email, password_hash) VALUES (?, ?, ?, ?)',
      [name.trim(), String(description || '').trim(), email.toLowerCase().trim(), hash]
    );
    const token = signToken({ id: result.lastID, role: 'club' });
    return res.json({ id: result.lastID, token });
  } catch (e) {
    if (String(e.message).includes('UNIQUE constraint failed: clubs.email')) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    return res.status(500).json({ error: e.message });
  }
});

app.post('/auth/club/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!isEmail(email) || !nonEmpty(password)) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const club = await db.get('SELECT * FROM clubs WHERE email = ?', [email.toLowerCase().trim()]);
    if (!club) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, club.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken({ id: club.id, role: 'club' });
    return res.json({ id: club.id, name: club.name, token });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

/**
 * =========================
 * Clubs (CRUD)
 * =========================
 */
app.get('/clubs', async (req, res) => {
  try {
    const q = (req.query.q || '').toString().trim();
    const page = clamp(parseInt(req.query.page) || 1, 1, 100000);
    const size = clamp(parseInt(req.query.size) || 20, 1, 100);
    const offset = (page - 1) * size;

    let where = '';
    const params = [];
    if (q) {
      where = 'WHERE name LIKE ? OR description LIKE ?';
      params.push(`%${q}%`, `%${q}%`);
    }

    const items = await db.all(
      `SELECT id, name, description, email, created_at
       FROM clubs
       ${where}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, size, offset]
    );
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/clubs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!isPositiveInt(id)) return res.status(400).json({ error: 'Invalid id' });
    const club = await db.get(
      'SELECT id, name, description, email, created_at FROM clubs WHERE id = ?',
      [id]
    );
    if (!club) return res.status(404).json({ error: 'Not found' });
    res.json(club);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update own club profile
app.patch('/clubs/:id', authRequired('club'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!isPositiveInt(id)) return res.status(400).json({ error: 'Invalid id' });
    if (req.user.id !== id) return res.status(403).json({ error: 'Can only modify your own club' });

    const { name, description } = req.body || {};
    if (name && !nonEmpty(name)) return res.status(400).json({ error: 'Invalid name' });
    if (description != null && typeof description !== 'string') {
      return res.status(400).json({ error: 'Invalid description' });
    }

    await db.run(
      `UPDATE clubs SET
         name = COALESCE(?, name),
         description = COALESCE(?, description)
       WHERE id = ?`,
      [name ? name.trim() : null, description != null ? description.trim() : null, id]
    );
    const updated = await db.get('SELECT id, name, description, email, created_at FROM clubs WHERE id = ?', [id]);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * =========================
 * Events (CRUD + filters + pagination)
 * =========================
 */
app.get('/events', async (req, res) => {
  try {
    const page = clamp(parseInt(req.query.page) || 1, 1, 100000);
    const size = clamp(parseInt(req.query.size) || 20, 1, 100);
    const offset = (page - 1) * size;

    const clubId = req.query.club_id ? parseInt(req.query.club_id) : null;
    const from = req.query.from ? new Date(req.query.from) : null;
    const to = req.query.to ? new Date(req.query.to) : null;
    const q = (req.query.q || '').toString().trim();

    const where = [];
    const params = [];

    if (clubId && isPositiveInt(clubId)) {
      where.push('events.club_id = ?'); params.push(clubId);
    }
    if (from && !isNaN(from.getTime())) {
      where.push('events.date >= ?'); params.push(from.toISOString());
    }
    if (to && !isNaN(to.getTime())) {
      where.push('events.date <= ?'); params.push(to.toISOString());
    }
    if (q) {
      where.push('(events.title LIKE ? OR events.description LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    }

    const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const items = await db.all(
      `SELECT events.*, clubs.name AS club_name
       FROM events
       LEFT JOIN clubs ON events.club_id = clubs.id
       ${whereSQL}
       ORDER BY events.date DESC, events.id DESC
       LIMIT ? OFFSET ?`,
      [...params, size, offset]
    );
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Create event (club only)
app.post('/events', authRequired('club'), async (req, res) => {
  try {
    const { title, description = '', date = null, capacity = null } = req.body || {};
    if (!nonEmpty(title)) return res.status(400).json({ error: 'Title required' });

    // date can be null; if provided, validate
    let isoDate = null;
    if (date) {
      const d = new Date(date);
      if (isNaN(d.getTime())) return res.status(400).json({ error: 'Invalid date' });
      isoDate = d.toISOString();
    }

    const cap = capacity == null ? null : parseInt(capacity);
    if (cap != null && (!Number.isInteger(cap) || cap < 0)) {
      return res.status(400).json({ error: 'Invalid capacity' });
    }

    const result = await db.run(
      'INSERT INTO events (club_id, title, description, date, capacity) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, title.trim(), String(description).trim(), isoDate, cap]
    );
    const created = await db.get('SELECT * FROM events WHERE id = ?', [result.lastID]);
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update event (owner club only)
app.patch('/events/:id', authRequired('club'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!isPositiveInt(id)) return res.status(400).json({ error: 'Invalid id' });

    const existing = await db.get('SELECT * FROM events WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'Not found' });
    if (existing.club_id !== req.user.id) return res.status(403).json({ error: 'Not your event' });

    const { title, description, date, capacity } = req.body || {};

    let isoDate = undefined;
    if (date !== undefined) {
      if (date === null) {
        isoDate = null;
      } else {
        const d = new Date(date);
        if (isNaN(d.getTime())) return res.status(400).json({ error: 'Invalid date' });
        isoDate = d.toISOString();
      }
    }

    let cap = undefined;
    if (capacity !== undefined) {
      if (capacity === null) cap = null;
      else {
        const c = parseInt(capacity);
        if (!Number.isInteger(c) || c < 0) return res.status(400).json({ error: 'Invalid capacity' });
        cap = c;
      }
    }

    await db.run(
      `UPDATE events SET
         title = COALESCE(?, title),
         description = COALESCE(?, description),
         date = COALESCE(?, date),
         capacity = COALESCE(?, capacity)
       WHERE id = ?`,
      [
        title ? title.trim() : null,
        description != null ? String(description).trim() : null,
        isoDate !== undefined ? isoDate : null,
        cap !== undefined ? cap : null,
        id
      ]
    );

    const updated = await db.get('SELECT * FROM events WHERE id = ?', [id]);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete event (owner club only)
app.delete('/events/:id', authRequired('club'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!isPositiveInt(id)) return res.status(400).json({ error: 'Invalid id' });

    const existing = await db.get('SELECT * FROM events WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'Not found' });
    if (existing.club_id !== req.user.id) return res.status(403).json({ error: 'Not your event' });

    await db.run('DELETE FROM events WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * =========================
 * Feedback
 * =========================
 */
// Students submit feedback
app.post('/feedback', authRequired('student'), async (req, res) => {
  try {
    const { event_id, message = '', rating = null } = req.body || {};
    const eid = parseInt(event_id);
    if (!isPositiveInt(eid)) return res.status(400).json({ error: 'Invalid event_id' });

    const event = await db.get('SELECT id FROM events WHERE id = ?', [eid]);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    let r = rating == null ? null : parseInt(rating);
    if (r != null && (!Number.isInteger(r) || r < 1 || r > 5)) {
      return res.status(400).json({ error: 'Rating must be 1..5' });
    }

    const result = await db.run(
      'INSERT INTO feedback (student_id, event_id, message, rating) VALUES (?, ?, ?, ?)',
      [req.user.id, eid, String(message).trim(), r]
    );
    const created = await db.get('SELECT * FROM feedback WHERE id = ?', [result.lastID]);
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Anyone can list feedback (filter by event, student) with pagination
app.get('/feedback', async (req, res) => {
  try {
    const page = clamp(parseInt(req.query.page) || 1, 1, 100000);
    const size = clamp(parseInt(req.query.size) || 20, 1, 100);
    const offset = (page - 1) * size;

    const eventId = req.query.event_id ? parseInt(req.query.event_id) : null;
    const studentId = req.query.student_id ? parseInt(req.query.student_id) : null;

    const where = [];
    const params = [];
    if (eventId && isPositiveInt(eventId)) { where.push('feedback.event_id = ?'); params.push(eventId); }
    if (studentId && isPositiveInt(studentId)) { where.push('feedback.student_id = ?'); params.push(studentId); }
    const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const items = await db.all(
      `SELECT feedback.*, students.name AS student_name, events.title AS event_title
       FROM feedback
       LEFT JOIN students ON feedback.student_id = students.id
       LEFT JOIN events   ON feedback.event_id = events.id
       ${whereSQL}
       ORDER BY feedback.created_at DESC, feedback.id DESC
       LIMIT ? OFFSET ?`,
      [...params, size, offset]
    );
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * =========================
 * Boot
 * =========================
 */
const start = async () => {
  db = await initDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start().catch((e) => {
  console.error('Failed to start server:', e);
  process.exit(1);
});
