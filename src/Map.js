import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './Map.css';

const Map = () => {
    const mapRef = useRef(null);
    const [books, setBooks] = useState([]);
    const [collapsedCountries, setCollapsedCountries] = useState({});

    useEffect(() => {
        d3.select(mapRef.current).selectAll("*").remove();

        const svgWidth = 1200; // Increase the width
        const svgHeight = 600;

        const svg = d3.select(mapRef.current)
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        const projection = d3.geoMercator()
            .scale(180) // Adjust scale if needed
            .translate([svgWidth / 2, svgHeight / 2]);

        const path = d3.geoPath().projection(projection);

        const colorScale = d3.scaleLinear()
            .domain([0, 50, 100])
            .range(["#67001E", "#FFFFFF", "#043060"])
            .interpolate(d3.interpolateRgb);

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        let selectedCountries = new Set();
        let bookCountries = new Set();
        let bookCounts = {};
        let equalityData = {};

        Promise.all([
            d3.csv("data/books.csv"),
            d3.csv("data/equality_scores.csv")
        ]).then(([bookData, equalityScores]) => {
            setBooks(bookData);
            bookData.forEach(d => {
                bookCountries.add(d.ISO);
                if (!bookCounts[d.ISO]) {
                    bookCounts[d.ISO] = 0;
                }
                bookCounts[d.ISO]++;
            });

            equalityScores.forEach(d => {
                equalityData[d.country] = +d.legal;
            });

            const initialCollapsedState = bookData.reduce((acc, book) => {
                acc[book.nationality] = true;
                return acc;
            }, {});
            setCollapsedCountries(initialCollapsedState);

            d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(data => {
                d3.csv("data/map_data.csv").then(csvData => {
                    const legalData = {};
                    csvData.forEach(d => {
                        legalData[d.ISO] = +d.legal;
                        if (bookCountries.has(d.ISO)) {
                            selectedCountries.add(d.ISO);
                        }
                    });

                    const paths = svg.append("g")
                        .selectAll("path")
                        .data(data.features)
                        .enter()
                        .append("path")
                        .attr("d", path)
                        .attr("fill", d => {
                            const legal = legalData[d.id];
                            if (legal !== undefined) {
                                return colorScale(legal);
                            } else {
                                console.warn(`No legal data for country ID: ${d.id}`);
                                return "#ccc";
                            }
                        })
                        .attr("stroke", "#333")
                        .attr("stroke-width", d => selectedCountries.has(d.id) ? 2 : 0.5)
                        .on("click", d => {
                            const countryId = d.id;
                            if (selectedCountries.has(countryId)) {
                                selectedCountries.delete(countryId);
                            } else {
                                selectedCountries.add(countryId);
                            }
                            updateColors();
                        })
                        .on("mouseover", (event, d) => {
                            const countryId = d.id;
                            const count = bookCounts[countryId] || 0;
                            const legalScore = equalityData[d.properties.name] || "N/A";
                            tooltip.transition()
                                .duration(200)
                                .style("opacity", .9);
                            tooltip.html(`Country: ${d.properties.name}<br>Books: ${count}<br>Legal Score: ${legalScore}`)
                                .style("left", (event.pageX + 5) + "px")
                                .style("top", (event.pageY - 28) + "px");
                        })
                        .on("mouseout", () => {
                            tooltip.transition()
                                .duration(500)
                                .style("opacity", 0);
                        });

                    function updateColors() {
                        paths.attr("fill", d => {
                            const legal = legalData[d.id];
                            if (selectedCountries.has(d.id)) {
                                return legal !== undefined ? colorScale(legal) : "#ccc";
                            } else {
                                return legal !== undefined ? colorScale(legal) : "#eee";
                            }
                        })
                            .attr("opacity", d => selectedCountries.has(d.id) ? 1 : 0.5)
                            .attr("stroke-width", d => selectedCountries.has(d.id) ? 2 : 0.5);
                    }

                    updateColors();
                });
            });
        });
    }, []);

    const groupedBooks = books.reduce((acc, book) => {
        if (!acc[book.nationality]) {
            acc[book.nationality] = [];
        }
        acc[book.nationality].push(book);
        return acc;
    }, {});

    const toggleCollapse = (country) => {
        setCollapsedCountries(prevState => ({
            ...prevState,
            [country]: !prevState[country]
        }));
    };

    return (
        <div className="map-container">
            <h2 className="cards-title">DROITS RÉSERVÉS À LA COMMUNAUTÉ LGBTQIAP+ DANS LE MONDE</h2>
            <div ref={mapRef} className="map"></div>
            <div className="legend-container">
                <div className="legend">
                    <div><span className="legend-color" style={{ backgroundColor: '#043060' }}></span>High Rights</div>
                    <div><span className="legend-color" style={{ backgroundColor: '#FFFFFF' }}></span>Moderate Rights</div>
                    <div><span className="legend-color" style={{ backgroundColor: '#67001E' }}></span>Low Rights</div>
                </div>
            </div>
            <div className="book-cards">
                <h3 className="cards-title">REPRÉSENTATION DE L'HOMOSEXUALITÉ FÉMININE DANS LA LITTÉRATURE FRANCOPHONE CONTEMPORAINE</h3>
                {Object.keys(groupedBooks).map(country => (
                    <div key={country} className="country-section">
                        <h2 className="country-name" onClick={() => toggleCollapse(country)}>
                            {collapsedCountries[country] ? '▼' : '▲'} {country}
                        </h2>
                        {!collapsedCountries[country] && groupedBooks[country].map(book => (
                            <div key={book.book_title} className="book-card">
                                <h3 className="book-title">{book.book_title}</h3>
                                <h4 className="author">{book.author}</h4>
                                <p className="author-year">{book.country_name}, {book.city}, <em>{book.publishers}</em>, {book.year}</p>
                                <p className="synopsis">{book.synopsis}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Map;
