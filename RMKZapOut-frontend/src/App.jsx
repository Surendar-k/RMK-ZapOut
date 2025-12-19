
import './App.css'
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          RMK ZapOut
        </h1>
        <p className="text-gray-500 mb-6">
          React + Vite + Tailwind CSS
        </p>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setCount(count + 1)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Count: {count}
          </button>
        </div>

        <p className="text-sm text-gray-500">
          Edit <code className="bg-gray-100 px-1 rounded">src/App.jsx</code> and save
        </p>

        <div className="mt-6 text-xs text-gray-400">
          Tailwind test page ✔
        </div>
      </div>
    </div>
  );
}

export default App;
