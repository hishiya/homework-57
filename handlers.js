const fs = require('fs')
const path = require('path')
const querystring = require('querystring')
const { sanitize } = require('./utils')

function serveStaticFile(res, fileName, statusCode = 200, replacements = {}) {
    const filePath = path.join(__dirname, 'views', fileName)

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('File read error:', err)
            res.writeHead(500, { 'Content-Type': 'text/plain' })
            res.end('Internal Server Error: Template not found')
            return;
        }

        if (replacements) {
            for (const key in replacements) {
                data = data.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key])
            }
        }

        res.writeHead(statusCode, {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Content-Type-Options': 'nosniff'
        })
        res.end(data)
    })
}

function handleGet(req, res, pathName) {
    switch (pathName) {
        case '/':
            serveStaticFile(res, 'index.html')
            break;
        case '/about':
            serveStaticFile(res, 'about.html')
            break;
        case '/contact':
            serveStaticFile(res, 'contact.html');
            break;
        default: 
            serveStaticFile(res, '404.html', 404);
            break;
    }
}

function handlePost(req, res) {
    const MAX_SIZE = 1 * 1024 * 1024;
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
        if (Buffer.byteLength(body) > MAX_SIZE) {
            res.writeHead(413, { 'Content-Type': 'text/plain'})
            res.end('413 Payload Too Large')
            req.destroy();
        }
    })

    req.on('end', () => {
        const parsedData = querystring.parse(body)
        const name = sanitize(parsedData.name)
        const email = sanitize(parsedData.email)

        if (!name || !email) {
            res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' })
            return res.end('400 Bad Request: Name and Email are required.')
        }

        serveStaticFile(res, 'success.html', 200, {
            name: name,
            email: email
        })
    })
}

module.exports = { handleGet, handlePost}