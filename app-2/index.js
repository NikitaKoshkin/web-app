const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const DATA_FILE = './savedData.json';
const STRUCTURE_FILE = './struct.json';

app.get('/api/structure', (req, res) => {
    fs.readFile(STRUCTURE_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения структуры формы.' });
        }
        res.json(JSON.parse(data));
    });
});

app.post('/api/data', (req, res) => {
    const newData = req.body;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        let currentData = [];
        if (!err && data) {
            currentData = JSON.parse(data);
        }

        currentData.push(newData);

        fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2), (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ error: 'Ошибка сохранения данных.' });
            }
            res.json({ message: 'Данные успешно сохранены.' });
        });
    });
});

app.get('/api/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err || !data) {
            return res.json([]); 
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});