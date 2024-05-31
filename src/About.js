import React, { useEffect, useState } from 'react';
import './About.css';

const About = () => {
    const [content, setContent] = useState('');

    useEffect(() => {
        fetch(`data/about.txt`)
            .then(response => response.text())
            .then(data => setContent(data))
            .catch(error => console.error('Error fetching about.txt:', error));
    }, []);

    return (
        <div id="about" className="container content">
            <h3 className='title'>LITTÉRATURE FRANCOPHONE</h3>
            <p>{content}</p>
            <br />
            <p>Recherche par <a href="https://www.linkedin.com/in/ligiamedina/">Lígia Medina</a></p>
            <p>Site développé par <a href="https://www.linkedin.com/in/rafaela-s-pinter">Rafaela Pinter</a></p>
        </div>
    );
};

export default About;
