import './navbar.css';
import hamburgerMenu from '../Icons/hamburger-menu.svg';
import userIcon from '../Icons/user.svg';
import logoutIcon from '../Icons/logout.svg'
import { Link } from "react-router-dom";
import { useState } from 'react';
import { useLogout } from '../../Hooks/useLogout';
import { useAuthContext } from '../../Hooks/useAuthContext';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user } = useAuthContext();
    const { logout } = useLogout();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    const handleLogoutClick = () => {
        logout()
    }
    
    return (
        <header className="header">
            
            <div className="navbar">

                <div className="nav-left">
                    <img className="hamburger-icon" height="40px" onClick={toggleMenu} src={hamburgerMenu} alt="Hamburger menu" />
                </div>

                <div className="nav-center">
                    <Link to="/home" className="nav-wcr">WCR</Link>
                </div>

                <div className="nav-right">
                    {!user && (
                        <img className="user-icon" height="40px" src={userIcon} alt="User Icon" />
                    )
                    }
                    {user && (
                        <div className="nav-r-active">
                            <div className="nav-logged-email">{user.email}</div>
                            <Link to="/">
                                <img className="logout-icon" onClick={handleLogoutClick} height="40px" src={logoutIcon} alt="Logout Icon" />
                            </Link>
                        </div>
                    )
                    }
                </div>

            </div>

            {menuOpen && (
                <div className="nav-dropdown-menu">
                    <Link className="nav-dropdown-menu-option" to="/home">Home</Link>
                    <Link className="nav-dropdown-menu-option" to="/newrecord">Add a water record</Link>
                    <Link className="nav-dropdown-menu-option" to="/logout">Logout</Link>
                </div>
            )}

        </header>
    )
}

export default Navbar