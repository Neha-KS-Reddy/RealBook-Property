import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";

import {
    getLandlordBookings,
    confirmBooking,
    cancelBooking
} from "../api";


function LandlordBookings() {

    const token =
        localStorage.getItem("realbook_token");

    const user =
        JSON.parse(
            localStorage.getItem("realbook_user")
        );

    const [bookings, setBookings] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [actionLoading, setActionLoading] =
        useState(null);


    // ==========================================
    // LOAD BOOKINGS
    // ==========================================

    async function loadBookings() {

        try {

            setLoading(true);
            setError("");

            const data =
                await getLandlordBookings();

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


    useEffect(() => {

        if (
            token &&
            user &&
            user.role === "landlord"
        ) {
            loadBookings();
        }

    }, [token]);


    // ==========================================
    // CONFIRM BOOKING
    // ==========================================

    async function handleConfirm(id) {

        try {

            setActionLoading(id);

            await confirmBooking(id);

            setBookings((current) =>
                current.map((booking) =>
                    booking.id === id
                        ? {
                            ...booking,
                            status: "confirmed"
                        }
                        : booking
                )
            );

        } catch (err) {

            alert(
                err.message ||
                "Failed to confirm booking"
            );

        } finally {

            setActionLoading(null);

        }
    }


    // ==========================================
    // CANCEL BOOKING
    // ==========================================

    async function handleCancel(id) {

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this booking?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(id);

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

            setActionLoading(null);

        }
    }


    // ==========================================
    // LOGIN / ROLE CHECK
    // ==========================================

    if (!token) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    if (!user || user.role !== "landlord") {

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

            <div className="landlord-bookings-page">

                <div className="landlord-bookings-container">

                    <h1>
                        Booking Requests
                    </h1>

                    <p>
                        Loading booking requests...
                    </p>

                </div>

            </div>
        );
    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="landlord-bookings-page">

            <div className="landlord-bookings-container">


                {/* HEADER */}

                <div className="landlord-bookings-header">

                    <div>

                        <h1>
                            Booking Requests
                        </h1>

                        <p>
                            Manage virtual tour requests
                            from tenants.
                        </p>

                    </div>

                    <Link
                        to="/dashboard"
                        className="landlord-back-btn"
                    >
                        ← Dashboard
                    </Link>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="booking-error">
                        {error}
                    </div>

                )}


                {/* EMPTY */}

                {!error &&
                    bookings.length === 0 && (

                        <div className="empty-landlord-bookings">

                            <div>
                                📅
                            </div>

                            <h2>
                                No booking requests
                            </h2>

                            <p>
                                New virtual tour requests
                                will appear here.
                            </p>

                        </div>

                    )}


                {/* BOOKING LIST */}

                <div className="landlord-booking-list">

                    {bookings.map((booking) => (

                        <div
                            className="landlord-booking-card"
                            key={booking.id}
                        >


                            {/* PROPERTY */}

                            <div className="landlord-booking-property">

                                <h2>
                                    {booking.property_title}
                                </h2>

                                <p>
                                    📍 {booking.locality},{" "}
                                    {booking.city}
                                </p>

                            </div>


                            {/* BOOKING INFORMATION */}

                            <div className="landlord-booking-info">

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


                            {/* TENANT */}

                            <div className="tenant-booking-info">

                                <h3>
                                    Tenant Details
                                </h3>

                                <p>
                                    <strong>
                                        Name:
                                    </strong>{" "}
                                    {booking.tenant_name}
                                </p>

                                <p>
                                    <strong>
                                        Email:
                                    </strong>{" "}
                                    {booking.tenant_email}
                                </p>

                                {booking.tenant_phone && (

                                    <p>
                                        <strong>
                                            Phone:
                                        </strong>{" "}
                                        {booking.tenant_phone}
                                    </p>

                                )}

                            </div>


                            {/* STATUS + ACTIONS */}

                            <div className="landlord-booking-actions">

                                <span
                                    className={`booking-status ${booking.status}`}
                                >
                                    {booking.status}
                                </span>


                                {booking.status ===
                                    "pending" && (

                                    <div className="booking-action-buttons">

                                        <button
                                            className="confirm-booking-btn"
                                            onClick={() =>
                                                handleConfirm(
                                                    booking.id
                                                )
                                            }
                                            disabled={
                                                actionLoading ===
                                                booking.id
                                            }
                                        >

                                            {actionLoading ===
                                                booking.id
                                                ? "Processing..."
                                                : "✓ Confirm"
                                            }

                                        </button>


                                        <button
                                            className="landlord-cancel-btn"
                                            onClick={() =>
                                                handleCancel(
                                                    booking.id
                                                )
                                            }
                                            disabled={
                                                actionLoading ===
                                                booking.id
                                            }
                                        >

                                            ✕ Cancel

                                        </button>

                                    </div>

                                )}


                                {booking.status ===
                                    "confirmed" && (

                                    <button
                                        className="landlord-cancel-btn"
                                        onClick={() =>
                                            handleCancel(
                                                booking.id
                                            )
                                        }
                                        disabled={
                                            actionLoading ===
                                            booking.id
                                        }
                                    >

                                        Cancel Booking

                                    </button>

                                )}

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );
}


export default LandlordBookings;