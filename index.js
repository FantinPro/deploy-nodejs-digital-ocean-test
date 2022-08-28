
const express = require("express");
const cors = require("cors");
const { Client } = require('whatsapp-web.js');

let qrCode = null

// Use the saved values
const client = new Client({
    puppeteer: {
        args: ['--no-sandbox'],
    }
});

const app = express();

app.use(
    cors({
        origin: "*",
    }),
);

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.static('./dist'));

app.get("/qrcode", (req, res) => {
    res.send(qrCode);
});

const port = 5000

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

client.on('qr', qr => {
    qrCode = qr;
});

client.on('ready', () => {
    console.log('Client is ready!!!!');
});

client.on('message', message => {
    console.log('Message received');
    console.log(message.body)
    message.reply('Hello!');
})

client.on('disconnected', (reason) => {
    console.log('Client disconnected:', reason);
    console.log(reason)
    client.initialize().then(() => {
        console.log('Client reconnected!');
    })
    .catch(err => {
        console.log('Client reconnect failed:', err);
    })
})

client.initialize();