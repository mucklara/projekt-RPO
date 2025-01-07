require('dotenv').config(); // Load environment variables from .env

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,     // Using DB_HOST from .env
      user: process.env.DB_USER,     // Using DB_USER from .env
      password: process.env.DB_PASSWORD, // Using DB_PASSWORD from .env
      database: process.env.DB_NAME,  // Using DB_NAME from .env
      port: process.env.DB_PORT      // Using DB_PORT from .env
    }
  },

  staging: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,     // Using DB_HOST from .env
      user: process.env.DB_USER,     // Using DB_USER from .env
      password: process.env.DB_PASSWORD, // Using DB_PASSWORD from .env
      database: process.env.DB_NAME  // Using DB_NAME from .env (staging should ideally use the same)
    },
    pool: {
      min: 2,
      max: 10
    },
  },

  production: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,     // Using DB_HOST from .env
      user: process.env.DB_USER,     // Using DB_USER from .env
      password: process.env.DB_PASSWORD, // Using DB_PASSWORD from .env
      database: process.env.DB_NAME,  // Using DB_NAME from .env (production should ideally use the same)
    },
    pool: {
      min: 2,
      max: 10
    },
  }

};
