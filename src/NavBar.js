// src/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <Link className="navbar-brand" to="/">GÉOGRAPHIE LITTÉRAIRE FRANCOPHONE</Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">CARTE</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/about">À PROPOS</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;
