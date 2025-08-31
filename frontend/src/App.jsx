import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import avatar from './assets/avatar.jpg'
import instagramIcon from './assets/instagram.png'
import xIcon from './assets/gorjeo.png'
import twitchIcon from './assets/twitch.png'
import facebookIcon from './assets/facebook.png'

import './App.css'


function App() {
  const twitchChannel = 'gastonnetworks'
  const [latest, setLatest] = useState({ isLive: false, vodId: null })
  const parents = useMemo(() => ['localhost', '127.0.0.1', window.location.hostname].filter(Boolean), [])
  const parentParams = useMemo(() => parents.map(p => `parent=${p}`).join('&'), [parents])
  const fallbackVodId = '2352887539'
  useEffect(() => {
    let mounted = true
    const controller = new AbortController()
    ;(async () => {
      try { 
        const res = await fetch(`/api/twitch-latest?login=${twitchChannel}` , { signal: controller.signal })
        if (!res.ok) throw new Error('bad_response')
        const json = await res.json()
        if (mounted) setLatest(json)
      } catch (_) {
        // ignore for now
      }
    })()
    return () => { mounted = false; controller.abort() }
  }, [twitchChannel])
  return (
    <div className="App">
      {/* Header fijo */}
      <Header />
      
      {/* Contenido con scroll */}
      <div className="App">


                {/* SECCIÓN 1: HERO/INICIO */}
        <section id="inicio" className="section hero-section">
          <div className="container">
            <div className="main-content">
              <img src={avatar} className="avatar" />
              <h1 className="title">¡Bienvenido a GastonNetworks!</h1>
              <p className="description">
                Tu canal gaming favorito. Únete a la aventura y vive la experiencia gaming más épica.
              </p>
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: STREAM EN VIVO / ÚLTIMO VIDEO */}
        
        <section id="stream" className="section stream-section">
          <div className="container"> 
            <div className="twitch-container">
              {/* EMBED DE TWITCH (con fallback a VOD si no está en vivo) */}
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
                ) : (
                  <iframe
                    src={`https://player.twitch.tv/?video=${fallbackVodId}&${parentParams}&muted=true&autoplay=true`}
                    height="640"
                    width="100%"
                    allowFullScreen
                    allow="autoplay; fullscreen; picture-in-picture"
                    title="Twitch VOD"
                  ></iframe>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 3: REDES SOCIALES */}
        <section id="redes" className="section social-section">
          <div className="container">
            <h2 className="section-title">Sígueme en redes</h2>
            <div className="social-grid">
              <a className="social-icon twitch" href="https://www.twitch.tv/gastonnetworks" target="_blank" rel="noreferrer" aria-label="Twitch">
                <img src={twitchIcon} alt="Twitch" />
              </a>
              <a className="social-icon facebook" href="https://www.facebook.com/GastonNetworks" target="_blank" rel="noreferrer" aria-label="Facebook">
                <img src={facebookIcon} alt="Facebook" />
              </a>
              <a className="social-icon instagram" href="https://www.instagram.com/gastonnetworks" target="_blank" rel="noreferrer" aria-label="Instagram">
                <img src={instagramIcon} alt="Instagram" />
              </a>
              <a className="social-icon x" href="https://twitter.com/GastonNetworks" target="_blank" rel="noreferrer" aria-label="X">
                <img src={xIcon} alt="X" />
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
