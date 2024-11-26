// Add new vocabulary word
const addVocabularyWord = async (languageId, word, meaning) => {
    try {
      await knex('vocabulary').insert({ language_id: languageId, word, meaning });
      console.log('Vocabulary word added successfully');
    } catch (error) {
      console.error('Error adding vocabulary word:', error);
    }
  };
  
  // Get vocabulary by language
  const getVocabularyByLanguage = async (languageId) => {
    try {
      const vocabulary = await knex('vocabulary').where('language_id', languageId);
      console.log('Vocabulary retrieved:', vocabulary);
      return vocabulary;
    } catch (error) {
      console.error('Error retrieving vocabulary:', error);
    }
  };
  