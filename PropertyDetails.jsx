import { useEffect, useState } from "react";
import {
    useParams,
    Link,
    useNavigate
} from "react-router-dom";

import {
    getProperty,
    addFavorite
} from "../api";


function PropertyDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] =
        useState(null);

    useEffect(() => {
        loadProperty();
    }, [id]);


    async function loadProperty() {

        try {

            setLoading(true);

            const data = await getProperty(id);

            setProperty(data);

            if (
                data.images &&
                data.images.length > 0
            ) {
                setSelectedImage(
                    data.images[0].image_url
                );
            } else {
                setSelectedImage(
                    data.cover_image
                );
            }

        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Failed to load property"
            );

        } finally {

            setLoading(false);
        }
    }


    async function handleFavorite() {

        const token =
            localStorage.getItem(
                "realbook_token"
            );

        if (!token) {
            navigate("/login");
            return;
        }

        try {

            await addFavorite(property.id);

            alert(
                "Property added to favorites ❤️"
            );

        } catch (error) {

            alert(
                error.message ||
                "Failed to add favorite"
            );
        }
    }


    function handleBookTour() {

        const token =
            localStorage.getItem(
                "realbook_token"
            );

        if (!token) {
            navigate("/login");
            return;
        }

        navigate(
            `/book/${property.id}`
        );
    }


    if (loading) {

        return (
            <div className="page-container">

                <div className="loading">
                    Loading property...
                </div>

            </div>
        );
    }


    if (!property) {

        return (
            <div className="page-container">

                <h2>
                    Property not found
                </h2>

                <Link to="/properties">
                    ← Back to Properties
                </Link>

            </div>
        );
    }


    const galleryImages =
        property.images &&
        property.images.length > 0
            ? property.images
            : property.cover_image
                ? [
                    {
                        id: "cover",
                        image_url:
                            property.cover_image
                    }
                ]
                : [];


    return (
        <div className="property-details-page">

            {/* =========================
                TOP
            ========================= */}

            <div className="details-container">

                <Link
                    to="/properties"
                    className="back-link"
                >
                    ← Back to Properties
                </Link>


                {/* =========================
                    GALLERY
                ========================= */}

                <div className="property-gallery">

                    <div className="main-property-image">

                        {selectedImage ? (

                            <img
                                src={selectedImage}
                                alt={property.title}
                            />

                        ) : (

                            <div className="no-image">
                                No Image Available
                            </div>

                        )}

                    </div>


                    {galleryImages.length > 1 && (

                        <div className="gallery-thumbnails">

                            {galleryImages.map(
                                (image) => (

                                    <button
                                        key={image.id}
                                        type="button"
                                        className={
                                            selectedImage ===
                                            image.image_url
                                                ? "gallery-thumbnail active"
                                                : "gallery-thumbnail"
                                        }
                                        onClick={() =>
                                            setSelectedImage(
                                                image.image_url
                                            )
                                        }
                                    >

                                        <img
                                            src={
                                                image.image_url
                                            }
                                            alt={
                                                property.title
                                            }
                                            loading="lazy"
                                        />

                                    </button>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* =========================
                    PROPERTY HEADER
                ========================= */}

                <div className="property-detail-header">

                    <div>

                        <span className="property-type-badge">
                            {property.property_type}
                        </span>

                        <h1>
                            {property.title}
                        </h1>

                        <p className="property-location">
                            📍 {property.locality},{" "}
                            {property.city}
                        </p>

                    </div>


                    <div className="property-price-large">

                        ₹
                        {Number(
                            property.price
                        ).toLocaleString("en-IN")}

                        <span>
                            / month
                        </span>

                    </div>

                </div>


                {/* =========================
                    QUICK DETAILS
                ========================= */}

                <div className="property-quick-info">

                    <div>
                        <strong>
                            🛏️ {property.bhk}
                        </strong>

                        <span>
                            BHK
                        </span>
                    </div>


                    <div>
                        <strong>
                            📐{" "}
                            {property.area_sqft ||
                                "—"}
                        </strong>

                        <span>
                            sq ft
                        </span>
                    </div>


                    <div>
                        <strong>
                            🏠{" "}
                            {property.property_type}
                        </strong>

                        <span>
                            Type
                        </span>
                    </div>


                    <div>
                        <strong>
                            📅{" "}
                            {property.available_from
                                ? new Date(
                                    property.available_from
                                ).toLocaleDateString(
                                    "en-IN"
                                )
                                : "Available"}
                        </strong>

                        <span>
                            Available From
                        </span>
                    </div>

                </div>


                {/* =========================
                    MAIN CONTENT
                ========================= */}

                <div className="property-detail-grid">


                    {/* LEFT */}

                    <div className="property-detail-main">

                        <section className="detail-section">

                            <h2>
                                About this property
                            </h2>

                            <p>
                                {property.description ||
                                    "No description available."}
                            </p>

                        </section>


                        {/* AMENITIES */}

                        <section className="detail-section">

                            <h2>
                                Amenities
                            </h2>


                            {property.amenities &&
                            property.amenities.length > 0 ? (

                                <div className="property-amenities-grid">

                                    {property.amenities.map(
                                        (amenity) => (

                                            <div
                                                className="property-amenity"
                                                key={
                                                    amenity.id
                                                }
                                            >

                                                <span>
                                                    ✓
                                                </span>

                                                <span>
                                                    {amenity.name}
                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                <p className="muted-text">
                                    No amenities listed.
                                </p>

                            )}

                        </section>


                        {/* ADDRESS */}

                        <section className="detail-section">

                            <h2>
                                Location
                            </h2>

                            <p>
                                📍{" "}
                                {property.address ||
                                    property.locality}
                                ,{" "}
                                {property.city}
                            </p>

                        </section>

                    </div>


                    {/* RIGHT SIDEBAR */}

                    <aside className="property-sidebar">

                        <div className="booking-card">

                            <h3>
                                Interested in this
                                property?
                            </h3>

                            <p>
                                Book a 30-minute virtual
                                tour with the landlord.
                            </p>


                            <button
                                className="tour-btn"
                                onClick={
                                    handleBookTour
                                }
                            >
                                📅 Book Virtual Tour
                            </button>


                            <button
                                className="favorite-btn"
                                onClick={
                                    handleFavorite
                                }
                            >
                                ❤️ Add to Favorites
                            </button>

                        </div>


                        {/* LANDLORD */}

                        <div className="landlord-card">

                            <h3>
                                Property Owner
                            </h3>

                            <div className="landlord-info">

                                <div className="landlord-avatar">
                                    👤
                                </div>

                                <div>

                                    <strong>
                                        {
                                            property.landlord_name
                                        }
                                    </strong>

                                    <p>
                                        Landlord
                                    </p>

                                </div>

                            </div>


                            {property.landlord_email && (

                                <p>
                                    📧{" "}
                                    {
                                        property.landlord_email
                                    }
                                </p>

                            )}


                            {property.landlord_phone && (

                                <p>
                                    📞{" "}
                                    {
                                        property.landlord_phone
                                    }
                                </p>

                            )}

                        </div>

                    </aside>

                </div>

            </div>

        </div>
    );
}


export default PropertyDetails;