// Importamos los estilos CSS que crearemos después
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="container">
        
        <div className="logo">
        </div>

        <nav className="nav">
          <a href="#inicio" className="nav-link"> Inicio</a>
          <a href="#stream" className="nav-link"> Stream</a>
          <a href="#redes" className="nav-link"> Redes</a>
        </nav>  
      </div>
    </header>
  )
}

export default Header
