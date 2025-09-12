import { useEffect, useState } from 'react'
import avatar from './assets/avatar.png'
import instagramIcon from './assets/instagram.png'
import xIcon from './assets/gorjeo.png'
import twitchIcon from './assets/twitch.png'
import facebookIcon from './assets/facebook.png'
import emailIcon from './assets/email.png'
import './App.css'

function App() {
  const twitchChannel = 'gastonnetworks'
  const [latest, setLatest] = useState({ isLive: false, vodId: null })

  // Detectar entorno y configurar parent para Twitch
  const parentParams = `parent=${window.location.hostname}`

  // Detectar entorno y configurar URL base de la API
  const isLocal = window.location.hostname.includes('localhost') || window.location.hostname === '127.0.0.1'
  const API_BASE = isLocal ? '' : 'http://72.60.124.164:3000'

  useEffect(() => {
    let mounted = true
    const controller = new AbortController()
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/twitch-latest?login=${twitchChannel}`, {
          signal: controller.signal,
        })
        if (!res.ok) throw new Error('bad_response')
        const json = await res.json()
        if (mounted) setLatest(json)
      } catch (_) {
        // ignore for now
      }
    })()
    return () => {
      mounted = false
      controller.abort()
    }
  }, [API_BASE, twitchChannel])

  return (
    <div className="App">
      <div className="general-container">
        {/* HEADER */}
        <header className="header">
          <div className="container">
            <div className="logo"></div>
            <nav className="nav">
              <a href="#inicio" className="nav-link">INICIO</a>
              <a href="#stream" className="nav-link">STREAM</a>
              <a href="#redes" className="nav-link">REDES</a>
              <a href="#contacts" className="nav-link">CONTACTO</a>
            </nav>
          </div>
        </header>

        {/* HERO */}
        <section id="inicio" className="section hero-section">
          <div className="container">
            <div className="main-content">
              <img src={avatar} className="avatar" alt="Avatar" />
              <h1 className="title">
                ¡BIENVENIDO A <span className="highlight">GASTONNETWORKS</span>!
              </h1>
              <p className="description">
                TU CANAL GAMING FAVORITO. ÚNETE A LA AVENTURA Y VIVE LA EXPERIENCIA GAMING MÁS ÉPICA.
              </p>
            </div>
          </div>
        </section>

        {/* STREAM */}
        <section id="stream" className="section stream-section">
          <div className="container">
            <div className="twitch-container">
              <div className="twitch-embed">
                {latest.isLive ? (
                  <iframe
                    src={`https://player.twitch.tv/?channel=${twitchChannel}&${parentParams}&muted=true&autoplay=true`}
                    height="600"
                    width="100%"
                    allowFullScreen
                    allow="autoplay; fullscreen; picture-in-picture"
                    title="Twitch Stream"
                  ></iframe>
                ) : latest.vodId ? (
                  <iframe
                    src={`https://player.twitch.tv/?video=${latest.vodId}&${parentParams}&muted=true&autoplay=true`}
                    height="640"
                    width="100%"
                    allowFullScreen
                    allow="autoplay; fullscreen; picture-in-picture"
                    title="Twitch VOD"
                  ></iframe>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* REDES */}
        <section id="redes" className="section social-section">
          <div className="container">
            <h2 className="section-title">SÍGUEME EN REDES</h2>
            <div className="social-grid">
              <a className="social-icon twitch" href="https://www.twitch.tv/gastonnetworks" target="_blank" rel="noreferrer">
                <img src={twitchIcon} alt="Twitch" />
              </a>
              <a className="social-icon facebook" href="https://www.facebook.com/GastonNetworks" target="_blank" rel="noreferrer">
                <img src={facebookIcon} alt="Facebook" />
              </a>
              <a className="social-icon instagram" href="https://www.instagram.com/gastonnetworks" target="_blank" rel="noreferrer">
                <img src={instagramIcon} alt="Instagram" />
              </a>
              <a className="social-icon x" href="https://twitter.com/GastonNetworks" target="_blank" rel="noreferrer">
                <img src={xIcon} alt="X" />
              </a>
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacts" className="section contacts-section">
          <div className="container">
            <h2 className="section-title">CONTACTO</h2>
            <div className="contacts-grid">
              <a className="social-icon email-icon" href="mailto:gastonnetworks@gmail.com" target="_blank" rel="noreferrer">
                <img src={emailIcon} alt="Email" />
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="container footer-inner">
            <div className="footer-left">
              <p>© {new Date().getFullYear()} GastonNetworks. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
