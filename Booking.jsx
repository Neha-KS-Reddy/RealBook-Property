import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createBooking } from "../api";

function Booking() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    // ------------------------------------------
    // GET TODAY
    // ------------------------------------------

    const today =
        new Date().toISOString().split("T")[0];

    // ------------------------------------------
    // BOOK TOUR
    // ------------------------------------------

    async function handleBooking(e) {

        e.preventDefault();

        setError("");
        setMessage("");

        if (!date || !time) {
            setError(
                "Please select date and time"
            );
            return;
        }

        try {

            setLoading(true);

            const result =
                await createBooking(
                    id,
                    date,
                    time
                );

            setMessage(
                result.message
            );

            setTimeout(() => {
                navigate("/bookings");
            }, 1500);

        } catch (err) {

            setError(
                err.message
            );

        } finally {

            setLoading(false);
        }
    }

    return (

        <div className="booking-page">

            <div className="booking-card">

                <h1>
                    Book Virtual Tour
                </h1>

                <p className="booking-subtitle">
                    Schedule a 30-minute virtual
                    property tour.
                </p>

                {error && (
                    <div className="booking-error">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="booking-success">
                        {message}
                    </div>
                )}

                <form
                    onSubmit={handleBooking}
                >

                    <div className="form-group">

                        <label>
                            Select Date
                        </label>

                        <input
                            type="date"
                            min={today}
                            value={date}
                            onChange={(e) =>
                                setDate(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Select Time
                        </label>

                        <select
                            value={time}
                            onChange={(e) =>
                                setTime(
                                    e.target.value
                                )
                            }
                            required
                        >

                            <option value="">
                                Choose a time
                            </option>

                            <option value="09:00">
                                9:00 AM – 9:30 AM
                            </option>

                            <option value="09:30">
                                9:30 AM – 10:00 AM
                            </option>

                            <option value="10:00">
                                10:00 AM – 10:30 AM
                            </option>

                            <option value="10:30">
                                10:30 AM – 11:00 AM
                            </option>

                            <option value="11:00">
                                11:00 AM – 11:30 AM
                            </option>

                            <option value="11:30">
                                11:30 AM – 12:00 PM
                            </option>

                            <option value="12:00">
                                12:00 PM – 12:30 PM
                            </option>

                            <option value="12:30">
                                12:30 PM – 1:00 PM
                            </option>

                            <option value="14:00">
                                2:00 PM – 2:30 PM
                            </option>

                            <option value="14:30">
                                2:30 PM – 3:00 PM
                            </option>

                            <option value="15:00">
                                3:00 PM – 3:30 PM
                            </option>

                            <option value="15:30">
                                3:30 PM – 4:00 PM
                            </option>

                            <option value="16:00">
                                4:00 PM – 4:30 PM
                            </option>

                            <option value="16:30">
                                4:30 PM – 5:00 PM
                            </option>

                            <option value="17:00">
                                5:00 PM – 5:30 PM
                            </option>

                            <option value="17:30">
                                5:30 PM – 6:00 PM
                            </option>

                            <option value="18:00">
                                6:00 PM – 6:30 PM
                            </option>

                            <option value="18:30">
                                6:30 PM – 7:00 PM
                            </option>

                        </select>

                    </div>


                    <div className="booking-info">

                        <strong>
                            ⏱ Duration
                        </strong>

                        <span>
                            30 minutes
                        </span>

                    </div>


                    <button
                        type="submit"
                        className="booking-submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Booking..."
                            : "Book Virtual Tour"
                        }

                    </button>

                </form>

            </div>

        </div>
    );
}

export default Booking;