require('dotenv').config();  // Load environment variables from .env file

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }
});

// Create tables and insert data
const createTablesAndInsertData = async () => {
  try {
    // Check if 'Users' table exists, drop it if it does
    const usersExists = await knex.schema.hasTable('Users');
    if (usersExists) {
      console.log('Users table exists, dropping it...');
      await knex.schema.dropTable('Users');
    }

    // Create the 'Users' table
    await knex.schema.createTable('Users', (table) => {
      table.increments('user_id').primary();
      table.string('username', 50).unique().notNullable();
      table.string('email', 100).unique().notNullable();
      table.string('password_hash', 250).notNullable();
      table.string('avatar', 255);
      table.timestamp('registration_date').defaultTo(knex.fn.now());
    });
    console.log('Users table created');

    // Insert test data into 'Users' table
    await knex('Users').insert([
      { username: 'john_doe', email: 'john@example.com', password_hash: 'hashed_password_1', avatar: 'avatar_url_1' },
      { username: 'jane_smith', email: 'jane@example.com', password_hash: 'hashed_password_2', avatar: 'avatar_url_2' },
      { username: 'mike_ross', email: 'mike@example.com', password_hash: 'hashed_password_3', avatar: 'avatar_url_3' }
    ]);

    // Create the 'Languages' table
    const languagesExists = await knex.schema.hasTable('Languages');
    if (languagesExists) {
      console.log('Languages table exists, dropping it...');
      await knex.schema.dropTable('Languages');
    }

    await knex.schema.createTable('Languages', (table) => {
      table.increments('language_id').primary();
      table.string('language_name', 100).unique().notNullable();
    });
    console.log('Languages table created');

    // Insert test data into 'Languages' table
    await knex('Languages').insert([
      { language_name: 'English' },
      { language_name: 'Spanish' },
      { language_name: 'French' }
    ]);

    // Create the 'User_Progress' table
    const userProgressExists = await knex.schema.hasTable('User_Progress');
    if (userProgressExists) {
      console.log('User_Progress table exists, dropping it...');
      await knex.schema.dropTable('User_Progress');
    }

    await knex.schema.createTable('User_Progress', (table) => {
      table.increments('user_progress_id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.integer('language_id').unsigned().notNullable();
      table.enu('level', ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).notNullable();
      table.integer('points').defaultTo(0);
      table.foreign('user_id').references('Users.user_id').onDelete('CASCADE');
      table.foreign('language_id').references('Languages.language_id').onDelete('CASCADE');
    });
    console.log('User_Progress table created');

    // Insert test data into 'User_Progress' table
    await knex('User_Progress').insert([
      { user_id: 1, language_id: 1, level: 'B1', points: 50 },
      { user_id: 2, language_id: 2, level: 'A2', points: 30 },
      { user_id: 3, language_id: 3, level: 'C1', points: 70 }
    ]);

    // Example: Create the 'Quizzes' table
    const quizzesExists = await knex.schema.hasTable('Quizzes');
    if (quizzesExists) {
      console.log('Quizzes table exists, dropping it...');
      await knex.schema.dropTable('Quizzes');
    }

    await knex.schema.createTable('Quizzes', (table) => {
      table.increments('quiz_id').primary();
      table.integer('language_id').unsigned().notNullable();
      table.string('quiz_name', 100).notNullable();
      table.text('quiz_description');
      table.foreign('language_id').references('Languages.language_id').onDelete('CASCADE');
    });
    console.log('Quizzes table created');

    // Insert test data into 'Quizzes' table
    await knex('Quizzes').insert([
      { language_id: 1, quiz_name: 'English Basics', quiz_description: 'A quiz to test basic English knowledge' },
      { language_id: 2, quiz_name: 'Spanish Beginner', quiz_description: 'Test your Spanish skills' },
      { language_id: 3, quiz_name: 'French Advanced', quiz_description: 'Advanced level French quiz' }
    ]);

    // Optionally, define stored procedures
    const procedures = [
      {
        name: 'GetCrosswordVocabulary',
        query: `DELIMITER $$ CREATE PROCEDURE GetCrosswordVocabulary(...) END$$ DELIMITER ;`
      },
      {
        name: 'GetMatchImageToWordVocabulary',
        query: `DELIMITER $$ CREATE PROCEDURE GetMatchImageToWordVocabulary(...) END$$ DELIMITER ;`
      }
    ];

    procedures.forEach(async (procedure) => {
      await knex.raw(procedure.query);
      console.log(`${procedure.name} procedure created`);
    });

  } catch (error) {
    console.error('Error creating tables or inserting data:', error);
  } finally {
    knex.destroy(); // Close the connection when done
  }
};

// Call the function to create tables and insert data
createTablesAndInsertData();

// Export the knex instance for use in other parts of the application
module.exports = knex;
