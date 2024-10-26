// src/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-6">
            <div className="max-w-3xl w-full text-center space-y-6 bg-gray-800 p-8 rounded-xl shadow-lg">
                <h1 className="text-4xl font-bold text-white">Welcome to EnvBox</h1>
                <p className="text-lg text-zinc-300">
                    Securely share your sensitive .env files with confidence and control. 
                </p>

                <div className="flex justify-center space-x-4 mt-6">
                    <Link to="/share">
                        <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                            Start Sharing Your Sensitive Data
                        </button>
                    </Link>
                </div>

                <div className="flex flex-col items-center mt-8">
                    <p className="text-sm text-zinc-500">Easy, secure, and reliable.</p>
                    <p className="text-sm text-zinc-500">Your data, protected and accessible only by you.</p>
                </div>
            </div>

            <div className="max-w-2xl w-full mt-10 bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-white mb-4">EnvBox</h2>
                <p className="text-gray-300 mb-4">
                    Flow of this project:
                </p>
                <ol className="list-decimal list-inside text-gray-400 space-y-2">
                    <li>
                        <strong>Step 1:</strong> Get <code>keyToEncryptKey</code>. Let us call this key P. P is FIXED for every user and is present in .env file.
                    </li>
                    <li>
                        <strong>Step 2:</strong> Generate a random string. Let us call this string Key Q. Q is different for every user. 
                    </li>
                    <li>
                        <strong>Step 3:</strong> Encrypt plain text with key Q, and encrypt key Q with key P.
                    </li>
                    <li>
                        <strong>Step 4:</strong> Generate a unique ID called <code>randomNum</code>.
                    </li>
                    <li>
                        <strong>Step 5:</strong> Prepare the data to be sent with the required fields.
                    </li>
                    <li>
                        <strong>Step 6:</strong> Send a POST request to the API to share the encrypted data.
                    </li>
                    <li>
                        <strong>Step 7:</strong> Handle the data on the backend, saving it in Redis.
                    </li>
                    <li>
                        <strong>Step 8:</strong> Set an expiration time for the data based on TTL (Time to Live).
                    </li>
                    <li>
                        <strong>Step 9:</strong> Return a link for accessing the encrypted data.
                    </li>
                    <li>
                        <strong>Step 10:</strong> On the frontend, extract the link and use it to fetch the encrypted data later.
                    </li>
                    <li>
                        <strong>Step 11:</strong> Decrypt the data using the keys and display it securely.
                    </li>
                </ol>
            </div>
        </div>
    );
}

export default Home;
