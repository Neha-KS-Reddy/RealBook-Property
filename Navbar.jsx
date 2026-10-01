import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(() => {

        function loadUser() {

            const storedUser =
                localStorage.getItem("realbook_user");

            if (storedUser) {

                try {
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error("Invalid user data:", error);
                    localStorage.removeItem("realbook_user");
                }

            } else {
                setUser(null);
            }
        }

        loadUser();

        window.addEventListener("storage", loadUser);

        return () => {
            window.removeEventListener("storage", loadUser);
        };

    }, []);


    function handleLogout() {

        localStorage.removeItem("realbook_token");
        localStorage.removeItem("realbook_user");

        setUser(null);

        navigate("/");

    }


    return (

        <nav className="navbar">

            <div className="navbar-container">

                {/* LOGO */}

                <Link
                    to="/"
                    className="navbar-logo"
                >

                    <span className="logo-icon">
                        🏠
                    </span>

                    <span>
                        <span className="logo-real">
                            RealBook
                        </span>
                        <span className="logo-property">
                            Property
                        </span>
                    </span>

                </Link>


                {/* NAVIGATION */}

                <div className="navbar-links">

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/properties">
                        Properties
                    </Link>

                    <Link to="/about">
                        About
                    </Link>

                    <Link to="/contact">
                        Contact
                    </Link>


                    {!user ? (

                        <>

                            <Link
                                to="/login"
                                className="login-button"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="register-button"
                            >
                                Get Started
                            </Link>

                        </>

                    ) : (

                        <>

                            <span className="navbar-user">
                                Hi, {user.name}
                            </span>

                            <Link
                                to="/dashboard"
                                className="dashboard-button"
                            >
                                Dashboard
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="logout-button"
                            >
                                Logout
                            </button>

                        </>

                    )}

                </div>

            </div>

        </nav>

    );

}

export default Navbar;