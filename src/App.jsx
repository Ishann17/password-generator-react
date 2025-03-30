import { useState, useCallback, useEffect, useRef } from 'react'

function App() {
  
  let [length, setLength] = useState(8)
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const[copied, setCopied] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    // More reliable initial state check
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  

  // Using useEffect to toggle darkmode - this is correct
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
      html.style.colorScheme = 'dark'; // Helps with native elements
    } else {
      html.classList.remove('dark');
      html.style.colorScheme = 'light';
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);
  


  //Syntax to use useCallback(Function, dependencies)
  const generatePassword = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let numbers = "0123456789";
    let specialChars = "!@#$%^&*()_+";

    if(numberAllowed) str += numbers;
    if(charAllowed) str += specialChars;

    for (let i = 1; i <= length; i++) {
        let char = Math.floor(Math.random() * str.length + 1)
        pass += str.charAt(char)
    }
    setPassword(pass)
    
  }, [length, numberAllowed, charAllowed, setPassword])
  
  //we cannot direct call the generatePassword() so we will use useEffect(callback, dependencies)

  useEffect(() => {
    generatePassword()
  }, [length, numberAllowed, charAllowed, generatePassword])

  const passwordRef = useRef(null) 

  const copyPasswordToClipBoard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0,50)
    window.navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000) //Reset after 2 seconds
  },[password])

  return (
    <>
   {/*Add dark mode class to the outermost div*/}
   <div className={`w-full min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex items-center justify-center bg-gray-200 dark:bg-gray-900 transition-colors duration-300 min-h-screen">
        <div className="w-full max-w-md mx-4 shadow-lg rounded-lg px-6 py-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          {/* Dark Mode Toggle */}
          <div className="flex justify-end">
            <button
              className="w-10 h-10 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-105"
              onClick={() => {
                const newMode = !darkMode;
                setDarkMode(newMode);
                document.documentElement.classList.toggle('dark', newMode);
                document.documentElement.style.colorScheme = newMode ? 'dark' : 'light';
              }}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Password Generator UI */}
          <h1 className="text-center text-2xl font-semibold tracking-wider mb-6">
            🔐 PASSWORD GENERATOR
          </h1>

          <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 mb-6">
            <input
              type="text"
              value={password}
              className="w-full px-4 py-2 text-center text-lg bg-white dark:bg-gray-700 text-black dark:text-white outline-none transition-colors duration-300"
              placeholder="Generated Password"
              readOnly
              ref={passwordRef}
            />
            <button
              onClick={copyPasswordToClipBoard}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 transition-colors duration-300 font-semibold"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="flex flex-col gap-4 text-sm">
            <div className="flex items-center justify-between">
              <label htmlFor="length" className="font-medium">
                Length: <span className="text-orange-500">{length}</span>
              </label>
              <input
                id="length"
                type="range"
                min={8}
                max={50}
                value={length}
                className="w-2/3 accent-orange-500 cursor-pointer"
                onChange={(e) => setLength(Number(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="numberInput" className="font-medium">
                Include Numbers
              </label>
              <input
                id="numberInput"
                type="checkbox"
                checked={numberAllowed}
                onChange={() => setNumberAllowed((prev) => !prev)}
                className="w-5 h-5 accent-orange-500 cursor-pointer transition-transform duration-300 hover:scale-110"
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="charInput" className="font-medium">
                Include Characters
              </label>
              <input
                id="charInput"
                type="checkbox"
                checked={charAllowed}
                onChange={() => setCharAllowed((prev) => !prev)}
                className="w-5 h-5 accent-orange-500 cursor-pointer transition-transform duration-300 hover:scale-110"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default App
