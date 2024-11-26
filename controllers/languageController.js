// Create a new language
const createLanguage = async (languageName) => {
    try {
      await knex('languages').insert({ language_name: languageName });
      console.log('Language created successfully');
    } catch (error) {
      console.error('Error creating language:', error);
    }
  };
  
  // Get all languages
  const getLanguages = async () => {
    try {
      const languages = await knex('languages').select('*');
      console.log('Languages retrieved:', languages);
      return languages;
    } catch (error) {
      console.error('Error retrieving languages:', error);
    }
  };
  
  // Get language by ID
  const getLanguageById = async (languageId) => {
    try {
      const language = await knex('languages').where('language_id', languageId).first();
      console.log('Language retrieved:', language);
      return language;
    } catch (error) {
      console.error('Error retrieving language:', error);
    }
  };
  
  // Update language name
  const updateLanguage = async (languageId, newName) => {
    try {
      await knex('languages').where('language_id', languageId).update({ language_name: newName });
      console.log('Language updated successfully');
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };
  
  // Delete language by ID
  const deleteLanguage = async (languageId) => {
    try {
      await knex('languages').where('language_id', languageId).del();
      console.log('Language deleted successfully');
    } catch (error) {
      console.error('Error deleting language:', error);
    }
  };
  
  module.exports = {
    createLanguage,
    getLanguages,
    getLanguageById,
    updateLanguage,
    deleteLanguage
};