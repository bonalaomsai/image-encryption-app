const express = require('express');
const fileUpload = require('express-fileupload');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(fileUpload());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads')); // Serve files from the uploads directory

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// Serve index.html for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Encryption key and IV size
const KEY_SIZE = 32; // 256 bits
const IV_SIZE = 16;  // 128 bits

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Encrypt image route
app.post('/encrypt', (req, res) => {
    if (!req.files || !req.files.image || !req.body.password) {
        return res.status(400).send('No image or password provided.');
    }

    const image = req.files.image;
    const password = req.body.password;

    // Generate a random initialization vector
    const iv = crypto.randomBytes(IV_SIZE);

    // Derive a key from the password
    const key = crypto.pbkdf2Sync(password, iv, 100000, KEY_SIZE, 'sha256');

    // Create cipher
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = Buffer.concat([cipher.update(image.data), cipher.final()]);

    // Save encrypted image
    const encryptedImagePath = path.join(uploadsDir, 'encrypted-' + image.name);
    fs.writeFileSync(encryptedImagePath, Buffer.concat([iv, encrypted]));

    res.send(`<p>Image encrypted successfully! <a href="/uploads/encrypted-${image.name}" download>Download Encrypted Image</a></p>`);
});

// Decrypt image route
app.post('/decrypt', (req, res) => {
    if (!req.files || !req.files.image || !req.body.password) {
        return res.status(400).send('No image or password provided.');
    }

    const image = req.files.image;
    const password = req.body.password;

    // Extract the IV from the encrypted image
    const iv = image.data.slice(0, IV_SIZE);
    const encryptedData = image.data.slice(IV_SIZE);

    // Derive a key from the password
    const key = crypto.pbkdf2Sync(password, iv, 100000, KEY_SIZE, 'sha256');

    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

    // Save decrypted image
    const decryptedImagePath = path.join(uploadsDir, 'decrypted-' + image.name);
    fs.writeFileSync(decryptedImagePath, decrypted);

    res.send(`<p>Image decrypted successfully! <a href="/uploads/decrypted-${image.name}" download>Download Decrypted Image</a></p>`);
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
