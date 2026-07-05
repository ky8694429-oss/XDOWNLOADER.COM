from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # لفك حظر الـ CORS تماماً عن موقعك

@app.route('/api/fetch', list_methods=['POST'])
def fetch_media():
    data = request.json
    target_url = data.get('url')
    
    if not target_url:
        return jsonify({'status': 'error', 'text': 'الرابط مطلوب'}), 400
        
    try:
        # السيرفر بيكلم الـ API بأمان وبدون أي حظر متصفحات
        response = requests.post('https://api.cobalt.tools/api/json', json={
            'url': target_url,
            'vQuality': '720',
            'vCodec': 'h264',
            'isAudioOnly': False,
            'isNoTTWatermark': True
        }, headers={
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }, timeout=10)
        
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'status': 'error', 'text': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
