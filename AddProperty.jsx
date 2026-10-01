import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import {
    addProperty
} from "../api";


function AddProperty() {

    const navigate = useNavigate();

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


    const [formData, setFormData] =
        useState({

            title: "",
            description: "",
            locality: "",
            city: "Mumbai",
            address: "",
            price: "",
            bhk: "1",
            area_sqft: "",
            property_type: "Apartment",
            cover_image: "",
            available_from: ""

        });


    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    function handleChange(e) {

        const {
            name,
            value
        } = e.target;

        setFormData(
            current => ({
                ...current,
                [name]: value
            })
        );

    }


    // ==========================================
    // SUBMIT
    // ==========================================

    async function handleSubmit(e) {

        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);


        try {

            const result =
                await addProperty(
                    formData
                );

            setSuccess(
                result.message
            );


            setTimeout(() => {

                navigate(
                    "/landlord/properties"
                );

            }, 1000);


        } catch (err) {

            setError(
                err.message ||
                "Failed to add property"
            );

        } finally {

            setLoading(false);

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


    return (

        <div className="add-property-page">

            <div className="add-property-container">


                {/* HEADER */}

                <div className="add-property-header">

                    <h1>
                        Add New Property
                    </h1>

                    <p>
                        Create a property listing
                        for tenants.
                    </p>

                </div>


                {/* FORM */}

                <form
                    className="property-form"
                    onSubmit={handleSubmit}
                >


                    {/* TITLE */}

                    <div className="form-group">

                        <label>
                            Property Title *
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Example: Modern 2 BHK Apartment"
                            required
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the property..."
                            rows="5"
                        />

                    </div>


                    {/* LOCALITY + CITY */}

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Locality *
                            </label>

                            <input
                                type="text"
                                name="locality"
                                value={formData.locality}
                                onChange={handleChange}
                                placeholder="Powai"
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


                    {/* ADDRESS */}

                    <div className="form-group">

                        <label>
                            Full Address
                        </label>

                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Street / Road / Area"
                        />

                    </div>


                    {/* PRICE + BHK */}

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Monthly Rent (₹) *
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="42000"
                                min="1"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                BHK *
                            </label>

                            <select
                                name="bhk"
                                value={formData.bhk}
                                onChange={handleChange}
                                required
                            >

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


                    {/* AREA + TYPE */}

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
                                placeholder="1150"
                                min="1"
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


                    {/* COVER IMAGE */}

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

                        <small>
                            Paste an image URL from
                            Unsplash or another image host.
                        </small>

                    </div>


                    {/* AVAILABLE FROM */}

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


                    {/* ERROR */}

                    {error && (

                        <div className="booking-error">
                            {error}
                        </div>

                    )}


                    {/* SUCCESS */}

                    {success && (

                        <div className="booking-success">
                            {success}
                        </div>

                    )}


                    {/* BUTTONS */}

                    <div className="property-form-actions">

                        <button
                            type="button"
                            className="cancel-form-btn"
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
                            className="save-property-btn"
                            disabled={loading}
                        >

                            {loading
                                ? "Saving..."
                                : "Add Property"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}


export default AddProperty;