const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const initializeDb = async () => {
  const client = await pool.connect();
  try {
    console.log('Connected to PostgreSQL.');

    // Create Greetings table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS Greetings (
        id SERIAL PRIMARY KEY,
        timeOfDay TEXT NOT NULL,
        language TEXT NOT NULL,
        greetingMessage TEXT NOT NULL,
        tone TEXT NOT NULL
      );
    `);
    console.log('Greetings table created or already exists.');

    // Seed data
    const result = await client.query('SELECT COUNT(*) FROM Greetings');
    if (parseInt(result.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO Greetings (timeOfDay, language, greetingMessage, tone) VALUES
        ('Morning', 'English', 'Good Morning', 'Formal'),
        ('Morning', 'English', 'Morning, buddy!', 'Casual'),
        ('Afternoon', 'English', 'Good Afternoon', 'Formal'),
        ('Afternoon', 'English', 'Hey there!', 'Casual'),
        ('Evening', 'English', 'Good Evening', 'Formal'),
        ('Evening', 'English', 'What''s up?', 'Casual'), 
        ('Morning', 'French', 'Bonjour', 'Formal'),
        ('Morning', 'French', 'Salut!', 'Casual'),
        ('Afternoon', 'French', 'Bon Après-midi', 'Formal'),
        ('Afternoon', 'French', 'Coucou!', 'Casual'),
        ('Evening', 'French', 'Bonsoir', 'Formal'),
        ('Evening', 'French', 'Salut!', 'Casual'),
        ('Morning', 'Spanish', 'Buenos Días', 'Formal'),
        ('Morning', 'Spanish', '¡Hola!', 'Casual'),
        ('Afternoon', 'Spanish', 'Buenas Tardes', 'Formal'),
        ('Afternoon', 'Spanish', '¿Qué tal?', 'Casual'),
        ('Evening', 'Spanish', 'Buenas Noches', 'Formal'),
        ('Evening', 'Spanish', '¡Qué tal!', 'Casual');
      `);
      console.log('Database seeded with greetings.');
    }
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
  }
};

// Initialize the database
initializeDb().catch((err) => console.error(err));

module.exports = pool;
