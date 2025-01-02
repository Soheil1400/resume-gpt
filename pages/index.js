import {useState} from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css';
import {Grid2, TextField, ThemeProvider, Typography} from "@mui/material";
import globalTheme from "../themes/globalTheme";
import LoadingButton from '@mui/lab/LoadingButton';

export default function Home() {
    const [message, setMessage] = useState('');
    const [responses, setResponses] = useState([
        {
            role: 'assistant',
            content: `سلام! من یک کارشناس منابع انسانی هستم. لطفاً ابتدا نیازمندی‌های خود را ارسال کنید تا بتوانم رزومه‌ها را با توجه به آن بررسی کنم.`,
        },
    ]);
    const [fileContent, setFileContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUploadFile = async (e) => {
        const file = e.target.files[0];
        setLoading(true)
        if (file && file.type === 'application/pdf') {
            try {
                const formData = new FormData();
                formData.append('file', file);
                const response = await axios.post(
                    'https://api.pdf.co/v1/file/upload',
                    formData,
                    {
                        headers: {
                            'x-api-key': 'soheil.saedi1379@gmail.com_bg9lzufwTLiHYSd7jSFNwyZWrjnVXk3tvT9qN6RR9Qz6YY6haSHYRTJTwUl22IAc', // جایگزین با API Key خود
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                await handleFileChange(response.data.url)
            } catch (error) {
                setLoading(false)
                console.error('Error extracting text:', error);
                alert('An error occurred while processing the PDF file.');
            }
        } else {
            setLoading(false)
            alert('Please upload a valid PDF file.');
        }
    };

    const handleFileChange = async (url) => {
        try {
            const response = await axios.post(
                'https://api.pdf.co/v1/pdf/convert/to/text',
                {
                    url: url,
                    "inline": true,
                    "async": false
                },
                {
                    headers: {
                        'x-api-key': 'soheil.saedi1379@gmail.com_bg9lzufwTLiHYSd7jSFNwyZWrjnVXk3tvT9qN6RR9Qz6YY6haSHYRTJTwUl22IAc', // جایگزین با API Key خود
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setFileContent(response.data.body)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error('Error extracting text:', error);
            alert('An error occurred while processing the PDF file.');
        }
    };


    const sendMessage = async () => {
        if (!message.trim() && !fileContent) return;
        setLoading(true)
        setResponses((prev) => [
            ...prev,
            {role: 'user', content: message || 'File content sent.'},
        ]);
        setMessage('');

        try {
            const res = await axios.post('/api/chat', {
                message,
                fileContent,
            });

            const assistantResponse = res.data.response || 'File processed successfully';

            setResponses((prev) => [
                ...prev,
                {role: 'assistant', content: assistantResponse},
            ]);
            setLoading(false)
        } catch (error) {
            console.error('Error sending message:', error);
            setLoading(false)
        }
    };

    return (
        <ThemeProvider theme={globalTheme}>
            <Grid2 className={styles.container}>
                <Typography variant={'body1'} className={styles.title}>
                    {'سرچ هوشمند رزومه'}
                </Typography>
                <Grid2 className={styles.chatWindow}>
                    {responses.map((response, index) => (
                        <Typography
                            variant={'body1'}
                            key={index}
                            className={
                                response.role === 'user' ? styles.userMessage : styles.assistantMessage
                            }
                        >
            <span className={styles.bubble}>
              {response.content}
            </span>
                        </Typography>
                    ))}
                </Grid2>
                <TextField
                    sx={{width: '100%', my: 2}}
                    multiline
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="پیام خود را بنویسید ..."
                />
                <input type="file" onChange={handleUploadFile} className={styles.fileInput}/>
                <LoadingButton loading={loading} variant={'contained'} onClick={sendMessage} fullWidth={true}>
                    <Typography variant={'body1'}>
                        {'ارسال'}
                    </Typography>
                </LoadingButton>
            </Grid2>
        </ThemeProvider>
    );
}
