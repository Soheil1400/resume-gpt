import axios from 'axios';

let chatHistory = []; // حافظه موقت برای ذخیره تاریخچه چت

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { message, fileContent } = req.body;

        try {
            // پیام سیستمی اولیه
            if (chatHistory.length === 0) {
                chatHistory.push({
                    role: 'system',
                    content: `شما یک کارشناس منابع انسانی هستید. ابتدا نیازمندی‌های کاربر را دریافت کنید. سپس رزومه‌ها را بررسی کنید و هر رزومه‌ای که دریافت می‌کنید را برای مراحل بعد ذخیره کنید. فقط روی موضوعات مرتبط با رزومه تمرکز کنید.`,
                });
            }

            // اضافه کردن پیام کاربر
            if (message) {
                chatHistory.push({
                    role: 'user',
                    content: message,
                });
            }

            // اضافه کردن فایل اگر ارسال شده باشد
            if (fileContent) {
                chatHistory.push({
                    role: 'user',
                    content: `رزومه جدید برای بررسی:\n${fileContent}`,
                });
            }

            // ارسال تاریخچه به ChatGPT
            const payload = {
                model: "gpt-4o",
                store: true,
                messages: chatHistory,
            };

            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    },
                }
            );

            const assistantResponse = response.data.choices[0].message.content;

            // اضافه کردن پاسخ ChatGPT به تاریخچه
            chatHistory.push({
                role: 'assistant',
                content: assistantResponse,
            });

            res.status(200).json({ response: assistantResponse });
        } catch (error) {
            console.error('خطا در ارتباط با OpenAI:', error.message);
            res.status(500).json({ error: 'خطا در ارتباط با OpenAI API' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
