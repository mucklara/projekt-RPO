// Fetch Guess The Meaning topics dynamically
async function fetchTopics(languageCode) {
    try {
        const response = await fetch(`/guess-the-meaning/${languageCode}`); // Replace with the correct backend route
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('No topics found for the selected language.');
            } else if (response.status >= 500) {
                throw new Error('Server error. Please try again later.');
            } else {
                throw new Error('Failed to fetch topics.');
            }
        }
        const topics = await response.json();
        populateTopics(topics);
    } catch (error) {
        console.error('Error fetching topics:', error);
        displayError(error.message);
    }
}

// Populate the topics dynamically
function populateTopics(topics) {
    const topicsContainer = document.querySelector('.topics');
    topicsContainer.innerHTML = '';

    if (topics.length === 0) {
        displayError('No topics available.');
        return;
    }

    topics.forEach(topic => {
        const link = document.createElement('a');
        link.href = topic.link;
        link.className = 'topic-card';
        link.textContent = topic.name;
        topicsContainer.appendChild(link);
    });
}

// Display an error message
function displayError(message) {
    const topicsContainer = document.querySelector('.topics');
    topicsContainer.innerHTML = `<p class="error">${message}</p>`;
}

// Initialize the page
function initializePage() {
    const languageCode = document.body.lang === 'mk' ? 'MKD' : 'SLO';
    fetchTopics(languageCode);
}

// Run on page load
document.addEventListener('DOMContentLoaded', initializePage);
