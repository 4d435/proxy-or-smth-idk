const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static UI files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Proxy endpoint that fetches the web page
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send('URL parameter is required.');

    try {
        const response = await fetch(targetUrl, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' 
            }
        });
        
        const contentType = response.headers.get('content-type');
        if (contentType) res.setHeader('Content-Type', contentType);

        const body = await response.text();
        res.send(body);
    } catch (err) {
        res.status(500).send(`Error fetching page: ${err.message}`);
    }
});

app.listen(PORT, () => console.log(`Proxy browser running on port ${PORT}`));