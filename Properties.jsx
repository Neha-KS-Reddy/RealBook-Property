import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProperties } from "../api";

function Properties() {
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [locality, setLocality] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [bhk, setBhk] = useState("");
    const [propertyType, setPropertyType] = useState("");

    // Load properties from backend
    useEffect(() => {
        async function loadProperties() {
            try {
                const data = await getProperties();

                setProperties(data);
                setFilteredProperties(data);
            } catch (err) {
                console.error("Property loading error:", err);

                setError("Unable to load properties.");
            } finally {
                setLoading(false);
            }
        }

        loadProperties();
    }, []);

    // Apply filters
    function applyFilters() {
        let result = [...properties];

        // Locality
        if (locality.trim() !== "") {
            result = result.filter((property) =>
                property.locality
                    ?.toLowerCase()
                    .includes(locality.toLowerCase())
            );
        }

        // Minimum price
        if (minPrice !== "") {
            result = result.filter(
                (property) =>
                    Number(property.price) >= Number(minPrice)
            );
        }

        // Maximum price
        if (maxPrice !== "") {
            result = result.filter(
                (property) =>
                    Number(property.price) <= Number(maxPrice)
            );
        }

        // BHK
        if (bhk !== "") {
            if (bhk === "5") {
                result = result.filter(
                    (property) => Number(property.bhk) >= 5
                );
            } else {
                result = result.filter(
                    (property) =>
                        Number(property.bhk) === Number(bhk)
                );
            }
        }

        // Property type
        if (propertyType !== "") {
            result = result.filter(
                (property) =>
                    property.property_type === propertyType
            );
        }

        setFilteredProperties(result);
    }

    // Reset filters
    function resetFilters() {
        setLocality("");
        setMinPrice("");
        setMaxPrice("");
        setBhk("");
        setPropertyType("");

        setFilteredProperties(properties);
    }

    // Loading state
    if (loading) {
        return (
            <div className="properties-page">
                <div className="properties-header">
                    <h1>Loading properties...</h1>
                    <p>
                        Please wait while we find available properties.
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="properties-page">
                <div className="properties-header">
                    <h1>{error}</h1>

                    <p>
                        Please make sure the RealBook backend is
                        running on port 5000.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="properties-page">

            {/* PAGE HEADER */}

            <div className="properties-header">
                <h1>Available Properties</h1>

                <p>
                    Find your perfect property with RealBook.
                </p>
            </div>


            {/* SEARCH FILTERS */}

            <div className="property-filters">

                {/* LOCALITY */}

                <div className="filter-group">

                    <label>
                        Locality
                    </label>

                    <input
                        type="text"
                        placeholder="e.g. Powai"
                        value={locality}
                        onChange={(e) =>
                            setLocality(e.target.value)
                        }
                    />

                </div>


                {/* MINIMUM PRICE */}

                <div className="filter-group">

                    <label>
                        Min Price
                    </label>

                    <input
                        type="number"
                        placeholder="₹ Minimum"
                        value={minPrice}
                        onChange={(e) =>
                            setMinPrice(e.target.value)
                        }
                    />

                </div>


                {/* MAXIMUM PRICE */}

                <div className="filter-group">

                    <label>
                        Max Price
                    </label>

                    <input
                        type="number"
                        placeholder="₹ Maximum"
                        value={maxPrice}
                        onChange={(e) =>
                            setMaxPrice(e.target.value)
                        }
                    />

                </div>


                {/* BHK */}

                <div className="filter-group">

                    <label>
                        BHK
                    </label>

                    <select
                        value={bhk}
                        onChange={(e) =>
                            setBhk(e.target.value)
                        }
                    >

                        <option value="">
                            Any BHK
                        </option>

                        <option value="1">
                            1 BHK
                        </option>

                        <option value="2">
                            2 BHK
                        </option>

                        <option value="3">
                            3 BHK
                        </option>

                        <option value="4">
                            4 BHK
                        </option>

                        <option value="5">
                            5+ BHK
                        </option>

                    </select>

                </div>


                {/* PROPERTY TYPE */}

                <div className="filter-group">

                    <label>
                        Property Type
                    </label>

                    <select
                        value={propertyType}
                        onChange={(e) =>
                            setPropertyType(e.target.value)
                        }
                    >

                        <option value="">
                            Any Type
                        </option>

                        <option value="Apartment">
                            Apartment
                        </option>

                        <option value="Villa">
                            Villa
                        </option>

                        <option value="Independent House">
                            Independent House
                        </option>

                        <option value="Studio">
                            Studio
                        </option>

                        <option value="Office">
                            Office
                        </option>

                    </select>

                </div>


                {/* BUTTONS */}

                <div className="filter-buttons">

                    <button
                        className="search-btn"
                        onClick={applyFilters}
                    >
                        Search
                    </button>

                    <button
                        className="reset-btn"
                        onClick={resetFilters}
                    >
                        Reset
                    </button>

                </div>

            </div>


            {/* RESULT COUNT */}

            <div className="results-count">

                <strong>
                    {filteredProperties.length}
                </strong>{" "}

                {filteredProperties.length === 1
                    ? "property found"
                    : "properties found"}

            </div>


            {/* PROPERTY RESULTS */}

            {filteredProperties.length === 0 ? (

                <div className="no-properties">

                    <h2>
                        No properties found
                    </h2>

                    <p>
                        Try changing your search filters.
                    </p>

                    <button
                        className="reset-btn"
                        onClick={resetFilters}
                    >
                        Reset Filters
                    </button>

                </div>

            ) : (

                <div className="property-grid">

                    {filteredProperties.map((property) => (

                        <div
                            className="property-card"
                            key={property.id}
                        >

                            {/* PROPERTY IMAGE */}

                            <img
                                src={property.cover_image}
                                alt={property.title}
                                loading="lazy"
                            />


                            {/* PROPERTY CONTENT */}

                            <div className="property-content">

                                <h2>
                                    {property.title}
                                </h2>


                                <p className="property-location">
                                    📍 {property.locality},{" "}
                                    {property.city}
                                </p>


                                <p>
                                    {property.description}
                                </p>


                                {/* PROPERTY DETAILS */}

                                <div className="property-details">

                                    <span>
                                        ₹
                                        {Number(
                                            property.price
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>

                                    <span>
                                        {property.bhk} BHK
                                    </span>

                                    <span>
                                        {property.area_sqft} sq ft
                                    </span>

                                </div>


                                {/* PROPERTY TYPE */}

                                <p>
                                    <strong>
                                        Type:
                                    </strong>{" "}
                                    {property.property_type}
                                </p>


                                {/* VIEW DETAILS BUTTON */}

                                <Link
                                    to={`/properties/${property.id}`}
                                    className="view-details-btn"
                                >
                                    View Details →
                                </Link>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Properties;