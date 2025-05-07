import './navbar.css';
import hamburgerMenu from '../Icons/hamburger-menu.svg';
import userIcon from '../Icons/user.svg';
import { Link } from "react-router-dom";
import { useState } from 'react'

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }
    
    return (
        <header className="header">
            
            <div className="navbar">
                <img className="hamburger-icon" height="40px" onClick={toggleMenu} src={hamburgerMenu} alt="Hamburger menu" />
                <Link to="/home" className="nav-wcr">WCR</Link>
                <img className="user-icon" height="40px" src={userIcon} alt="User Icon" />
            </div>

            {menuOpen && (
                <div className="dropdown-menu">
                    <Link className="dropdown-menu-option" to="/home">Home</Link>
                    <Link className="dropdown-menu-option" to="/newrecord">Add a water record</Link>
                    <Link className="dropdown-menu-option" to="/logout">Logout</Link>
                </div>
            )}

        </header>
    )
}

export default Navbar