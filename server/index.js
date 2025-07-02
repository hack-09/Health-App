const express = require('express');
const multer = require('multer');
const cors = require('cors');
const Tesseract = require('tesseract.js');
const fs = require('fs');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('report'), (req, res) => {
  const filePath = req.file.path;
  
  Tesseract.recognize(
    filePath,
    'eng',
    { logger: m => console.log(m) }
  ).then(({ data: { text } }) => {
    fs.unlinkSync(filePath); // cleanup
    res.json({ text });
  }).catch(err => {
    res.status(500).json({ error: 'OCR failed', details: err });
  });
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
