-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 01, 2026 at 02:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `realbook_property`
--

-- --------------------------------------------------------

--
-- Table structure for table `amenities`
--

CREATE TABLE `amenities` (
  `id` int(11) NOT NULL,
  `name` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `amenities`
--

INSERT INTO `amenities` (`id`, `name`) VALUES
(8, 'Air Conditioning'),
(9, 'Balcony'),
(12, 'CCTV'),
(10, 'Furnished'),
(4, 'Gym'),
(5, 'Lift'),
(2, 'Parking'),
(11, 'Pet Friendly'),
(7, 'Power Backup'),
(6, 'Security'),
(3, 'Swimming Pool'),
(1, 'WiFi');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `tenant_id` int(11) NOT NULL,
  `booking_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` enum('pending','confirmed','cancelled','completed') DEFAULT 'pending',
  `notes` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `property_id`, `tenant_id`, `booking_date`, `start_time`, `end_time`, `status`, `notes`, `created_at`) VALUES
(1, 1, 3, '2026-10-16', '10:00:00', '10:30:00', 'cancelled', NULL, '2026-10-01 08:15:15'),
(2, 1, 3, '2026-10-23', '10:00:00', '10:30:00', 'confirmed', NULL, '2026-10-01 08:21:23'),
(3, 1, 3, '2026-10-31', '17:30:00', '18:00:00', 'pending', NULL, '2026-10-01 08:35:32'),
(4, 1, 5, '2026-10-04', '15:30:00', '16:00:00', 'cancelled', NULL, '2026-10-01 11:36:19'),
(5, 2, 5, '2026-10-14', '16:30:00', '17:00:00', 'confirmed', NULL, '2026-10-01 11:37:37');

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `tenant_id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`tenant_id`, `property_id`, `created_at`) VALUES
(3, 1, '2026-10-01 08:02:35'),
(5, 2, '2026-10-01 11:36:47');

-- --------------------------------------------------------

--
-- Table structure for table `properties`
--

CREATE TABLE `properties` (
  `id` int(11) NOT NULL,
  `landlord_id` int(11) NOT NULL,
  `title` varchar(180) NOT NULL,
  `description` text DEFAULT NULL,
  `locality` varchar(120) NOT NULL,
  `city` varchar(80) NOT NULL DEFAULT 'Mumbai',
  `address` varchar(255) DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `bhk` tinyint(4) NOT NULL,
  `area_sqft` int(11) DEFAULT NULL,
  `property_type` enum('Apartment','Villa','Independent House','Studio','Office') DEFAULT 'Apartment',
  `cover_image` varchar(500) DEFAULT NULL,
  `available_from` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `properties`
--

INSERT INTO `properties` (`id`, `landlord_id`, `title`, `description`, `locality`, `city`, `address`, `price`, `bhk`, `area_sqft`, `property_type`, `cover_image`, `available_from`, `created_at`, `updated_at`) VALUES
(1, 1, 'Modern 2 BHK Apartment', 'Beautiful modern apartment with balcony, parking and excellent connectivity.', 'Powai', 'Mumbai', 'Powai Lake Road', 42000.00, 2, 1150, 'Apartment', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80', '2026-10-01', '2026-10-01 06:34:10', '2026-10-01 06:34:10'),
(2, 1, 'Luxury 3 BHK Apartment', 'Spacious apartment with modern interiors and parking.', 'Andheri', 'Mumbai', 'Andheri West, Mumbai', 55000.00, 3, 1500, 'Apartment', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', '2026-10-01', '2026-10-01 09:23:43', '2026-10-01 11:39:53');

-- --------------------------------------------------------

--
-- Table structure for table `property_amenities`
--

CREATE TABLE `property_amenities` (
  `property_id` int(11) NOT NULL,
  `amenity_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `property_amenities`
--

INSERT INTO `property_amenities` (`property_id`, `amenity_id`) VALUES
(2, 8),
(2, 9),
(2, 10),
(2, 12);

-- --------------------------------------------------------

--
-- Table structure for table `property_images`
--

CREATE TABLE `property_images` (
  `id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `sort_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `property_images`
--

INSERT INTO `property_images` (`id`, `property_id`, `image_url`, `sort_order`) VALUES
(1, 1, 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80', 1),
(2, 1, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80', 2),
(3, 1, 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80', 3),
(4, 1, 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d', 4),
(5, 2, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(180) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('tenant','landlord') NOT NULL DEFAULT 'tenant',
  `phone` varchar(30) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `phone`, `created_at`) VALUES
(1, 'Demo Landlord', 'landlord@realbook.com', '$2b$10$PmfTZosKXiECALUzPChOjuG1.l6qrZfzXxFwbpMzfzn5nvrouUwEa', 'landlord', '9876543210', '2026-10-01 06:33:41'),
(2, 'Test Tenant', 'tenant@test.com', '$2b$10$E1zbkridBUG0gEFy/aZtaOH2G.cHK9fOZllFWpabsGGwupVUF0h9O', 'tenant', '9876543210', '2026-10-01 07:28:25'),
(3, 'neha ', 'nehareddy2810@gmail.com', '$2b$10$EO9qEib2.q0N7JxRSf9WAu4pdPQRiNvx26vTD/6K796uDXuQ41vXW', 'tenant', '9008573453', '2026-10-01 07:35:40'),
(4, 'Demo Landlord 2', 'landlord2@realbook.com', '$2b$10$8vDaAP3vQrorq2vGMKjS6OJgRbOO1pRouP7vbY3ony5S.hWsCDGtW', 'landlord', '9876543211', '2026-10-01 08:31:45'),
(5, 'NehaReddy', 'nehareddy12@gmail.com', '$2b$10$krKfktdI.lwbvUXSssrz.O/IgXSZDMU0RXkjCrcbSy8KLsJKneoxG', 'tenant', '9008573452', '2026-10-01 11:34:37');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `amenities`
--
ALTER TABLE `amenities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tenant_id` (`tenant_id`),
  ADD KEY `idx_booking_property_date` (`property_id`,`booking_date`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`tenant_id`,`property_id`),
  ADD KEY `property_id` (`property_id`);

--
-- Indexes for table `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`id`),
  ADD KEY `landlord_id` (`landlord_id`),
  ADD KEY `idx_property_search` (`locality`,`price`,`bhk`);

--
-- Indexes for table `property_amenities`
--
ALTER TABLE `property_amenities`
  ADD PRIMARY KEY (`property_id`,`amenity_id`),
  ADD KEY `amenity_id` (`amenity_id`);

--
-- Indexes for table `property_images`
--
ALTER TABLE `property_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `property_id` (`property_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `amenities`
--
ALTER TABLE `amenities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `properties`
--
ALTER TABLE `properties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `property_images`
--
ALTER TABLE `property_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `properties`
--
ALTER TABLE `properties`
  ADD CONSTRAINT `properties_ibfk_1` FOREIGN KEY (`landlord_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `property_amenities`
--
ALTER TABLE `property_amenities`
  ADD CONSTRAINT `property_amenities_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `property_amenities_ibfk_2` FOREIGN KEY (`amenity_id`) REFERENCES `amenities` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `property_images`
--
ALTER TABLE `property_images`
  ADD CONSTRAINT `property_images_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
