// src/Fetch.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js'; // Import CryptoJS

function Fetch() {
    const keyToEncryptKey = import.meta.env.VITE_MY_SECRET_KEY
    const { id } = useParams(); // This will extract the 'id' from the URL
    const [decryptedText, setDecryptedText] = useState(''); // State to hold decrypted text

    const fetchData = async () => {
        try {
            const response = await fetch('https://envbox-backend.onrender.com/fetch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Specify the content type
                },
                body: JSON.stringify({ id }), // Convert the id to a JSON string
            });
            if (!response.ok) {
                const errorData = await response.json()
                alert(errorData.msg)
                return;
            }
            const data = await response.json();
            // Step 1: Decrypt the encryptedKey
            const keySecret = keyToEncryptKey; // The key to decrypt the encryptedKey
            const bytesKey = CryptoJS.AES.decrypt(data.encryptedKey, keySecret);
            const actualKey = bytesKey.toString(CryptoJS.enc.Utf8); // Convert bytes to UTF-8 string

            // Step 2: Decrypt the encryptedText using the actual key
            const bytesText = CryptoJS.AES.decrypt(data.encryptedText, actualKey);
            const originalText = bytesText.toString(CryptoJS.enc.Utf8); // Convert bytes to UTF-8 string

            setDecryptedText(originalText); // Update state with decrypted text
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="py-4 text-5xl font-bold text-center text-transparent bg-gradient-to-t bg-clip-text from-zinc-100/60 to-white">
                Decrypted Secrets
            </h1>
            <pre className="px-4 py-3 mt-8 font-mono text-left bg-transparent border rounded border-zinc-600 focus:border-zinc-100/80 focus:ring-0 sm:text-sm text-zinc-100">
                <div className="flex items-start px-1 text-sm">
                    <div aria-hidden="true" className="pr-4 font-mono border-r select-none border-zinc-300/5 text-zinc-700">
                        01<br />
                    </div>
                    <textarea
                        id="text"
                        name="text"
                        minLength="1"
                        rows="5"
                        value={decryptedText} // Set the decrypted text as the value
                        readOnly // Make it read-only
                        className="w-full p-0 text-base bg-transparent border-0 appearance-none resize-none hover:resize text-zinc-100 placeholder-zinc-500 focus:ring-0 sm:text-sm"
                    />
                </div>
            </pre>
        </div>
    );
}

export default Fetch;
