import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";

import {
    getMyBookings,
    cancelBooking
} from "../api";


function Bookings() {

    const token =
        localStorage.getItem("realbook_token");

    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [cancelLoading, setCancelLoading] =
        useState(null);


    // ==========================================
    // LOAD BOOKINGS
    // ==========================================

    useEffect(() => {

        async function loadBookings() {

            try {

                const data =
                    await getMyBookings();

                setBookings(data);

            } catch (err) {

                console.error(err);

                setError(
                    err.message ||
                    "Unable to load bookings"
                );

            } finally {

                setLoading(false);

            }

        }

        if (token) {
            loadBookings();
        }

    }, [token]);


    // ==========================================
    // CANCEL BOOKING
    // ==========================================

    async function handleCancel(id) {

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this virtual tour?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setCancelLoading(id);

            await cancelBooking(id);

            setBookings((current) =>
                current.map((booking) =>
                    booking.id === id
                        ? {
                            ...booking,
                            status: "cancelled"
                        }
                        : booking
                )
            );

        } catch (err) {

            alert(
                err.message ||
                "Failed to cancel booking"
            );

        } finally {

            setCancelLoading(null);

        }

    }


    // ==========================================
    // LOGIN CHECK
    // ==========================================

    if (!token) {

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
            <div className="bookings-page">

                <div className="bookings-container">

                    <h1>
                        My Bookings
                    </h1>

                    <p>
                        Loading your bookings...
                    </p>

                </div>

            </div>
        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="bookings-page">

            <div className="bookings-container">

                <div className="bookings-header">

                    <div>

                        <h1>
                            My Bookings
                        </h1>

                        <p>
                            Manage your virtual property tours.
                        </p>

                    </div>

                    <Link
                        to="/properties"
                        className="booking-browse-btn"
                    >
                        Browse Properties
                    </Link>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="booking-error">
                        {error}
                    </div>

                )}


                {/* EMPTY STATE */}

                {!error &&
                    bookings.length === 0 && (

                        <div className="empty-bookings">

                            <div className="empty-bookings-icon">
                                📅
                            </div>

                            <h2>
                                No bookings yet
                            </h2>

                            <p>
                                Book a virtual tour for
                                a property you're interested in.
                            </p>

                            <Link
                                to="/properties"
                                className="booking-browse-btn"
                            >
                                Explore Properties
                            </Link>

                        </div>

                    )}


                {/* BOOKINGS */}

                <div className="bookings-list">

                    {bookings.map((booking) => (

                        <div
                            className="booking-item"
                            key={booking.id}
                        >

                            {/* PROPERTY IMAGE */}

                            <div className="booking-property-image">

                                <img
                                    src={booking.cover_image}
                                    alt={booking.property_title}
                                    loading="lazy"
                                />

                            </div>


                            {/* BOOKING DETAILS */}

                            <div className="booking-details">

                                <h2>
                                    {booking.property_title}
                                </h2>

                                <p className="booking-location">
                                    📍 {booking.locality},{" "}
                                    {booking.city}
                                </p>


                                <div className="booking-date-time">

                                    <div>

                                        <span>
                                            📅 Date
                                        </span>

                                        <strong>
                                            {new Date(
                                                booking.booking_date
                                            ).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                }
                                            )}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            🕐 Time
                                        </span>

                                        <strong>
                                            {booking.start_time.slice(0, 5)}
                                            {" – "}
                                            {booking.end_time.slice(0, 5)}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            ⏱ Duration
                                        </span>

                                        <strong>
                                            30 minutes
                                        </strong>

                                    </div>

                                </div>


                                {/* STATUS */}

                                <div className="booking-bottom">

                                    <span
                                        className={`booking-status ${booking.status}`}
                                    >
                                        {booking.status}
                                    </span>


                                    {booking.status !==
                                        "cancelled" &&
                                        booking.status !==
                                        "completed" && (

                                            <button
                                                className="cancel-booking-btn"
                                                onClick={() =>
                                                    handleCancel(
                                                        booking.id
                                                    )
                                                }
                                                disabled={
                                                    cancelLoading ===
                                                    booking.id
                                                }
                                            >

                                                {cancelLoading ===
                                                    booking.id

                                                    ? "Cancelling..."

                                                    : "Cancel Booking"
                                                }

                                            </button>

                                        )}

                                </div>


                                {/* LANDLORD */}

                                <div className="booking-landlord">

                                    <strong>
                                        Landlord:
                                    </strong>{" "}

                                    {booking.landlord_name}

                                    {booking.landlord_phone && (
                                        <>
                                            {" • "}
                                            {booking.landlord_phone}
                                        </>
                                    )}

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );
}


export default Bookings;