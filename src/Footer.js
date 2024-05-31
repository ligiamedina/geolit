// src/Footer.js
// Contribuer à notre base de données
// Dernière mise à jour le 04/12/2022
//  <p>Recherche par <a href="https://www.linkedin.com/in/ligiamedina/">Lígia Medina</a></p>
import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer bg-light py-3">
            <div className="container">
                <p><a href="https://docs.google.com/forms/d/e/1FAIpQLScn6hfHdFXSlLe4n_k0n2W7Sv8LNR9-WRMY438FhZZCzpo2Lw/viewform">Contribuer à notre base de données</a></p>
                <p>Dernière mise à jour le 04/12/2022</p>
            </div>
        </footer>
    );
};

export default Footer;
