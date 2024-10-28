import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

function Share() {
    const [text, setText] = useState('');
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [reads, setReads] = useState(999);
    const [ttl, setTtl] = useState(7);
    const [link, setLink] = useState(null);
    const [loading, setLoading] = useState(false);

    const generateRandomString = (length) => {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const randomValues = new Uint32Array(length);
        window.crypto.getRandomValues(randomValues);

        for (let i = 0; i < length; i++) {
            result += charset[randomValues[i] % charset.length];
        }
        return result;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setEmailSent(false);
        const keyToEncryptKey = import.meta.env.VITE_MY_SECRET_KEY;
        const secretKey = generateRandomString(12);
        
        // Encrypt the text using AES
        const encryptedText = CryptoJS.AES.encrypt(text, secretKey).toString();
        const encryptedKey = CryptoJS.AES.encrypt(secretKey, keyToEncryptKey).toString();
        const randomNum = generateRandomString(8);

        // Prepare the data to send
        const data = {
            randomNum,
            encryptedText,
            encryptedKey,
            email,
            ttl,
            reads
        };

        try {
            // Send a POST request to the /share route
            const response = await fetch('https://envbox-backend.onrender.com/share', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server error:', errorData.msg);
                throw new Error('Network response was not ok');
            }

            if (response.ok) {
                const data = await response.json();
                console.log("Data : ", data);
                setLink(data.link);
                setEmailSent(true);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
          setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-6">
            <form className="max-w-3xl w-full bg-gray-800 p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
                <h1 className="py-4 text-5xl font-bold text-center text-transparent bg-gradient-to-t bg-clip-text from-zinc-100/60 to-white">
                    Encrypt and Share
                </h1>
                <div className="mt-6">
                    {link && (
                        <div className="p-4 text-center border border-zinc-600 rounded-md bg-zinc-800">
                            <p className="text-zinc-100">Your encrypted link:</p>
                            <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 underline break-words"
                            >
                                {link}
                            </a>
                        </div>
                    )}

                    {emailSent && (
                        <div className="mt-4 p-4 text-center text-green-400 bg-green-800 border border-green-600 rounded-md">
                            <p>Email has been sent successfully to {email}!</p>
                        </div>
                    )}
                </div>

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
                            placeholder="DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full p-1 text-base bg-slate-800 appearance-none resize-none text-zinc-100 placeholder-zinc-500 focus:ring-0 rounded border border-zinc-500 sm:text-sm"
                        />
                    </div>
                </pre>


                <div className="mt-4 w-full">
                    <label htmlFor="email" className="block text-xs font-medium text-zinc-100">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 mt-1 text-base bg-transparent border rounded border-zinc-600 text-zinc-100 placeholder-zinc-500 focus:ring-0 sm:text-sm"
                        placeholder="Enter your email"
                        required
                    />
                </div>


                <div className="flex flex-col items-center justify-center w-full gap-4 mt-4 sm:flex-row">
                    <div className="w-full h-16 px-3 py-2 duration-150 border rounded sm:w-2/5 border-zinc-600 focus-within:border-zinc-100/80 focus-within:ring-0">
                        <label htmlFor="reads" className="block text-xs font-medium text-zinc-100">READS</label>
                        <input
                            type="number"
                            name="reads"
                            id="reads"
                            value={reads}
                            onChange={(e) => setReads(Number(e.target.value))}
                            className="w-full p-0 text-base bg-transparent border-0 appearance-none text-zinc-100 placeholder-zinc-500 focus:ring-0 focus:outline-none sm:text-sm"
                            defaultValue="999"
                        />
                    </div>
                    <div className="w-full h-16 px-3 py-2 duration-150 border rounded sm:w-2/5 border-zinc-600 focus-within:border-zinc-100/80 focus-within:ring-0">
                        <label htmlFor="ttl" className="block text-xs font-medium text-zinc-100">TTL</label>
                        <input
                            type="number"
                            name="ttl"
                            id="ttl"
                            value={ttl}
                            onChange={(e) => setTtl(Number(e.target.value))}
                            className="w-full p-0 text-base bg-transparent border-0 appearance-none text-zinc-100 placeholder-zinc-500 focus:ring-0 focus:outline-none sm:text-sm"
                            placeholder="Enter TTL in seconds"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className={`mt-6 w-full h-12 inline-flex justify-center items-center transition-all rounded px-4 py-1.5 md:py-2 text-base font-semibold leading-7 ${loading ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'} ring-1 ring-transparent duration-150 text-white`}
                    disabled={loading || !text.trim()}
                >
                  {
                    loading ? (
                      <span className="loader"></span>
                    ) : (
                      <span>Share</span>
                    )
                  }
                </button>
              <div className="mt-8">
                <ul className="space-y-2 text-zinc-400 text-sm list-disc">
                  <li>
                    <p>
                      <span className="font-semibold text-zinc-400">Reads: </span>
                      This is how many times your data can be accessed.
                      <br />
                      <span className="text-zinc-500">Example: If set to 5, the data can be read 5 times before it's deleted.</span>
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="font-semibold text-zinc-400">TTL (Time to Live): </span>
                      This is how long your data will be available before it deletes itself.
                      <br />
                      <span className="text-zinc-500">Example: If set to 60, the data will be deleted 60 seconds after being created.</span>
                    </p>
                  </li>
                  <li>
                    <p>
                      Clicking "Share" will encrypt your data and generate a unique key to protect it.
                      <br />
                      <span className="text-zinc-400">Only the encrypted data will be sent to the server, keeping your information safe.</span>
                    </p>
                  </li>
                </ul>
              </div>

            </form>
        </div>
    );
}

export default Share;
