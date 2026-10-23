const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend files from the 'public' directory[cite: 10]
app.use(express.static(path.join(__dirname, 'public')));

// Explicit route to serve index.html when visiting the homepage[cite: 10]
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Proxy endpoint to handle web requests
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('URL parameter is required.');
    }

    try {
        const response = await fetch(targetUrl, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
            }
        });
        
        const contentType = response.headers.get('content-type');
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }

        const body = await response.text();
        res.send(body);
    } catch (err) {
        res.status(500).send(`Error fetching page: ${err.message}`);
    }
});

app.listen(PORT, () => console.log(`Proxy browser running on port ${PORT}`));
