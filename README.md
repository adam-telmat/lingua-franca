# Lingua Franca

A text translation tool powered by Google Translate API.

## Overview

Lingua Franca is a web application that allows users to translate text between different languages using the Google Translate API. The application features a clean, intuitive interface where users can:

- Input text in any language on the left side
- Choose source and target languages from dropdown menus
- Use automatic language detection when the source language is unknown
- View the translated text on the right side

## Features

- Real-time text translation
- Support for multiple languages
- Automatic language detection
- Responsive and user-friendly interface

## Technologies Used

- Backend: Python with Flask framework
- Frontend: HTML, CSS, JavaScript
- Translation: Google Translate API
- Styling: Custom CSS

## Installation and Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/lingua-franca.git
cd lingua-franca
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install the required dependencies:
```bash
pip install -r requirements.txt
```

4. Run the application:
```bash
flask run
```

5. Open your browser and navigate to `http://localhost:5000`

## Usage

1. Enter the text you want to translate in the left text area
2. Select the source language (or use "Auto Detect")
3. Select the target language
4. The translation will appear in the right text area

## License

This project is licensed under the terms of the license included in the repository.