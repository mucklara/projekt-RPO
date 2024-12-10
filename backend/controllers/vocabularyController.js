const knex = require('../setupDatabase');

// Add a new vocabulary word
const addVocabularyWord = async (languageId, word, translation, hint, level, imageUrl) => {
  try {
    await knex('vocabulary').insert({ 
      language_id: languageId, 
      word, 
      translation, 
      hint, 
      level, 
      image_url: imageUrl 
    });
    console.log('Vocabulary word added successfully');
  } catch (error) {
    console.error('Error adding vocabulary word:', error.message);
    throw new Error('Failed to add vocabulary word');
  }
};

// Get all vocabulary words by language
const getVocabularyByLanguage = async (languageId) => {
  try {
    const vocabulary = await knex('vocabulary').where('language_id', languageId);
    console.log('Vocabulary retrieved:', vocabulary);
    return vocabulary;
  } catch (error) {
    console.error('Error retrieving vocabulary:', error.message);
    throw new Error('Failed to retrieve vocabulary');
  }
};

// Get a specific vocabulary word by its ID
const getVocabularyById = async (vocabularyId) => {
  try {
    const vocabulary = await knex('vocabulary').where('vocabulary_id', vocabularyId).first();
    if (!vocabulary) {
      throw new Error('Vocabulary word not found');
    }
    console.log('Vocabulary word retrieved:', vocabulary);
    return vocabulary;
  } catch (error) {
    console.error('Error retrieving vocabulary word:', error.message);
    throw new Error('Failed to retrieve vocabulary word');
  }
};

// Update a vocabulary word
const updateVocabularyWord = async (vocabularyId, word, translation, hint, level, imageUrl) => {
  try {
    const updatedRows = await knex('vocabulary')
      .where('vocabulary_id', vocabularyId)
      .update({
        word,
        translation,
        hint,
        level,
        image_url: imageUrl
      });

    if (updatedRows === 0) {
      throw new Error('Vocabulary word not found or no changes made');
    }

    console.log('Vocabulary word updated successfully');
  } catch (error) {
    console.error('Error updating vocabulary word:', error.message);
    throw new Error('Failed to update vocabulary word');
  }
};

// Delete a vocabulary word
const deleteVocabularyWord = async (vocabularyId) => {
  try {
    const deletedRows = await knex('vocabulary').where('vocabulary_id', vocabularyId).del();
    
    if (deletedRows === 0) {
      throw new Error('Vocabulary word not found');
    }

    console.log('Vocabulary word deleted successfully');
  } catch (error) {
    console.error('Error deleting vocabulary word:', error.message);
    throw new Error('Failed to delete vocabulary word');
  }
};

module.exports = {
  addVocabularyWord,
  getVocabularyByLanguage,
  getVocabularyById,
  updateVocabularyWord,
  deleteVocabularyWord
};
