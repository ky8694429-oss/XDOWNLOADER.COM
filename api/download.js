// api/download.js
export default async function handler(req, res) {
    // تفعيل إعدادات الـ CORS الكاملة لمنع حظر المتصفح
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'الطريقة المستخدمة غير مسموحة' });
    }

    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'الرابط مطلوب' });
    }

    try {
        // الاتصال المباشر والآمن بسيرفر المعالجة لـ Cobalt من جهة السيرفر
        const response = await fetch('https://api.cobalt.tools/api/json', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            body: JSON.stringify({
                url: url,
                videoQuality: '720', // أعلى جودة مدمجة الصوت متوفرة ومستقرة
                downloadMode: 'auto',
                audioFormat: 'mp3',
                filenamePattern: 'classic'
            })
        });

        if (!response.ok) {
            throw new Error('فشل السيرفر الخارجي في الاستجابة');
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: 'حدث خطأ أثناء معالجة طلبك، تأكد من صحة الرابط وعموميته.' });
    }
}
