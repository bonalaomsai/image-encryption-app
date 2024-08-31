# Image Encryption App

## Introduction
The **Image Encryption App** is a web-based application designed to securely encrypt and decrypt images using cryptographic algorithms. This application aims to protect sensitive images by converting them into encrypted data that can only be decrypted with the correct key.

## Features
- Encrypt images using secure cryptographic algorithms.
- Decrypt encrypted images back to their original form.
- User-friendly web interface for easy encryption and decryption.
- Supports various image formats (e.g., JPEG, PNG).

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Cryptography:** Built-in Node.js crypto module


## Getting Started

### Prerequisites
- Node.js installed on your system
- Git installed for version control

### Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/bonalaomsai/image-encryption-app.git
2. Navigate to the project directory:
   cd image-encryption-app
3. Install the necessary dependencies:
   npm install
4. Start the server:
   npm start
5. Open your browser and navigate to http://localhost:3000 to use the application.

### Usage
Encryption: Upload an image using the provided form and click on the "Encrypt" button. The application will return the encrypted image file.
Decryption: Upload the encrypted image and click on the "Decrypt" button. The application will return the original image.
