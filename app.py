from flask import Flask, request, jsonify
from flask_cors import CORS
import yt_dlp
import os

app = Flask(__name__)
# تفعيل الـ CORS عشان الفرونت-إند يكلم الباك-إند بدون أي مشاكل أمان
CORS(app)

@app.route('/api/download', methods=['POST'])
def download_video():
    data = request.json
    video_url = data.get('url')
    
    if not video_url:
        return jsonify({'status': 'error', 'message': 'الرابط مطلوب'}), 400

    # إعدادات الـ yt-dlp لجلب الروابط المباشرة بأعلى جودة
    ydl_opts = {
        'format': 'best',  # يجيب أفضل جودة مدمجة (فيديو + صوت) علطول
        'quiet': True,
        'no_warnings': True,
        'allowed_extractors': ['default'],
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # استخراج البيانات بدون تحميل الملف على سيرفرك (عشان يوفر بندوتش ومساحة)
            info = ydl.extract_info(video_url, download=False)
            
            # تجهيز البيانات اللي الفرونت إند محتاجها
            response_data = {
                'status': 'success',
                'title': info.get('title', 'مقطع مستخرَج'),
                'thumbnail': info.get('thumbnail', 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500'),
                'video_url': info.get('url'),  # الرابط المباشر الناري للتحميل
                'duration': info.get('duration'),
                'uploader': info.get('uploader')
            }
            
            # دعم خاص للتيك توك لو كان ألبوم صور (Carousel)
            if 'entries' in info:
                # لو الرابط جواه كذا ملف أو صور
                response_data['picker'] = [{'url': entry.get('url')} for entry in info['entries'] if entry.get('url')]
            
            return jsonify(response_data)

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    # رن السيرفر على بورت 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
