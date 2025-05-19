document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sourceText = document.getElementById('source-text');
    const targetText = document.getElementById('target-text');
    const sourceLanguage = document.getElementById('source-language');
    const targetLanguage = document.getElementById('target-language');
    const translateBtn = document.getElementById('translate-btn');
    const clearSourceBtn = document.getElementById('clear-source');
    const copyTargetBtn = document.getElementById('copy-target');
    const swapBtn = document.getElementById('swap-btn');
    const sourceCharCount = document.getElementById('source-char-count');
    const targetCharCount = document.getElementById('target-char-count');
    const detectedLanguage = document.getElementById('detected-language');
    const detectedLanguageName = document.getElementById('detected-language-name');

    // Language names for display
    const languageNames = {};
    Array.from(sourceLanguage.options).forEach(option => {
        languageNames[option.value] = option.textContent;
    });

    // Event listeners
    sourceText.addEventListener('input', updateSourceCharCount);
    clearSourceBtn.addEventListener('click', clearSource);
    copyTargetBtn.addEventListener('click', copyTarget);
    translateBtn.addEventListener('click', performTranslation);
    swapBtn.addEventListener('click', swapLanguages);

    // Auto translate (after a delay when typing)
    let typingTimer;
    sourceText.addEventListener('input', () => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(performTranslation, 1000);
    });

    // Character count functions
    function updateSourceCharCount() {
        const count = sourceText.value.length;
        sourceCharCount.textContent = `${count} character${count !== 1 ? 's' : ''}`;
    }

    function updateTargetCharCount() {
        const count = targetText.value.length;
        targetCharCount.textContent = `${count} character${count !== 1 ? 's' : ''}`;
    }

    // Clear source text
    function clearSource() {
        sourceText.value = '';
        updateSourceCharCount();
        targetText.value = '';
        updateTargetCharCount();
        detectedLanguage.classList.add('hidden');
    }

    // Copy target text
    function copyTarget() {
        if (targetText.value) {
            navigator.clipboard.writeText(targetText.value)
                .then(() => {
                    // Show visual feedback
                    const originalText = copyTargetBtn.innerHTML;
                    copyTargetBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        copyTargetBtn.innerHTML = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    alert('Failed to copy text. Please try again.');
                });
        }
    }

    // Swap languages
    function swapLanguages() {
        // Cannot swap if source language is auto
        if (sourceLanguage.value === 'auto') {
            return;
        }
        
        // Swap language selections
        const tempLang = sourceLanguage.value;
        sourceLanguage.value = targetLanguage.value;
        targetLanguage.value = tempLang;
        
        // Swap text content
        const tempText = sourceText.value;
        sourceText.value = targetText.value;
        targetText.value = tempText;
        
        // Update character counts
        updateSourceCharCount();
        updateTargetCharCount();
        
        // If source text isn't empty, re-translate
        if (sourceText.value) {
            performTranslation();
        }
    }

    // Translation function
    function performTranslation() {
        const text = sourceText.value.trim();
        
        if (!text) {
            targetText.value = '';
            updateTargetCharCount();
            detectedLanguage.classList.add('hidden');
            return;
        }
        
        // Visual feedback that translation is in progress
        targetText.value = 'Translating...';
        translateBtn.disabled = true;
        translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Translating...';
        
        // Make API request
        fetch('/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                source_lang: sourceLanguage.value,
                target_lang: targetLanguage.value
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Translation request failed');
            }
            return response.json();
        })
        .then(data => {
            targetText.value = data.translated_text;
            updateTargetCharCount();
            
            // Show detected language if auto-detect was used
            if (sourceLanguage.value === 'auto' && data.detected_language) {
                const langName = languageNames[data.detected_language] || data.detected_language;
                detectedLanguageName.textContent = langName;
                detectedLanguage.classList.remove('hidden');
            } else {
                detectedLanguage.classList.add('hidden');
            }
        })
        .catch(error => {
            console.error('Translation error:', error);
            targetText.value = 'Error occurred during translation. Please try again.';
        })
        .finally(() => {
            // Reset button state
            translateBtn.disabled = false;
            translateBtn.innerHTML = '<i class="fas fa-language"></i> Translate';
        });
    }

    // Initialize character counters
    updateSourceCharCount();
    updateTargetCharCount();
}); 