import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleSubmit(e) {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message || "Login failed"
                );

            }


            // Save authentication information

            localStorage.setItem(
                "realbook_token",
                data.token
            );

            localStorage.setItem(
                "realbook_user",
                JSON.stringify(data.user)
            );


            // Redirect after login

            navigate("/properties");


        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);

        }

    }


    return (

        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">

                    <h1>
                        Welcome Back
                    </h1>

                    <p>
                        Login to your RealBook account
                    </p>

                </div>


                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    {/* EMAIL */}

                    <div className="auth-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="auth-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="auth-error">
                            {error}
                        </div>

                    )}


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>

                </form>


                <div className="auth-footer">

                    Don't have an account?

                    {" "}

                    <Link to="/register">
                        Create Account
                    </Link>

                </div>

            </div>

        </div>

    );
}

export default Login;