import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import Map from './Map';
import About from './About';
import Footer from './Footer';
import './App.css';

const App = () => {
    return (
        <Router basename="/geolit">
            <div className="App">
                <Header />
                <Routes>
                    <Route exact path="/" element={<Map />} />
                    <Route path="/about" element={<About />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
