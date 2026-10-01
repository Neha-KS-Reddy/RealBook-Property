import { Link } from "react-router-dom";

function Home() {

    return (

        <div>

            {/* HERO SECTION */}

            <section className="hero">

                <div className="hero-content">

                    <p className="hero-small">
                        REAL ESTATE • VIRTUAL TOURS
                    </p>

                    <h1>
                        Find a place that
                        <br />
                        <i>feels like home.</i>
                    </h1>

                    <p className="hero-description">

                        Discover properties, shortlist your
                        favourites and schedule a virtual tour
                        from anywhere.

                    </p>

                    {/* SEARCH BOX */}

                    <div className="search-box">

                        <div className="search-field">

                            <label>Location</label>

                            <input
                                type="text"
                                placeholder="Search locality..."
                            />

                        </div>

                        <div className="search-field">

                            <label>BHK</label>

                            <select>

                                <option>Any BHK</option>
                                <option>1 BHK</option>
                                <option>2 BHK</option>
                                <option>3 BHK</option>
                                <option>4 BHK</option>

                            </select>

                        </div>

                        <div className="search-field">

                            <label>Budget</label>

                            <select>

                                <option>Any budget</option>
                                <option>₹20,000</option>
                                <option>₹40,000</option>
                                <option>₹60,000</option>
                                <option>₹1,00,000+</option>

                            </select>

                        </div>

                        <Link
                            to="/properties"
                            className="search-button"
                        >
                            Search
                        </Link>

                    </div>

                </div>

            </section>


            {/* FEATURES */}

            <section className="features">

                <div className="section-title">

                    <p>WHY REALBOOK</p>

                    <h2>
                        Property search,
                        <br />
                        made simple.
                    </h2>

                </div>


                <div className="feature-grid">

                    <div className="feature-card">

                        <div className="feature-number">
                            01
                        </div>

                        <h3>
                            Search smarter
                        </h3>

                        <p>
                            Find properties using locality,
                            budget and BHK filters.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-number">
                            02
                        </div>

                        <h3>
                            Shortlist favourites
                        </h3>

                        <p>
                            Save properties you love and
                            compare them later.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-number">
                            03
                        </div>

                        <h3>
                            Virtual tours
                        </h3>

                        <p>
                            Book a convenient 30-minute
                            virtual property tour.
                        </p>

                    </div>

                </div>

            </section>


            {/* CTA */}

            <section className="cta">

                <div>

                    <p>
                        READY TO FIND YOUR NEXT HOME?
                    </p>

                    <h2>
                        Your next address
                        <br />
                        could be here.
                    </h2>

                </div>

                <Link
                    to="/properties"
                    className="cta-button"
                >
                    Explore Properties →
                </Link>

            </section>

        </div>

    );
}

export default Home;