from flask import Flask, render_template, request, jsonify
import requests
import os
import json
import time
import random
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# List of supported languages (abbreviated for readability)
LANGUAGES = {
    'auto': 'Detect Language',
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'am': 'Amharic',
    'ar': 'Arabic',
    'hy': 'Armenian',
    'az': 'Azerbaijani',
    'eu': 'Basque',
    'be': 'Belarusian',
    'bn': 'Bengali',
    'bs': 'Bosnian',
    'bg': 'Bulgarian',
    'ca': 'Catalan',
    'ceb': 'Cebuano',
    'ny': 'Chichewa',
    'zh-cn': 'Chinese (Simplified)',
    'zh-tw': 'Chinese (Traditional)',
    'co': 'Corsican',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'en': 'English',
    'eo': 'Esperanto',
    'et': 'Estonian',
    'tl': 'Filipino',
    'fi': 'Finnish',
    'fr': 'French',
    'fy': 'Frisian',
    'gl': 'Galician',
    'ka': 'Georgian',
    'de': 'German',
    'el': 'Greek',
    'gu': 'Gujarati',
    'ht': 'Haitian Creole',
    'ha': 'Hausa',
    'haw': 'Hawaiian',
    'iw': 'Hebrew',
    'hi': 'Hindi',
    'hmn': 'Hmong',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'ig': 'Igbo',
    'id': 'Indonesian',
    'ga': 'Irish',
    'it': 'Italian',
    'ja': 'Japanese',
    'jw': 'Javanese',
    'kn': 'Kannada',
    'kk': 'Kazakh',
    'km': 'Khmer',
    'ko': 'Korean',
    'ku': 'Kurdish (Kurmanji)',
    'ky': 'Kyrgyz',
    'lo': 'Lao',
    'la': 'Latin',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'lb': 'Luxembourgish',
    'mk': 'Macedonian',
    'mg': 'Malagasy',
    'ms': 'Malay',
    'ml': 'Malayalam',
    'mt': 'Maltese',
    'mi': 'Maori',
    'mr': 'Marathi',
    'mn': 'Mongolian',
    'my': 'Myanmar (Burmese)',
    'ne': 'Nepali',
    'no': 'Norwegian',
    'ps': 'Pashto',
    'fa': 'Persian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'pa': 'Punjabi',
    'ro': 'Romanian',
    'ru': 'Russian',
    'sm': 'Samoan',
    'gd': 'Scots Gaelic',
    'sr': 'Serbian',
    'st': 'Sesotho',
    'sn': 'Shona',
    'sd': 'Sindhi',
    'si': 'Sinhala',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'so': 'Somali',
    'es': 'Spanish',
    'su': 'Sundanese',
    'sw': 'Swahili',
    'sv': 'Swedish',
    'tg': 'Tajik',
    'ta': 'Tamil',
    'te': 'Telugu',
    'th': 'Thai',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'ur': 'Urdu',
    'uz': 'Uzbek',
    'vi': 'Vietnamese',
    'cy': 'Welsh',
    'xh': 'Xhosa',
    'yi': 'Yiddish',
    'yo': 'Yoruba',
    'zu': 'Zulu'
}

# Demo translations for common phrases in multiple languages
DEMO_TRANSLATIONS = {
    # English phrases
    "Hello": {
        "fr": "Bonjour",
        "es": "Hola",
        "de": "Hallo",
        "it": "Ciao",
        "ja": "こんにちは",
        "ru": "Привет",
        "zh-cn": "你好",
        "ar": "مرحبا",
    },
    "How are you?": {
        "fr": "Comment allez-vous?",
        "es": "¿Cómo estás?",
        "de": "Wie geht es dir?",
        "it": "Come stai?",
        "ja": "お元気ですか？",
        "ru": "Как дела?",
        "zh-cn": "你好吗？",
        "ar": "كيف حالك؟",
    },
    "Thank you": {
        "fr": "Merci",
        "es": "Gracias",
        "de": "Danke",
        "it": "Grazie",
        "ja": "ありがとう",
        "ru": "Спасибо",
        "zh-cn": "谢谢",
        "ar": "شكرا",
    },
    "My name is": {
        "fr": "Je m'appelle",
        "es": "Me llamo",
        "de": "Ich heiße",
        "it": "Mi chiamo",
        "ja": "私の名前は",
        "ru": "Меня зовут",
        "zh-cn": "我的名字是",
        "ar": "اسمي هو",
    },
    "What time is it?": {
        "fr": "Quelle heure est-il?",
        "es": "¿Qué hora es?",
        "de": "Wie spät ist es?",
        "it": "Che ora è?",
        "ja": "今何時ですか？",
        "ru": "Который час?",
        "zh-cn": "现在几点了？",
        "ar": "كم الساعة؟",
    },
    "I love you": {
        "fr": "Je t'aime",
        "es": "Te amo",
        "de": "Ich liebe dich",
        "it": "Ti amo",
        "ja": "愛しています",
        "ru": "Я люблю тебя",
        "zh-cn": "我爱你",
        "ar": "أحبك",
    },
    "Good morning": {
        "fr": "Bonjour",
        "es": "Buenos días",
        "de": "Guten Morgen",
        "it": "Buongiorno",
        "ja": "おはようございます",
        "ru": "Доброе утро",
        "zh-cn": "早上好",
        "ar": "صباح الخير",
    },
    "Good evening": {
        "fr": "Bonsoir",
        "es": "Buenas noches",
        "de": "Guten Abend",
        "it": "Buonasera",
        "ja": "こんばんは",
        "ru": "Добрый вечер",
        "zh-cn": "晚上好",
        "ar": "مساء الخير",
    },
    "The weather is nice today": {
        "fr": "Le temps est beau aujourd'hui",
        "es": "El clima está agradable hoy",
        "de": "Das Wetter ist heute schön",
        "it": "Il tempo è bello oggi",
        "ja": "今日は天気が良いです",
        "ru": "Сегодня хорошая погода",
        "zh-cn": "今天天气真好",
        "ar": "الطقس جميل اليوم",
    },
    "Where is the bathroom?": {
        "fr": "Où sont les toilettes?",
        "es": "¿Dónde está el baño?",
        "de": "Wo ist die Toilette?",
        "it": "Dov'è il bagno?",
        "ja": "お手洗いはどこですか？",
        "ru": "Где находится ванная комната?",
        "zh-cn": "洗手间在哪里？",
        "ar": "أين الحمام؟",
    },
    "Happy birthday": {
        "fr": "Joyeux anniversaire",
        "es": "Feliz cumpleaños",
        "de": "Alles Gute zum Geburtstag",
        "it": "Buon compleanno",
        "ja": "お誕生日おめでとう",
        "ru": "С днем рождения",
        "zh-cn": "生日快乐",
        "ar": "عيد ميلاد سعيد",
    },
    "Hola qué tal": {
        "en": "Hi how are things",
        "fr": "Salut comment ça va",
        "de": "Hallo wie geht's",
        "it": "Ciao come va",
        "ja": "やあ調子はどう",
        "ru": "Привет как дела",
        "zh-cn": "嗨你好吗",
        "ar": "مرحبا كيف الحال",
    }
}

def translate_text(text, source_lang='auto', target_lang='en'):
    """
    Translate text using Google Translate API
    """
    url = "https://translate.googleapis.com/translate_a/single"
    
    params = {
        "client": "gtx",
        "sl": "auto" if source_lang == "auto" else source_lang,
        "tl": target_lang,
        "dt": "t",
        "q": text
    }
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Referer": "https://translate.google.com/",
        "DNT": "1",
    }
    
    # Add a small delay to avoid rate limiting
    time.sleep(0.5)
    
    response = requests.get(url, params=params, headers=headers, timeout=10)
    
    if response.status_code == 200:
        result = response.json()
        translated_text = "".join([sentence[0] for sentence in result[0]])
        detected_language = result[2] if source_lang == "auto" else source_lang
        return {
            "translated_text": translated_text,
            "detected_language": detected_language
        }
    else:
        print(f"Translation failed with status code: {response.status_code}")
        print(f"Response content: {response.text}")
        raise Exception(f"Translation failed with status code: {response.status_code}")


@app.route('/')
def index():
    return render_template('index.html', languages=LANGUAGES)


@app.route('/translate', methods=['POST'])
def translate_text_route():
    try:
        data = request.get_json()
        
        text = data.get('text', '')
        source_lang = data.get('source_lang', 'auto')
        target_lang = data.get('target_lang', 'en')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
            
        # Perform translation
        result = translate_text(text, source_lang, target_lang)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True) 