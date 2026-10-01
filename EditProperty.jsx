import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getProperty,
    updateProperty,
    addPropertyImage,
    deletePropertyImage,
    getAmenities,
    updatePropertyAmenities
} from "../api";


function EditProperty() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [property, setProperty] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        locality: "",
        city: "",
        address: "",
        price: "",
        bhk: "",
        area_sqft: "",
        property_type: "Apartment",
        cover_image: "",
        available_from: ""
    });

    // Gallery
    const [images, setImages] = useState([]);
    const [newImageUrl, setNewImageUrl] = useState("");
    const [imageLoading, setImageLoading] = useState(false);

    // Amenities
    const [amenities, setAmenities] = useState([]);
    const [selectedAmenities, setSelectedAmenities] =
        useState([]);

    useEffect(() => {
        loadProperty();
        loadAmenities();
    }, [id]);


    async function loadProperty() {

        try {

            setLoading(true);

            const data = await getProperty(id);

            setProperty(data);

            setFormData({
                title: data.title || "",
                description: data.description || "",
                locality: data.locality || "",
                city: data.city || "",
                address: data.address || "",
                price: data.price || "",
                bhk: data.bhk || "",
                area_sqft: data.area_sqft || "",
                property_type:
                    data.property_type || "Apartment",
                cover_image:
                    data.cover_image || "",
                available_from:
                    data.available_from
                        ? data.available_from.substring(0, 10)
                        : ""
            });

            setImages(data.images || []);

            setSelectedAmenities(
                (data.amenities || []).map(
                    (amenity) => amenity.id
                )
            );

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


    async function loadAmenities() {

        try {

            const data = await getAmenities();

            setAmenities(data);

        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Failed to load amenities"
            );
        }
    }


    function handleChange(event) {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    }


    function handleAmenityChange(amenityId) {

        setSelectedAmenities((previous) => {

            if (previous.includes(amenityId)) {

                return previous.filter(
                    (id) => id !== amenityId
                );

            }

            return [
                ...previous,
                amenityId
            ];
        });
    }


    async function handleSubmit(event) {

        event.preventDefault();

        try {

            setSaving(true);

            await updateProperty(
                id,
                formData
            );

            await updatePropertyAmenities(
                id,
                selectedAmenities
            );

            alert(
                "Property updated successfully!"
            );

            navigate(
                "/landlord/properties"
            );

        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Failed to update property"
            );

        } finally {

            setSaving(false);
        }
    }


    async function handleAddImage() {

        if (!newImageUrl.trim()) {
            alert("Please enter an image URL");
            return;
        }

        try {

            setImageLoading(true);

            await addPropertyImage(
                id,
                newImageUrl.trim()
            );

            setNewImageUrl("");

            await loadProperty();

            alert(
                "Gallery image added successfully!"
            );

        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Failed to add image"
            );

        } finally {

            setImageLoading(false);
        }
    }


    async function handleDeleteImage(imageId) {

        const confirmed =
            window.confirm(
                "Delete this gallery image?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setImageLoading(true);

            await deletePropertyImage(
                id,
                imageId
            );

            await loadProperty();

        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Failed to delete image"
            );

        } finally {

            setImageLoading(false);
        }
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
                <h2>Property not found</h2>
            </div>
        );
    }


    return (
        <div className="page-container">

            <div className="form-container">

                <h1>Edit Property</h1>

                <p className="form-subtitle">
                    Update your property details,
                    gallery and amenities.
                </p>


                <form onSubmit={handleSubmit}>

                    {/* BASIC DETAILS */}

                    <h3 className="form-section-title">
                        Property Details
                    </h3>


                    <div className="form-group">

                        <label>
                            Property Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="5"
                        />

                    </div>


                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Locality
                            </label>

                            <input
                                type="text"
                                name="locality"
                                value={formData.locality}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                City
                            </label>

                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />

                        </div>

                    </div>


                    <div className="form-group">

                        <label>
                            Address
                        </label>

                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />

                    </div>


                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Monthly Rent (₹)
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                BHK
                            </label>

                            <select
                                name="bhk"
                                value={formData.bhk}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select BHK
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
                                    5 BHK
                                </option>

                            </select>

                        </div>

                    </div>


                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Area (sq ft)
                            </label>

                            <input
                                type="number"
                                name="area_sqft"
                                value={formData.area_sqft}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Property Type
                            </label>

                            <select
                                name="property_type"
                                value={formData.property_type}
                                onChange={handleChange}
                            >

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

                    </div>


                    <div className="form-group">

                        <label>
                            Cover Image URL
                        </label>

                        <input
                            type="url"
                            name="cover_image"
                            value={formData.cover_image}
                            onChange={handleChange}
                            placeholder="https://..."
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Available From
                        </label>

                        <input
                            type="date"
                            name="available_from"
                            value={formData.available_from}
                            onChange={handleChange}
                        />

                    </div>


                    {/* GALLERY */}

                    <div className="property-management-section">

                        <h3 className="form-section-title">
                            🖼️ Property Gallery
                        </h3>

                        <p className="form-help">
                            Add multiple images to show
                            tenants the property.
                        </p>


                        <div className="gallery-add-row">

                            <input
                                type="url"
                                value={newImageUrl}
                                onChange={(event) =>
                                    setNewImageUrl(
                                        event.target.value
                                    )
                                }
                                placeholder="Paste image URL"
                            />

                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={handleAddImage}
                                disabled={imageLoading}
                            >
                                {imageLoading
                                    ? "Adding..."
                                    : "＋ Add Image"}
                            </button>

                        </div>


                        {images.length > 0 ? (

                            <div className="edit-gallery-grid">

                                {images.map((image) => (

                                    <div
                                        className="edit-gallery-item"
                                        key={image.id}
                                    >

                                        <img
                                            src={image.image_url}
                                            alt="Property"
                                            loading="lazy"
                                        />

                                        <button
                                            type="button"
                                            className="gallery-delete-btn"
                                            onClick={() =>
                                                handleDeleteImage(
                                                    image.id
                                                )
                                            }
                                        >
                                            🗑 Delete
                                        </button>

                                    </div>

                                ))}

                            </div>

                        ) : (

                            <div className="empty-gallery">
                                No gallery images added yet.
                            </div>

                        )}

                    </div>


                    {/* AMENITIES */}

                    <div className="property-management-section">

                        <h3 className="form-section-title">
                            ⭐ Amenities
                        </h3>

                        <p className="form-help">
                            Select all amenities available
                            at this property.
                        </p>


                        <div className="amenities-grid">

                            {amenities.map(
                                (amenity) => (

                                    <label
                                        className="amenity-checkbox"
                                        key={amenity.id}
                                    >

                                        <input
                                            type="checkbox"
                                            checked={selectedAmenities.includes(
                                                amenity.id
                                            )}
                                            onChange={() =>
                                                handleAmenityChange(
                                                    amenity.id
                                                )
                                            }
                                        />

                                        <span>
                                            {amenity.name}
                                        </span>

                                    </label>

                                )
                            )}

                        </div>

                    </div>


                    {/* BUTTONS */}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() =>
                                navigate(
                                    "/landlord/properties"
                                )
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditProperty;