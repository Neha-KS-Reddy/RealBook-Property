import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "tenant"
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);


    function handleChange(e) {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    }


    async function handleSubmit(e) {

        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(formData)
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message || "Registration failed"
                );

            }


            // Store authentication data

            localStorage.setItem(
                "realbook_token",
                data.token
            );

            localStorage.setItem(
                "realbook_user",
                JSON.stringify(data.user)
            );


            setSuccess(
                "Registration successful!"
            );


            // Go to properties after registration

            setTimeout(() => {
                navigate("/properties");
            }, 1000);


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
                        Create Account
                    </h1>

                    <p>
                        Join RealBook Property
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="auth-form"
                >

                    {/* NAME */}

                    <div className="auth-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* EMAIL */}

                    <div className="auth-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* PHONE */}

                    <div className="auth-group">

                        <label>
                            Phone
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChange={handleChange}
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="auth-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />

                    </div>


                    {/* ROLE */}

                    <div className="auth-group">

                        <label>
                            I want to
                        </label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >

                            <option value="tenant">
                                Find a Property
                            </option>

                            <option value="landlord">
                                List My Property
                            </option>

                        </select>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="auth-error">
                            {error}
                        </div>

                    )}


                    {/* SUCCESS */}

                    {success && (

                        <div className="auth-success">
                            {success}
                        </div>

                    )}


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"
                        }

                    </button>

                </form>


                <div className="auth-footer">

                    Already have an account?

                    {" "}

                    <Link to="/login">
                        Login
                    </Link>

                </div>

            </div>

        </div>

    );

}

export default Register;