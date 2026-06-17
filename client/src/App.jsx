import { useState } from "react"
import "./App.css"

function App() {
    const [originalUrl, setOriginalUrl] = useState("")
    const [shortCode, setShortCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const snipSound = new Audio(new URL('./snip.mp3', import.meta.url).href)

    async function handleSubmit() {
        if (!originalUrl) return
        snipSound.play()
        setLoading(true)
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/shorten`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ originalUrl })
        })
        const data = await response.json()
        setShortCode(data.shortCode)
        setLoading(false)
    }

    function handleCopy() {
        navigator.clipboard.writeText(`${import.meta.env.VITE_API_URL}/${shortCode}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="page">
            <nav className="nav">
                <span className="nav-logo">snip.</span>
            </nav>

            <main className="main">
                <h2 className="tagline">make.it.shrt.</h2>

                <div className="input-row">
                    <input
                        className="input"
                        type="text"
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                        placeholder="paste long url"
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    />
                    <button className="button-snip" onClick={handleSubmit} disabled={loading}>
                        snip
                    </button>
                </div>

                  <button className="button-copy" onClick={handleCopy} style={{ visibility: shortCode ? 'visible' : 'hidden' }}>
                      copy sniped link
                  </button>
            </main>

            <footer className="footer">— kartikey mishra</footer>
        </div>
    )
}

export default App