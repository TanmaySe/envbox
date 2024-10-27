// src/Fetch.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import CryptoJS from 'crypto-js'; 

function Fetch() {
    const keyToEncryptKey = import.meta.env.VITE_MY_SECRET_KEY;
    const { id } = useParams(); 
    const navigate = useNavigate(); 
    const [decryptedText, setDecryptedText] = useState('');
    const [readsLeft, setReadsLeft] = useState(0); 

    const fetchData = async () => {
        try {
            const response = await fetch('https://envbox-backend.onrender.com/fetch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Specify the content type
                },
                body: JSON.stringify({ id }), // Convert the id to a JSON string
            });
            if(response.status == 400){
                navigate('/share')
            }
            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.msg);
                return;
            }
            const data = await response.json();
            console.log('Fetched data:', data); // Log the fetched data

            // Step 1: Decrypt the encryptedKey
            const keySecret = keyToEncryptKey; // The key to decrypt the encryptedKey
            const bytesKey = CryptoJS.AES.decrypt(data.encryptedKey, keySecret);
            const actualKey = bytesKey.toString(CryptoJS.enc.Utf8); // Convert bytes to UTF-8 string

            // Step 2: Decrypt the encryptedText using the actual key
            const bytesText = CryptoJS.AES.decrypt(data.encryptedText, actualKey);
            const originalText = bytesText.toString(CryptoJS.enc.Utf8); // Convert bytes to UTF-8 string

            setDecryptedText(originalText); // Update state with decrypted text
            setReadsLeft(data.reads); 
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData(); 
    }, [id]);

    console.log(readsLeft)
    if (readsLeft === 0) {
        navigate('/share'); // Redirect if readsLeft is 0
    }


    return (
        <div className="flex flex-col items-center pt-28 min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
            <h1 className="py-4 text-5xl font-bold text-center text-transparent bg-gradient-to-t bg-clip-text from-zinc-100/60 to-white">
                Decrypted Secret
            </h1>
            <pre className="max-w-3xl w-full px-4 py-3 mt-8 font-mono text-left bg-transparent border rounded border-zinc-600 focus:border-zinc-100/80 focus:ring-0 sm:text-sm text-zinc-100">
                <div className="flex items-start px-1 text-sm">
                    <div aria-hidden="true" className="pr-4 font-mono border-r select-none border-zinc-300/5 text-zinc-700">
                        01<br />
                    </div>
                    <textarea
                        id="decryptedText"
                        name="decryptedText"
                        minLength="1"
                        rows="20"
                        placeholder="Decrypted Text Here"
                        value={decryptedText}
                        className="w-full p-1 text-base bg-slate-800 appearance-none resize-none text-zinc-100 placeholder-zinc-500 focus:ring-0 rounded border border-zinc-500 sm:text-sm"
                        readOnly 
                    />
                </div>
            </pre>
            <div className="mt-8 text-zinc-100">
                <h2 className="text-xl">Reads Left: {readsLeft}</h2>
            </div>
        </div>
    );
}

export default Fetch;
