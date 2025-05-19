// Main functionality for Lingua-Franca translation app

// Store translation history
let translationHistory = [];
const MAX_HISTORY = 10;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Load translation history from localStorage if available
    loadTranslationHistory();
    
    // Set up event listeners
    document.getElementById('translate-btn').addEventListener('click', translateText);
    document.getElementById('swap-btn').addEventListener('click', swapLanguages);
    document.getElementById('source-text').addEventListener('input', debounce(autoTranslate, 1000));
    
    // Set up keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+Enter to translate
        if (e.ctrlKey && e.key === 'Enter') {
            translateText();
        }
    });

    // Set up theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        // Initialize theme from localStorage or time-based
        initializeTheme();
    } else {
        // Just update based on time if no toggle exists
        updateThemeBasedOnTime();
    }
    
    // Initialize history panel if it exists
    if (document.getElementById('history-btn')) {
        document.getElementById('history-btn').addEventListener('click', toggleHistoryPanel);
    }
});

// Function to translate text
function translateText() {
    const sourceText = document.getElementById('source-text').value.trim();
    const sourceLang = document.getElementById('source-lang').value;
    const targetLang = document.getElementById('target-lang').value;
    
    if (!sourceText) return;
    
    // Show loading indicator
    const translateBtn = document.getElementById('translate-btn');
    const originalBtnText = translateBtn.innerHTML;
    translateBtn.innerHTML = '<span class="loading"></span>';
    translateBtn.disabled = true;
    
    // Make API request
    fetch('/translate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: sourceText,
            source_lang: sourceLang,
            target_lang: targetLang
        })
    })
    .then(response => response.json())
    .then(data => {
        // Update the target text area with the translation
        const targetTextArea = document.getElementById('target-text');
        targetTextArea.value = data.translated_text;
        targetTextArea.classList.add('fade-in');
        
        // If language was auto-detected, update the source language dropdown
        if (sourceLang === 'auto' && data.detected_language) {
            const detectedLang = data.detected_language;
            updateDetectedLanguage(detectedLang);
        }
        
        // Add to history
        addToHistory(sourceText, data.translated_text, sourceLang, targetLang);
        
        // Reset animation class after animation completes
        setTimeout(() => {
            targetTextArea.classList.remove('fade-in');
        }, 500);
    })
    .catch(error => {
        console.error('Translation error:', error);
        alert('Translation failed: ' + error.message);
    })
    .finally(() => {
        // Reset button
        translateBtn.innerHTML = originalBtnText;
        translateBtn.disabled = false;
    });
}

// Function to auto-translate after user stops typing
function autoTranslate() {
    const sourceText = document.getElementById('source-text').value.trim();
    if (sourceText.length > 2) {  // Only auto-translate if text is long enough
        translateText();
    }
}

// Swap source and target languages
function swapLanguages() {
    const sourceLang = document.getElementById('source-lang');
    const targetLang = document.getElementById('target-lang');
    const sourceText = document.getElementById('source-text');
    const targetText = document.getElementById('target-text');
    
    // Don't swap if source language is set to auto
    if (sourceLang.value === 'auto') return;
    
    // Swap languages
    const tempLang = sourceLang.value;
    sourceLang.value = targetLang.value;
    targetLang.value = tempLang;
    
    // Swap text
    const tempText = sourceText.value;
    sourceText.value = targetText.value;
    targetText.value = tempText;
    
    // Add animation to swap button
    document.getElementById('swap-btn').classList.add('rotate');
    setTimeout(() => {
        document.getElementById('swap-btn').classList.remove('rotate');
    }, 300);
}

// Update detected language indicator
function updateDetectedLanguage(langCode) {
    const detectedLangElement = document.getElementById('detected-language');
    if (detectedLangElement) {
        const langName = LANGUAGES[langCode] || langCode;
        detectedLangElement.textContent = `Detected: ${langName}`;
        detectedLangElement.style.display = 'inline-block';
    }
}

// Add translation to history
function addToHistory(sourceText, translatedText, sourceLang, targetLang) {
    // Create history entry
    const historyEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        sourceText: sourceText,
        translatedText: translatedText,
        sourceLang: sourceLang,
        targetLang: targetLang
    };
    
    // Add to beginning of array
    translationHistory.unshift(historyEntry);
    
    // Limit history size
    if (translationHistory.length > MAX_HISTORY) {
        translationHistory.pop();
    }
    
    // Save to localStorage
    saveTranslationHistory();
    
    // Update history UI if panel is open
    updateHistoryPanel();
}

// Save history to localStorage
function saveTranslationHistory() {
    localStorage.setItem('translationHistory', JSON.stringify(translationHistory));
}

// Load history from localStorage
function loadTranslationHistory() {
    const savedHistory = localStorage.getItem('translationHistory');
    if (savedHistory) {
        try {
            translationHistory = JSON.parse(savedHistory);
        } catch (e) {
            console.error('Error loading translation history:', e);
            translationHistory = [];
        }
    }
}

// Toggle history panel
function toggleHistoryPanel() {
    const historyPanel = document.getElementById('history-panel');
    if (historyPanel.classList.contains('open')) {
        historyPanel.classList.remove('open');
    } else {
        updateHistoryPanel();
        historyPanel.classList.add('open');
    }
}

// Update history panel with current history
function updateHistoryPanel() {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    if (translationHistory.length === 0) {
        historyList.innerHTML = '<li class="history-empty">No translation history</li>';
        return;
    }
    
    translationHistory.forEach(entry => {
        const historyItem = document.createElement('li');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-source">${entry.sourceText.substring(0, 50)}${entry.sourceText.length > 50 ? '...' : ''}</div>
            <div class="history-target">${entry.translatedText.substring(0, 50)}${entry.translatedText.length > 50 ? '...' : ''}</div>
            <div class="history-meta">
                <span>${LANGUAGES[entry.sourceLang] || entry.sourceLang} → ${LANGUAGES[entry.targetLang] || entry.targetLang}</span>
                <span class="history-time">${formatTime(entry.timestamp)}</span>
            </div>
        `;
        
        // Add click event to restore this translation
        historyItem.addEventListener('click', () => {
            restoreTranslation(entry);
        });
        
        historyList.appendChild(historyItem);
    });
}

// Restore a translation from history
function restoreTranslation(entry) {
    document.getElementById('source-text').value = entry.sourceText;
    document.getElementById('target-text').value = entry.translatedText;
    
    // Set language selections if not "auto"
    if (entry.sourceLang !== 'auto') {
        document.getElementById('source-lang').value = entry.sourceLang;
    }
    document.getElementById('target-lang').value = entry.targetLang;
    
    // Close history panel
    document.getElementById('history-panel').classList.remove('open');
}

// Format timestamp for display
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Initialize theme from localStorage or time
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        // Use saved theme preference
        applyTheme(savedTheme);
        updateThemeToggleIcon(savedTheme);
    } else {
        // Use automatic time-based theme
        updateThemeBasedOnTime();
    }
}

// Toggle between light and dark theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Save preference to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Apply the theme
    applyTheme(newTheme);
    
    // Update icon
    updateThemeToggleIcon(newTheme);
}

// Apply a specific theme
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // Remove any forced theme based on time
    document.documentElement.removeAttribute('data-forced-theme');
}

// Update theme toggle icon
function updateThemeToggleIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('span');
        if (icon) {
            icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
        }
    }
}

// Update theme based on time of day
function updateThemeBasedOnTime() {
    const hour = new Date().getHours();
    const isDarkMode = hour < 6 || hour >= 18; // Dark mode at night (6pm-6am)
    
    // Only apply time-based theme if no manual preference exists
    if (!localStorage.getItem('theme')) {
        // We can force dark mode if it's nighttime, otherwise rely on system preference
        if (isDarkMode) {
            document.documentElement.setAttribute('data-forced-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-forced-theme');
        }
    }
}

// Utility function: Debounce to prevent excessive function calls
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
} 