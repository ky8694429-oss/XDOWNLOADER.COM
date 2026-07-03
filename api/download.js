export default async function handler(req, res) {
    // إعدادات الـ CORS عشان الموقع يشتغل بدون مشاكل أمان
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'الرابط مطلوب' });

    try {
        const response = await fetch('https://api.cobalt.tools/api/json', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: url,
                vQuality: '720',
                filenamePattern: 'nerd'
            })
        });

        const data = await response.json();

        // هنا بنرجع الـ data زي ما هي، والواجهة (الـ HTML) هتتصرف
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ status: 'error', text: 'فشل الاتصال بسيرفر المعالجة الخارجي.' });
    }
}
