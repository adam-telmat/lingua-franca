// Voice Recognition & Speech Synthesis for Lingua-Franca
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

// Voice recognition setup
let recognition;
let recognizing = false;

// Initialize speech recognition
function initVoiceRecognition() {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    
    // When recognition results are available
    recognition.onresult = function(event) {
        const result = event.results[0][0].transcript;
        document.getElementById('source-text').value = result;
    };
    
    // When recognition ends
    recognition.onend = function() {
        recognizing = false;
        document.getElementById('mic-btn').classList.remove('active');
        
        // Auto-translate after voice input
        if (document.getElementById('source-text').value.trim() !== '') {
            translateText();
        }
    };
}

// Toggle speech recognition
function toggleSpeechRecognition() {
    // Initialize if not already done
    if (!recognition) initVoiceRecognition();
    
    if (recognizing) {
        recognition.stop();
        recognizing = false;
        document.getElementById('mic-btn').classList.remove('active');
    } else {
        // Set language based on source language selection
        const sourceLang = document.getElementById('source-lang').value;
        if (sourceLang !== 'auto') {
            recognition.lang = sourceLang;
        }
        
        recognition.start();
        recognizing = true;
        document.getElementById('mic-btn').classList.add('active');
    }
}

// Speak translated text
function speakTranslation() {
    const text = document.getElementById('target-text').value;
    const lang = document.getElementById('target-lang').value;
    
    if (text && lang) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        window.speechSynthesis.speak(utterance);
        
        // Visual feedback
        document.getElementById('speaker-btn').classList.add('active');
        utterance.onend = function() {
            document.getElementById('speaker-btn').classList.remove('active');
        };
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to the buttons
    document.getElementById('mic-btn').addEventListener('click', toggleSpeechRecognition);
    document.getElementById('speaker-btn').addEventListener('click', speakTranslation);
}); 