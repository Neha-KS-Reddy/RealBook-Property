import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Favorites from "./pages/Favorites";
import Booking from "./pages/Booking";
import Bookings from "./pages/Bookings";
import LandlordBookings from "./pages/LandlordBookings";
import LandlordProperties
    from "./pages/LandlordProperties";
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty";

function App() {

    return (

        <BrowserRouter>

            <Navbar />

            <Routes>

              <Route
    path="/dashboard"
    element={<Dashboard />}
/>

<Route
    path="/favorites"
    element={<Favorites />}
/>

<Route
    path="/favorites"
    element={<Favorites />}
/>
<Route
    path="/book/:id"
    element={<Booking />}
/>

<Route
    path="/bookings"
    element={<Bookings />}
/>

<Route
    path="/landlord/bookings"
    element={<LandlordBookings />}
/>

<Route
    path="/landlord/properties"
    element={
        <LandlordProperties />
    }
/>

<Route
    path="/landlord/add-property"
    element={<AddProperty />}
/>

<Route
    path="/landlord/edit-property/:id"
    element={<EditProperty />}
/>


                {/* HOME */}
                <Route
                    path="/"
                    element={<Home />}
                />


                {/* ALL PROPERTIES */}
                <Route
                    path="/properties"
                    element={<Properties />}
                />


                {/* SINGLE PROPERTY DETAILS */}
                <Route
                    path="/properties/:id"
                    element={<PropertyDetails />}
                />


                {/* LOGIN */}
                <Route
    path="/login"
    element={<Login />}
/>


                {/* REGISTER */}

                <Route
    path="/register"
    element={<Register />}
/>


                {/* ABOUT */}
                <Route
                    path="/about"
                    element={
                        <h1 style={{ padding: "100px" }}>
                            About RealBook
                        </h1>
                    }
                />


                {/* CONTACT */}
                <Route
                    path="/contact"
                    element={
                        <h1 style={{ padding: "100px" }}>
                            Contact RealBook
                        </h1>
                    }
                />

            </Routes>

        </BrowserRouter>

    );
}

export default App;