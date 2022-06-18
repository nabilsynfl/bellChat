const http = require('http');
const express = require('express');
const {Server} = require("socket.io");
const port = 3000;
const host = 'localhost';
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const escapeHtml = (text) => 
{
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

const nl2br = (str, is_xhtml) => 
{
    if (typeof str === 'undefined' || str === null)
        return '';

    const breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

io.on('connection', (socket) => 
{
    socket.on('chat message', (msg) => 
    {
        io.emit('chat message', {nama: escapeHtml(msg.nama), pesan: nl2br(escapeHtml(msg.pesan)), waktu: msg.waktu});
    });
});

server.listen(port, host, () =>
{
    console.log(`Server berjalan di http://${host}:${port}`)
});

app.use(express.static(__dirname + '/public'));