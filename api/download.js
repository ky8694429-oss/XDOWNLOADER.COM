export default async function handler(req, res) {
    // إعدادات الـ CORS الكاملة لمنع أي تعارض مع المتصفحات
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'الرابط مطلوب / URL is required' });

    try {
        // التحديث الإستراتيجي: التوجه مباشرة للـ API الحالي والروت الأساسي لـ Cobalt
        const response = await fetch('https://api.cobalt.tools/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: url,
                videoQuality: '720', // التحديث الجديد للمتغيرات (videoQuality بدلاً من vQuality)
                filenamePattern: 'classic'
            })
        });

        const data = await response.json();

        // تمرير البيانات مباشرة للواجهة الأمامية الفخمة بتاعتك
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ status: 'error', text: 'فشل الاتصال الخارجي بسيرفر المعالجة الذكي.' });
    }
}
