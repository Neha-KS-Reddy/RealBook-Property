const API_URL = "http://localhost:5000/api";

// ==========================================
// GET ALL PROPERTIES
// ==========================================

export async function getProperties() {

    const response = await fetch(
        `${API_URL}/properties`
    );

    if (!response.ok) {
        throw new Error("Failed to load properties");
    }

    return await response.json();
}


// ==========================================
// GET SINGLE PROPERTY
// ==========================================

export async function getProperty(id) {

    const response = await fetch(
        `${API_URL}/properties/${id}`
    );

    if (!response.ok) {
        throw new Error("Failed to load property");
    }

    return await response.json();
}


// ==========================================
// ADD FAVORITE
// ==========================================

export async function addFavorite(propertyId) {

    const token =
        localStorage.getItem("realbook_token");

    if (!token) {
        throw new Error(
            "Please login to add favorites"
        );
    }


    const response = await fetch(
        `${API_URL}/favorites/${propertyId}`,
        {
            method: "POST",

            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );


    const data = await response.json();


    if (!response.ok) {
        throw new Error(
            data.message || "Failed to add favorite"
        );
    }


    return data;
}


// ==========================================
// GET MY FAVORITES
// ==========================================

export async function getFavorites() {

    const token =
        localStorage.getItem("realbook_token");

    if (!token) {
        throw new Error(
            "Please login to view favorites"
        );
    }


    const response = await fetch(
        `${API_URL}/favorites`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );


    const data = await response.json();


    if (!response.ok) {
        throw new Error(
            data.message || "Failed to load favorites"
        );
    }


    return data;
}


// ==========================================
// REMOVE FAVORITE
// ==========================================

export async function removeFavorite(propertyId) {

    const token =
        localStorage.getItem("realbook_token");

    if (!token) {
        throw new Error(
            "Please login to remove favorites"
        );
    }


    const response = await fetch(
        `${API_URL}/favorites/${propertyId}`,
        {
            method: "DELETE",

            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );


    const data = await response.json();


    if (!response.ok) {
        throw new Error(
            data.message || "Failed to remove favorite"
        );
    }


    return data;
}
// ==========================================
// CREATE VIRTUAL TOUR BOOKING
// ==========================================

export async function createBooking(
    propertyId,
    bookingDate,
    startTime
) {
    const token =
        localStorage.getItem("realbook_token");

    if (!token) {
        throw new Error("Please login to book a tour");
    }

    const response = await fetch(
        `${API_URL}/bookings`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
                property_id: propertyId,
                booking_date: bookingDate,
                start_time: startTime
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to create booking"
        );
    }

    return data;
}


// ==========================================
// GET MY BOOKINGS
// ==========================================

export async function getMyBookings() {
    const token =
        localStorage.getItem("realbook_token");

    if (!token) {
        throw new Error("Please login");
    }

    const response = await fetch(
        `${API_URL}/bookings/my`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to load bookings"
        );
    }

    return data;
}


// ==========================================
// GET LANDLORD BOOKINGS
// ==========================================

export async function getLandlordBookings() {
    const token =
        localStorage.getItem("realbook_token");

    if (!token) {
        throw new Error("Please login");
    }

    const response = await fetch(
        `${API_URL}/bookings/landlord`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to load landlord bookings"
        );
    }

    return data;
}


// ==========================================
// CONFIRM BOOKING
// ==========================================

export async function confirmBooking(bookingId) {

    const token =
        localStorage.getItem("realbook_token");

    const response = await fetch(
        `${API_URL}/bookings/${bookingId}/confirm`,
        {
            method: "PUT",

            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to confirm booking"
        );
    }

    return data;
}


// ==========================================
// CANCEL BOOKING
// ==========================================

export async function cancelBooking(bookingId) {

    const token =
        localStorage.getItem("realbook_token");

    const response = await fetch(
        `${API_URL}/bookings/${bookingId}/cancel`,
        {
            method: "PUT",

            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to cancel booking"
        );
    }

    return data;
}
// ==========================================
// GET LANDLORD'S PROPERTIES
// ==========================================

export async function getLandlordProperties() {

    const token =
        localStorage.getItem(
            "realbook_token"
        );

    if (!token) {
        throw new Error(
            "Please login"
        );
    }

    const response =
        await fetch(
            `${API_URL}/properties/landlord/my-properties`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to load properties"
        );

    }

    return data;
}
// ==========================================
// ADD PROPERTY
// ==========================================

export async function addProperty(propertyData) {

    const token =
        localStorage.getItem(
            "realbook_token"
        );

    if (!token) {

        throw new Error(
            "Please login as a landlord"
        );

    }

    const response =
        await fetch(
            `${API_URL}/properties`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify(
                        propertyData
                    )
            }
        );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to add property"
        );

    }

    return data;
}
// ==========================================
// UPDATE PROPERTY
// ==========================================

export async function updateProperty(
    propertyId,
    propertyData
) {

    const token =
        localStorage.getItem(
            "realbook_token"
        );

    if (!token) {
        throw new Error("Please login");
    }

    const response =
        await fetch(
            `${API_URL}/properties/${propertyId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify(
                        propertyData
                    )
            }
        );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to update property"
        );

    }

    return data;
}


// ==========================================
// DELETE PROPERTY
// ==========================================

export async function deleteProperty(
    propertyId
) {

    const token =
        localStorage.getItem(
            "realbook_token"
        );

    if (!token) {
        throw new Error("Please login");
    }

    const response =
        await fetch(
            `${API_URL}/properties/${propertyId}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to delete property"
        );

    }

    return data;
}
// =========================
// PROPERTY GALLERY
// =========================

export async function addPropertyImage(propertyId, imageUrl) {
    const token = localStorage.getItem("realbook_token");

    const response = await fetch(
        `${API_URL}/properties/${propertyId}/images`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                image_url: imageUrl
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to add image"
        );
    }

    return data;
}


export async function deletePropertyImage(
    propertyId,
    imageId
) {
    const token = localStorage.getItem("realbook_token");

    const response = await fetch(
        `${API_URL}/properties/${propertyId}/images/${imageId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to delete image"
        );
    }

    return data;
}


// =========================
// AMENITIES
// =========================

export async function getAmenities() {
    const response = await fetch(
        `${API_URL}/properties/amenities/all`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to load amenities"
        );
    }

    return data;
}


export async function updatePropertyAmenities(
    propertyId,
    amenityIds
) {
    const token = localStorage.getItem("realbook_token");

    const response = await fetch(
        `${API_URL}/properties/${propertyId}/amenities`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                amenity_ids: amenityIds
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to update amenities"
        );
    }

    return data;
}