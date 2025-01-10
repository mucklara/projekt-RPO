const knex = require('../setupDatabase');
// Create a new language
const createLanguage = async (languageName) => {
  try {
      if (!languageName || typeof languageName !== 'string') {
          throw new Error('Invalid language name provided');
      }

      await knex('languages').insert({ language_name: languageName });
      console.log(`Language "${languageName}" created successfully`);
      return { success: true, message: 'Language created successfully' };
  } catch (error) {
      console.error('Error creating language:', error.message);
      throw new Error('Failed to create language');
  }
};
  
  // Get all languages
  const getLanguages = async () => {
    try {
        const languages = await knex('languages').select('*');
        console.log(`Retrieved ${languages.length} languages`);
        return languages;
    } catch (error) {
        console.error('Error retrieving languages:', error.message);
        throw new Error('Failed to retrieve languages');
    }
};
  
  // Get language by ID
  const getLanguageById = async (languageId) => {
    try {
        if (!languageId || isNaN(languageId)) {
            throw new Error('Invalid language ID provided');
        }

        const language = await knex('languages').where('language_id', languageId).first();
        if (!language) {
            throw new Error(`Language with ID ${languageId} not found`);
        }

        console.log(`Retrieved language with ID ${languageId}:`, language);
        return language;
    } catch (error) {
        console.error(`Error retrieving language with ID ${languageId}:`, error.message);
        throw new Error(`Failed to retrieve language with ID ${languageId}`);
    }
};
  
  // Update language name
  const updateLanguage = async (languageId, newName) => {
    try {
        if (!languageId || isNaN(languageId)) {
            throw new Error('Invalid language ID provided');
        }
        if (!newName || typeof newName !== 'string') {
            throw new Error('Invalid language name provided');
        }

        const updatedRows = await knex('languages').where('language_id', languageId).update({ language_name: newName });
        if (!updatedRows) {
            throw new Error(`Language with ID ${languageId} not found`);
        }

        console.log(`Language with ID ${languageId} updated to "${newName}"`);
        return { success: true, message: 'Language updated successfully' };
    } catch (error) {
        console.error(`Error updating language with ID ${languageId}:`, error.message);
        throw new Error(`Failed to update language with ID ${languageId}`);
    }
};
  
  // Delete language by ID
  const deleteLanguage = async (languageId) => {
    try {
        if (!languageId || isNaN(languageId)) {
            throw new Error('Invalid language ID provided');
        }

        const deletedRows = await knex('languages').where('language_id', languageId).del();
        if (!deletedRows) {
            throw new Error(`Language with ID ${languageId} not found`);
        }

        console.log(`Language with ID ${languageId} deleted successfully`);
        return { success: true, message: 'Language deleted successfully' };
    } catch (error) {
        console.error(`Error deleting language with ID ${languageId}:`, error.message);
        throw new Error(`Failed to delete language with ID ${languageId}`);
    }
};

  module.exports = {
    createLanguage,
    getLanguages,
    getLanguageById,
    updateLanguage,
    deleteLanguage
};