-- *вмикаємо зовнішні ключі
PRAGMA foreign_keys = ON;

-- *Таблиця клієнтів
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);