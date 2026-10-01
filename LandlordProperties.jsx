import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";

import {
    getLandlordProperties,
    deleteProperty
} from "../api";


function LandlordProperties() {

    const token =
        localStorage.getItem(
            "realbook_token"
        );

    const user =
        JSON.parse(
            localStorage.getItem(
                "realbook_user"
            )
        );

    const [properties, setProperties] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [deletingId, setDeletingId] =
        useState(null);


    // ==========================================
    // LOAD PROPERTIES
    // ==========================================

    useEffect(() => {

        async function loadProperties() {

            try {

                const data =
                    await getLandlordProperties();

                setProperties(data);

            } catch (err) {

                console.error(err);

                setError(
                    err.message ||
                    "Failed to load properties"
                );

            } finally {

                setLoading(false);

            }

        }


        if (
            token &&
            user?.role === "landlord"
        ) {

            loadProperties();

        } else {

            setLoading(false);

        }

    }, [token]);


    // ==========================================
    // DELETE PROPERTY
    // ==========================================

    async function handleDelete(propertyId) {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this property?\n\nThis action cannot be undone."
            );


        if (!confirmed) {
            return;
        }


        try {

            setDeletingId(propertyId);

            setError("");


            await deleteProperty(
                propertyId
            );


            // Remove deleted property
            // from the screen immediately

            setProperties(
                (currentProperties) =>
                    currentProperties.filter(
                        (property) =>
                            property.id !== propertyId
                    )
            );


        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Failed to delete property"
            );

        } finally {

            setDeletingId(null);

        }

    }


    // ==========================================
    // AUTH CHECK
    // ==========================================

    if (!token) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    if (
        !user ||
        user.role !== "landlord"
    ) {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );

    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="landlord-properties-page">

                <div className="landlord-properties-container">

                    <h1>
                        My Properties
                    </h1>

                    <p>
                        Loading properties...
                    </p>

                </div>

            </div>
        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="landlord-properties-page">

            <div className="landlord-properties-container">


                {/* ==================================
                    HEADER
                ================================== */}

                <div className="landlord-properties-header">

                    <div>

                        <h1>
                            My Properties
                        </h1>

                        <p>
                            Manage your property listings.
                        </p>

                    </div>


                    <div className="landlord-property-header-actions">

                        <Link
                            to="/dashboard"
                            className="landlord-back-btn"
                        >
                            ← Dashboard
                        </Link>


                        <Link
                            to="/landlord/add-property"
                            className="add-property-btn"
                        >
                            + Add Property
                        </Link>

                    </div>

                </div>


                {/* ==================================
                    ERROR
                ================================== */}

                {error && (

                    <div className="booking-error">

                        {error}

                    </div>

                )}


                {/* ==================================
                    EMPTY STATE
                ================================== */}

                {!error &&
                    properties.length === 0 && (

                    <div className="empty-landlord-properties">

                        <div className="empty-property-icon">
                            🏠
                        </div>

                        <h2>
                            No properties yet
                        </h2>

                        <p>
                            Add your first property
                            to start receiving
                            tenant requests.
                        </p>

                        <Link
                            to="/landlord/add-property"
                            className="add-property-btn"
                        >
                            + Add Your First Property
                        </Link>

                    </div>

                )}


                {/* ==================================
                    PROPERTY LIST
                ================================== */}

                <div className="landlord-property-grid">

                    {properties.map(
                        (property) => (

                        <div
                            className="landlord-property-card"
                            key={property.id}
                        >


                            {/* ==========================
                                IMAGE
                            ========================== */}

                            <div className="landlord-property-image">

                                {property.cover_image ? (

                                    <img
                                        src={
                                            property.cover_image
                                        }
                                        alt={
                                            property.title
                                        }
                                        loading="lazy"
                                    />

                                ) : (

                                    <div className="property-image-placeholder">

                                        🏠

                                    </div>

                                )}

                            </div>


                            {/* ==========================
                                DETAILS
                            ========================== */}

                            <div className="landlord-property-content">

                                <h2>
                                    {property.title}
                                </h2>


                                <p className="landlord-property-location">

                                    📍{" "}

                                    {property.locality}

                                    {property.city &&
                                        `, ${property.city}`
                                    }

                                </p>


                                {/* PROPERTY META */}

                                <div className="landlord-property-meta">

                                    <span>

                                        🛏️{" "}

                                        {property.bhk}

                                        {" "}BHK

                                    </span>


                                    {property.area_sqft && (

                                        <span>

                                            📐{" "}

                                            {Number(
                                                property.area_sqft
                                            ).toLocaleString(
                                                "en-IN"
                                            )}

                                            {" "}sq ft

                                        </span>

                                    )}

                                </div>


                                {/* PRICE */}

                                <div className="landlord-property-price">

                                    ₹

                                    {Number(
                                        property.price
                                    ).toLocaleString(
                                        "en-IN"
                                    )}

                                    <span>
                                        / month
                                    </span>

                                </div>


                                {/* ==========================
                                    ACTIONS
                                ========================== */}

                                <div className="landlord-property-actions">


                                    {/* VIEW */}

                                    <Link
                                        to={`/properties/${property.id}`}
                                        className="view-property-btn"
                                    >
                                        View
                                    </Link>


                                    {/* EDIT */}

                                    <Link
                                        to={`/landlord/edit-property/${property.id}`}
                                        className="edit-property-btn"
                                    >
                                        Edit
                                    </Link>


                                    {/* DELETE */}

                                    <button
                                        type="button"
                                        className="delete-property-btn"
                                        onClick={() =>
                                            handleDelete(
                                                property.id
                                            )
                                        }
                                        disabled={
                                            deletingId ===
                                            property.id
                                        }
                                    >

                                        {deletingId ===
                                        property.id
                                            ? "Deleting..."
                                            : "Delete"
                                        }

                                    </button>

                                </div>

                            </div>

                        </div>

                    )
                    )}

                </div>

            </div>

        </div>

    );

}


export default LandlordProperties;