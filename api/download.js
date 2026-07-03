// api/download.js
export default async function handler(req, res) {
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
        // تحديث إعدادات Cobalt لتتوافق مع التحديثات الجديدة وتجنب الحظر
        const response = await fetch('https://api.cobalt.tools/api/json', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Origin': 'https://cobalt.tools',
                'Referer': 'https://cobalt.tools/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            body: JSON.stringify({
                url: url,
                vQuality: '720', // الاختصار الجديد للجودة في التحديث الأخير
                filenamePattern: 'nerd' // النمط الأكثر استقراراً للسحب
            })
        });

        const data = await response.json();

        // لو Cobalt رجع برضه حظر أو خطأ
        if (!response.ok || data.status === 'error') {
            return res.status(400).json({ error: data.text || 'السيرفر مضغوط حالياً، جرب رابط آخر أو أعد المحاولة.' });
        }

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: 'عطل في شبكة المعالجة، يرجى المحاولة مرة أخرى لاحقاً.' });
    }
}
