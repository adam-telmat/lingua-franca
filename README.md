# Lingua-Franca: Advanced Translation Application

![Lingua-Franca](https://img.shields.io/badge/Lingua--Franca-v1.0.0-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![Flask](https://img.shields.io/badge/Flask-2.0+-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

Lingua-Franca is a modern, powerful translation application built with Flask that leverages Google's translation infrastructure to provide high-quality translations between 100+ languages.

## 🌟 Features

- **Voice Recognition & Speech Synthesis**: Dictate text and hear translations spoken aloud
- **Auto Language Detection**: Automatically identify the source language
- **Auto-Translation**: Translate text as you type with intelligent debouncing
- **Translation History**: Save and restore previous translations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode**: Automatic theme switching based on time of day or system preference
- **Keyboard Shortcuts**: Quick access to common functions (Ctrl+Enter to translate)

## 🚀 Live Demo

You can try out the application at: [https://lingua-franca-demo.example.com](https://lingua-franca-demo.example.com)

## 📋 Requirements

- Python 3.8+
- Flask
- Requests
- python-dotenv

## 🔧 Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/lingua-franca.git
cd lingua-franca
```

2. Create and activate a virtual environment (optional but recommended)
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Run the application
```bash
python app.py
```

5. Open your browser and navigate to `http://localhost:5000`

## 🌐 How It Works

Lingua-Franca uses a direct integration with Google Translate's infrastructure to provide high-quality translations. It implements several advanced features:

### Translation Engine
The core translation functionality sends requests to Google's translation services, handling the response to extract translated text and detected languages.

### Voice Interface
The application implements the Web Speech API to enable voice input and output, providing a hands-free user experience.

### Responsive UI
The modern interface adapts to any screen size and includes animations, automatic theme switching, and an intuitive design pattern.

## 📝 Technical Details

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Python, Flask
- **Translation**: Google Translate (direct integration)
- **Storage**: Local browser storage for history

## 📚 API Reference

### POST `/translate`
Translates text between languages.

**Request Body**:
```json
{
  "text": "Hello world",
  "source_lang": "en",
  "target_lang": "fr"
}
```

**Response**:
```json
{
  "translated_text": "Bonjour le monde",
  "detected_language": "en"
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Google for their powerful translation infrastructure
- The Flask team for their excellent web framework
- All contributors who have helped improve this project