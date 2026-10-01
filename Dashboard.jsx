import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

function Dashboard() {

    const [user, setUser] = useState(null);

    useEffect(() => {

        const storedUser =
            localStorage.getItem("realbook_user");

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error(error);
            }
        }

    }, []);


    if (!localStorage.getItem("realbook_token")) {
        return <Navigate to="/login" replace />;
    }


    if (!user) {
        return (
            <div className="dashboard-page">
                <h1>Loading dashboard...</h1>
            </div>
        );
    }


    const isLandlord = user.role === "landlord";


    return (

        <div className="dashboard-page">

            <div className="dashboard-header">

                <div>
                    <p className="dashboard-label">
                        REALBOOK DASHBOARD
                    </p>

                    <h1>
                        Welcome, {user.name} 👋
                    </h1>

                    <p>
                        {isLandlord
                            ? "Manage your properties and virtual tour requests."
                            : "Find properties and manage your virtual tours."
                        }
                    </p>
                </div>

                <div className="dashboard-role">
                    {isLandlord
                        ? "🏠 Landlord"
                        : "🔑 Tenant"
                    }
                </div>

            </div>


            {isLandlord ? (

                /* LANDLORD DASHBOARD */

                <div className="dashboard-grid">

                    <Link
                        to="/landlord/properties"
                        className="dashboard-card"
                    >
                        <span className="dashboard-card-icon">
                            🏠
                        </span>

                        <h2>
                            My Properties
                        </h2>

                        <p>
                            View and manage your property listings.
                        </p>
                    </Link>


                    <Link
                        to="/landlord/add-property"
                        className="dashboard-card"
                    >
                        <span className="dashboard-card-icon">
                            ➕
                        </span>

                        <h2>
                            Add Property
                        </h2>

                        <p>
                            List a new property on RealBook.
                        </p>
                    </Link>


                    <Link
                        to="/landlord/bookings"
                        className="dashboard-card"
                    >
                        <span className="dashboard-card-icon">
                            📅
                        </span>

                        <h2>
                            Tour Requests
                        </h2>

                        <p>
                            Manage tenant virtual tour requests.
                        </p>
                    </Link>

                </div>

            ) : (

                /* TENANT DASHBOARD */

                <div className="dashboard-grid">

                    <Link
                        to="/favorites"
                        className="dashboard-card"
                    >
                        <span className="dashboard-card-icon">
                            ❤️
                        </span>

                        <h2>
                            My Favorites
                        </h2>

                        <p>
                            View properties you have shortlisted.
                        </p>
                    </Link>


                    <Link
                        to="/bookings"
                        className="dashboard-card"
                    >
                        <span className="dashboard-card-icon">
                            📅
                        </span>

                        <h2>
                            My Virtual Tours
                        </h2>

                        <p>
                            View and manage your tour bookings.
                        </p>
                    </Link>


                    <Link
                        to="/properties"
                        className="dashboard-card"
                    >
                        <span className="dashboard-card-icon">
                            🔎
                        </span>

                        <h2>
                            Find Properties
                        </h2>

                        <p>
                            Search available properties.
                        </p>
                    </Link>

                </div>

            )}


            <div className="dashboard-account">

                <h2>
                    Account Information
                </h2>

                <p>
                    <strong>Name:</strong>{" "}
                    {user.name}
                </p>

                <p>
                    <strong>Email:</strong>{" "}
                    {user.email}
                </p>

                <p>
                    <strong>Role:</strong>{" "}
                    {user.role}
                </p>

                {user.phone && (
                    <p>
                        <strong>Phone:</strong>{" "}
                        {user.phone}
                    </p>
                )}

            </div>

        </div>

    );

}

export default Dashboard;