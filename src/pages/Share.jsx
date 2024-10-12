import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

function Share() {
  
  const [text, setText] = useState('');
  const [reads, setReads] = useState(999);
  const [ttl, setTtl] = useState(7);
  const [link,setLink] = useState(null)
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

    e.preventDefault(); // Prevent default form submission
    const keyToEncryptKey = import.meta.env.VITE_MY_SECRET_KEY
    // Replace 'your-secret-key' with your actual secret key
    const secretKey = generateRandomString(12);
    
    // Encrypt the text using AES
    const encryptedText = CryptoJS.AES.encrypt(text, secretKey).toString();

    const encryptedKey = CryptoJS.AES.encrypt(secretKey, keyToEncryptKey).toString();

    const randomNum = generateRandomString(8)

    // Prepare the data to send
    const data = {
        randomNum,
        encryptedText,
        encryptedKey,
        ttl,
        reads
    };

    try {
        // Send a POST request to the /share route
        const response = await fetch('http://localhost:3000/share', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specify the content type
            },
            body: JSON.stringify(data), // Convert the data object to a JSON string
        });

        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
// Handle success (e.g., show a success message)
        if(response.ok){
          const data = await response.json()
          console.log("Data : ",data)
          setLink(data.link)
        }
    } catch (error) {
        console.error('Error:', error); // Handle error (e.g., show an error message)
    }
};


  return (
    <form className="max-w-3xl mx-auto" onSubmit={handleSubmit}>
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
            onChange={(e) => setText(e.target.value)} // Update state on change
            className="w-full p-0 text-base bg-transparent border-0 appearance-none resize-none hover:resize text-zinc-100 placeholder-zinc-500 focus:ring-0 sm:text-sm"
          />
        </div>
      </pre>
      <div className="flex flex-col items-center justify-center w-full gap-4 mt-4 sm:flex-row">
        <div className="w-full h-16 px-3 py-2 duration-150 border rounded sm:w-2/5 border-zinc-600 focus-within:border-zinc-100/80 focus-within:ring-0">
          <label htmlFor="reads" className="block text-xs font-medium text-zinc-100">READS</label>
          <input
            type="number"
            name="reads"
            id="reads"
            value={reads}
            onChange={(e) => setReads(Number(e.target.value))} // Convert to number
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
            onChange={(e) => setTtl(Number(e.target.value))} // Convert to number
            className="w-full p-0 text-base bg-transparent border-0 appearance-none text-zinc-100 placeholder-zinc-500 focus:ring-0 focus:outline-none sm:text-sm"
            placeholder="Enter TTL in seconds"
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-6 w-full h-12 inline-flex justify-center items-center transition-all rounded px-4 py-1.5 md:py-2 text-base font-semibold leading-7 bg-zinc-200 ring-1 ring-transparent duration-150 text-zinc-400"
        disabled={!text.trim()} // Disable if text is empty or just spaces
      >
        <span>Share</span>
      </button>
      <div className="mt-8">
        <ul className="space-y-2 text-xs text-zinc-500">
          <li>
            <p><span className="font-semibold text-zinc-400">Reads:</span> The number of reads determines how often the data can be shared before it deletes itself. 0 means unlimited.</p>
          </li>
          <li>
            <p><span className="font-semibold text-zinc-400">TTL:</span> You can add a TTL (time to live) to the data, to automatically delete it after a certain amount of time. 0 means no TTL.</p>
          </li>
          <p>Clicking Share will generate a new symmetrical key and encrypt your data before sending only the encrypted data to the server.</p>
        </ul>
      </div>
    </form>
  );
}

export default Share;
