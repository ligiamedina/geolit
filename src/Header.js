import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header-title">GÉOGRAPHIE LITTÉRAIRE FRANCOPHONE</div>
            <nav className="header-nav">
                <Link to="/">CARTE</Link>
                <Link to="/about">À PROPOS</Link>
            </nav>
        </header>
    );
};

export default Header;
