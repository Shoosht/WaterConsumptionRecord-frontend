import './navbar.css';
import hamburgerMenu from '../hamburger-menu.svg';
import userIcon from '../user.svg';

function Navbar() {
    return (
        <header className="header">
            <div className="navbar">
                <img className="hamburger-icon" height="40px" src={hamburgerMenu} alt="Hamburger menu" />
                <div className="nav-wcr">WCR</div>
                <img className="user-icon" height="40px" src={userIcon} alt="User Icon" />
            </div>
        </header>
    )
}

export default Navbar