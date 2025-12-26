const http = require('http');
const { handleGet, handlePost } = require('./handlers')
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    try {
        const parsedUrl = new URL(req.url, `https://${req.headers.host}`)
        const pathname = parsedUrl.pathname

        if (req.method === 'GET') {
            handleGet(req, res, pathname)
        } else if (req.method === 'POST' && pathname === '/submit') {
            handlePost(req, res)
        } else {
            handleGet(req, res, '/404')
        }
    } catch (error) {
        console.error('Critical Server Errror:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('500 Internal Server Error')
    }
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    console.log(`Open http://localhost:${PORT} in your browser`)
})