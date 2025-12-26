function sanitize(str) {
    if(!str) return '';
    return str.replace(/</g, "&lt;");
}

module.exports = { sanitize}