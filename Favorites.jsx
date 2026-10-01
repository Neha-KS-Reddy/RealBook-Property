import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

import {
    getFavorites,
    removeFavorite
} from "../api";


function Favorites() {

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // CHECK LOGIN + LOAD FAVORITES
    // ==========================================

    useEffect(() => {

        async function loadFavorites() {

            try {

                const data = await getFavorites();

                setFavorites(data);

            } catch (error) {

                console.error(error);

                setError(
                    error.message ||
                    "Unable to load favorites."
                );

            } finally {

                setLoading(false);

            }

        }

        loadFavorites();

    }, []);


    // ==========================================
    // REMOVE FAVORITE
    // ==========================================

    async function handleRemove(propertyId) {

        try {

            await removeFavorite(propertyId);

            setFavorites((currentFavorites) =>
                currentFavorites.filter(
                    (property) =>
                        property.id !== propertyId
                )
            );

        } catch (error) {

            alert(error.message);

        }

    }


    // ==========================================
    // LOGIN CHECK
    // ==========================================

    if (!localStorage.getItem("realbook_token")) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="favorites-page">

                <h1>
                    Loading favorites...
                </h1>

            </div>

        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="favorites-page">


            {/* HEADER */}

            <div className="favorites-header">

                <p className="favorites-label">
                    MY SHORTLIST
                </p>

                <h1>
                    ❤️ My Favorites
                </h1>

                <p>
                    Properties you have shortlisted
                    for later.
                </p>

            </div>


            {/* ERROR */}

            {error && (

                <div className="favorites-error">
                    {error}
                </div>

            )}


            {/* EMPTY */}

            {!error && favorites.length === 0 && (

                <div className="empty-favorites">

                    <div className="empty-icon">
                        ♡
                    </div>

                    <h2>
                        No favorites yet
                    </h2>

                    <p>
                        Browse properties and add the
                        ones you like to your shortlist.
                    </p>

                    <Link
                        to="/properties"
                        className="browse-properties-btn"
                    >
                        Browse Properties
                    </Link>

                </div>

            )}


            {/* FAVORITE PROPERTY CARDS */}

            {favorites.length > 0 && (

                <div className="favorites-grid">

                    {favorites.map((property) => (

                        <div
                            className="favorite-card"
                            key={property.id}
                        >

                            {/* IMAGE */}

                            <img
                                src={property.cover_image}
                                alt={property.title}
                                loading="lazy"
                            />


                            {/* CONTENT */}

                            <div className="favorite-card-content">

                                <h2>
                                    {property.title}
                                </h2>


                                <p className="favorite-location">
                                    📍 {property.locality},{" "}
                                    {property.city}
                                </p>


                                <div className="favorite-details">

                                    <strong>
                                        ₹
                                        {Number(
                                            property.price
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                    <span>
                                        {property.bhk} BHK
                                    </span>

                                    <span>
                                        {property.area_sqft} sq ft
                                    </span>

                                </div>


                                <p>
                                    {property.description}
                                </p>


                                {/* ACTIONS */}

                                <div className="favorite-actions">

                                    <Link
                                        to={`/properties/${property.id}`}
                                        className="view-favorite-btn"
                                    >
                                        View Details
                                    </Link>


                                    <button
                                        className="remove-favorite-btn"
                                        onClick={() =>
                                            handleRemove(
                                                property.id
                                            )
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}


export default Favorites;