export default async function handler(req, res) {
    // إعدادات الـ CORS الكاملة
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'الرابط مطلوب / URL is required' });

    try {
        // نداء السيرفر بالـ Headers الصارمة اللي بيطلبها Cobalt حالياً
        const response = await fetch('https://api.cobalt.tools/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: url,
                videoQuality: '720' // الجودة الافتراضية المدعومة بـ الكود الجديد
            })
        });

        // تحويل الاستجابة لنص أولاً عشان نضمن إننا نقرأ أي خطأ وميطلعش [object Object]
        const resText = await response.text();
        let data;
        
        try {
            data = JSON.parse(resText);
        } catch (e) {
            return res.status(500).json({ error: 'السيرفر الخارجي أرسل استجابة غير صالحة.' });
        }

        // لو السيرفر رجع خطأ صريح مرره للواجهة فوراً كنص واضح
        if (!response.ok || data.status === 'error' || data.error) {
            return res.status(400).json({ error: data.text || data.error || 'الرابط محمى أو غير مدعوم حالياً' });
        }

        // إرسال البيانات السليمة للفرونت إند
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: 'فشل الاتصال بسيرفر المعالجة الذكي.' });
    }
}
