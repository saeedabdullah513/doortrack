-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 05, 2026 at 09:58 AM
-- Server version: 11.8.6-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u119666576_doortodoor_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance_days`
--

DROP TABLE IF EXISTS `attendance_days`;
CREATE TABLE `attendance_days` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `date` date NOT NULL,
  `totalHours` decimal(6,2) DEFAULT NULL,
  `status` enum('IN_PROGRESS','COMPLETED','BELOW_TARGET','ABSENT') NOT NULL DEFAULT 'IN_PROGRESS',
  `editedByAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `notes` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attendance_days`
--

INSERT INTO `attendance_days` (`id`, `userId`, `date`, `totalHours`, `status`, `editedByAdmin`, `notes`, `createdAt`, `updatedAt`) VALUES
('126822b0-34a5-4fcf-a3c2-fc00b5ee9fb2', 'a84bd45e-2108-48c3-8116-f951f405c528', '2026-06-01', 0.19, 'BELOW_TARGET', 0, NULL, '2026-06-01 13:31:35.391', '2026-06-01 14:08:41.894'),
('25a91da7-64d5-437f-a9ef-a647e1597e89', '016b583f-1a88-48ab-bc35-886bb036a384', '2026-06-04', 7.69, 'BELOW_TARGET', 0, NULL, '2026-06-04 15:50:15.567', '2026-06-04 23:31:51.960'),
('39982cf9-8818-4647-a6ec-311f9222812f', 'a84bd45e-2108-48c3-8116-f951f405c528', '2026-05-31', NULL, 'IN_PROGRESS', 0, NULL, '2026-06-01 13:42:47.247', '2026-06-01 13:42:48.320'),
('57afe176-2ee1-4f4c-b8b2-f45fdf773410', '2108ec00-a987-484a-92c8-c9e1a524ae12', '2026-06-03', 0.00, 'BELOW_TARGET', 0, NULL, '2026-06-03 22:07:40.481', '2026-06-03 22:07:46.812'),
('91fef072-de82-4946-b48c-b754f7844fa3', '74a5dcc8-c0e0-464c-82d3-c7f05c6b01e6', '2026-06-04', 1.04, 'BELOW_TARGET', 0, NULL, '2026-06-04 16:27:48.082', '2026-06-04 17:30:18.946'),
('a072b71a-934b-45ce-8434-709b72324b37', 'a84bd45e-2108-48c3-8116-f951f405c528', '2026-06-02', NULL, 'IN_PROGRESS', 0, NULL, '2026-06-02 15:54:50.571', '2026-06-02 15:54:50.571'),
('c811c3ac-074b-4878-adab-d416963d076a', 'aa1468ba-7658-4ee2-942b-16aa9af6099f', '2026-06-04', 6.62, 'BELOW_TARGET', 1, '', '2026-06-04 16:51:33.038', '2026-06-04 23:48:52.165'),
('d483d1f1-5b0f-43e3-9d95-bb52bc2b0eae', 'a84bd45e-2108-48c3-8116-f951f405c528', '2026-06-03', 0.01, 'BELOW_TARGET', 0, NULL, '2026-06-03 18:52:37.041', '2026-06-03 19:09:08.887'),
('e572060b-b13c-4410-a918-89f817cccabd', 'f50d6be4-b2c7-4c68-9d16-725dd60578ba', '2026-06-04', 5.27, 'BELOW_TARGET', 0, NULL, '2026-06-04 16:19:30.814', '2026-06-04 21:35:57.338'),
('fdd61bf5-024c-4acc-af9c-3707262ef299', 'a84bd45e-2108-48c3-8116-f951f405c528', '2026-06-04', 0.25, 'BELOW_TARGET', 0, NULL, '2026-06-04 00:41:34.274', '2026-06-04 08:00:37.077');

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` varchar(191) NOT NULL,
  `adminId` varchar(191) NOT NULL,
  `targetUserId` varchar(191) DEFAULT NULL,
  `action` varchar(191) NOT NULL,
  `oldValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`oldValue`)),
  `newValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`newValue`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `punch_entries`
--

DROP TABLE IF EXISTS `punch_entries`;
CREATE TABLE `punch_entries` (
  `id` varchar(191) NOT NULL,
  `dayId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `sequence` int(11) NOT NULL,
  `punchInTime` datetime(3) NOT NULL,
  `punchInLat` decimal(10,8) NOT NULL,
  `punchInLng` decimal(11,8) NOT NULL,
  `punchInAddress` varchar(191) DEFAULT NULL,
  `punchOutTime` datetime(3) DEFAULT NULL,
  `punchOutLat` decimal(10,8) DEFAULT NULL,
  `punchOutLng` decimal(11,8) DEFAULT NULL,
  `punchOutAddress` varchar(191) DEFAULT NULL,
  `entryHours` decimal(5,2) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `punch_entries`
--

INSERT INTO `punch_entries` (`id`, `dayId`, `userId`, `sequence`, `punchInTime`, `punchInLat`, `punchInLng`, `punchInAddress`, `punchOutTime`, `punchOutLat`, `punchOutLng`, `punchOutAddress`, `entryHours`, `createdAt`, `updatedAt`) VALUES
('09f65edb-4a8b-4406-86b7-d975fbf058ce', '91fef072-de82-4946-b48c-b754f7844fa3', '74a5dcc8-c0e0-464c-82d3-c7f05c6b01e6', 2, '2026-06-04 19:26:42.117', 45.00378116, -93.08249588, 'Maplewood, Minnesota', NULL, NULL, NULL, NULL, NULL, '2026-06-04 19:26:42.527', '2026-06-04 19:26:42.527'),
('2d6d8c36-818b-486e-a379-b5f1654c1057', '39982cf9-8818-4647-a6ec-311f9222812f', 'a84bd45e-2108-48c3-8116-f951f405c528', 1, '2026-06-01 13:42:47.213', 24.85477094, 67.02539549, 'Fowler Lines, Karachi Division, Sindh', NULL, NULL, NULL, NULL, NULL, '2026-06-01 13:42:48.310', '2026-06-01 13:42:48.310'),
('34abf846-fd72-4830-acad-d1a1223a6d1f', 'c811c3ac-074b-4878-adab-d416963d076a', 'aa1468ba-7658-4ee2-942b-16aa9af6099f', 1, '2026-06-04 16:51:00.000', 45.00659925, -93.07143452, 'Maplewood, Minnesota', '2026-06-04 23:28:00.000', NULL, NULL, NULL, 6.62, '2026-06-04 16:51:33.275', '2026-06-04 23:48:52.007'),
('36e18dbc-5c57-4727-b40e-ad17d1c05ff4', 'fdd61bf5-024c-4acc-af9c-3707262ef299', 'a84bd45e-2108-48c3-8116-f951f405c528', 2, '2026-06-04 03:12:09.803', 44.84235174, -93.17924785, 'Eagan, Minnesota', '2026-06-04 03:24:54.011', 44.84267603, -93.17899244, 'Eagan, Minnesota', 0.21, '2026-06-04 03:12:10.178', '2026-06-04 03:24:54.386'),
('4a9f967f-5773-4c76-842e-ba05b9768dfd', 'a072b71a-934b-45ce-8434-709b72324b37', 'a84bd45e-2108-48c3-8116-f951f405c528', 1, '2026-06-02 15:54:50.547', 24.85485945, 67.02550081, 'Fowler Lines, Karachi Division, Sindh', NULL, NULL, NULL, NULL, NULL, '2026-06-02 15:54:51.724', '2026-06-02 15:54:51.724'),
('52fadfa2-8575-46a4-bea7-45ab44274b74', 'fdd61bf5-024c-4acc-af9c-3707262ef299', 'a84bd45e-2108-48c3-8116-f951f405c528', 1, '2026-06-04 00:41:34.185', 24.88238444, 67.14987725, 'Shah Faisal Block 2, Karachi Division, Sindh', '2026-06-04 00:41:55.217', 24.88238444, 67.14987725, 'Shah Faisal Block 2, Karachi Division, Sindh', 0.01, '2026-06-04 00:41:34.564', '2026-06-04 00:41:55.357'),
('5d4c2bdf-0352-4ed5-8292-8f4816d7c225', 'd483d1f1-5b0f-43e3-9d95-bb52bc2b0eae', 'a84bd45e-2108-48c3-8116-f951f405c528', 2, '2026-06-03 19:08:51.912', 45.00298091, -93.07900993, 'Maplewood, Minnesota', '2026-06-03 19:09:08.335', 45.00320175, -93.07901860, 'Maplewood, Minnesota', 0.00, '2026-06-03 19:08:52.218', '2026-06-03 19:09:08.728'),
('62d51386-5733-4859-83ec-3b14ddec49bd', '91fef072-de82-4946-b48c-b754f7844fa3', '74a5dcc8-c0e0-464c-82d3-c7f05c6b01e6', 1, '2026-06-04 16:27:47.917', 45.00675551, -93.07169127, 'Maplewood, Minnesota', '2026-06-04 17:30:18.492', 45.00515659, -93.07174261, 'Maplewood, Minnesota', 1.04, '2026-06-04 16:27:48.221', '2026-06-04 17:30:18.788'),
('657807bb-c882-4e0a-89c6-5d824e497afd', '25a91da7-64d5-437f-a9ef-a647e1597e89', '016b583f-1a88-48ab-bc35-886bb036a384', 1, '2026-06-04 15:50:15.459', 45.00669430, -93.07149349, 'Maplewood, Minnesota', '2026-06-04 23:31:51.452', 45.00125985, -93.01296000, 'North Saint Paul, Minnesota', 7.69, '2026-06-04 15:50:15.837', '2026-06-04 23:31:51.803'),
('742aa880-206b-46f2-8746-58414259911f', 'd483d1f1-5b0f-43e3-9d95-bb52bc2b0eae', 'a84bd45e-2108-48c3-8116-f951f405c528', 1, '2026-06-03 18:52:36.988', 45.00306219, -93.07831930, 'Maplewood, Minnesota', '2026-06-03 18:52:56.141', 45.00304295, -93.07826059, 'Maplewood, Minnesota', 0.01, '2026-06-03 18:52:37.377', '2026-06-03 18:52:56.476'),
('784c7e38-1017-45b1-b874-4a318af0c9eb', '126822b0-34a5-4fcf-a3c2-fc00b5ee9fb2', 'a84bd45e-2108-48c3-8116-f951f405c528', 3, '2026-06-01 14:00:04.387', 24.85477871, 67.02539526, 'Fowler Lines, Karachi Division, Sindh', '2026-06-01 14:08:40.886', 24.85476490, 67.02539815, 'Fowler Lines, Karachi Division, Sindh', 0.14, '2026-06-01 14:00:05.632', '2026-06-01 14:08:41.884'),
('830a710a-321a-4120-ac1d-455fd6df7034', 'e572060b-b13c-4410-a918-89f817cccabd', 'f50d6be4-b2c7-4c68-9d16-725dd60578ba', 1, '2026-06-04 16:19:30.754', 45.00694050, -93.07152170, 'Maplewood, Minnesota', '2026-06-04 21:35:56.814', 45.00218590, -93.06820550, 'Maplewood, Minnesota', 5.27, '2026-06-04 16:19:31.137', '2026-06-04 21:35:57.176'),
('850385f6-8b0d-4b89-b635-b3fcd78d30c8', 'fdd61bf5-024c-4acc-af9c-3707262ef299', 'a84bd45e-2108-48c3-8116-f951f405c528', 4, '2026-06-04 07:59:07.216', 44.84234697, -93.17831911, 'Eagan, Minnesota', '2026-06-04 08:00:36.670', 44.84233740, -93.17832452, 'Eagan, Minnesota', 0.02, '2026-06-04 07:59:07.572', '2026-06-04 08:00:36.972'),
('8b517564-7966-4484-be5a-9b539b7413b5', 'fdd61bf5-024c-4acc-af9c-3707262ef299', 'a84bd45e-2108-48c3-8116-f951f405c528', 5, '2026-06-04 16:23:24.512', 44.84235045, -93.17827691, 'Eagan, Minnesota', NULL, NULL, NULL, NULL, NULL, '2026-06-04 16:23:24.736', '2026-06-04 16:23:24.736'),
('be041b35-640c-4692-a7ac-922bd59334d7', '126822b0-34a5-4fcf-a3c2-fc00b5ee9fb2', 'a84bd45e-2108-48c3-8116-f951f405c528', 2, '2026-06-01 13:47:24.703', 24.85476355, 67.02538489, 'Fowler Lines, Karachi Division, Sindh', '2026-06-01 13:49:46.842', 24.85477571, 67.02538831, 'Fowler Lines, Karachi Division, Sindh', 0.04, '2026-06-01 13:47:26.053', '2026-06-01 13:49:47.980'),
('c9fc6bb5-5007-4172-a465-83f3b30ad9f0', '57afe176-2ee1-4f4c-b8b2-f45fdf773410', '2108ec00-a987-484a-92c8-c9e1a524ae12', 1, '2026-06-03 22:07:40.419', 44.84238029, -93.17922907, 'Eagan, Minnesota', '2026-06-03 22:07:46.536', 44.84238029, -93.17922907, 'Eagan, Minnesota', 0.00, '2026-06-03 22:07:40.779', '2026-06-03 22:07:46.656'),
('d8709511-b45f-434c-9a0a-79e02f2b8e2d', 'fdd61bf5-024c-4acc-af9c-3707262ef299', 'a84bd45e-2108-48c3-8116-f951f405c528', 3, '2026-06-04 07:56:10.186', 44.84234051, -93.17829076, 'Eagan, Minnesota', '2026-06-04 07:56:48.479', 44.84234683, -93.17832629, 'Eagan, Minnesota', 0.01, '2026-06-04 07:56:10.542', '2026-06-04 07:56:48.795'),
('edf06098-0b89-42ef-8a0b-8debde5726b8', '126822b0-34a5-4fcf-a3c2-fc00b5ee9fb2', 'a84bd45e-2108-48c3-8116-f951f405c528', 1, '2026-06-01 13:31:35.383', 24.85477527, 67.02539381, 'فاؤلر لائنز, کراچی ڈویژن, سندھ', '2026-06-01 13:32:23.649', 24.85477407, 67.02539774, 'فاؤلر لائنز, کراچی ڈویژن, سندھ', 0.01, '2026-06-01 13:31:37.664', '2026-06-01 13:32:26.113'),
('f4296211-e390-4550-be77-6d398985f294', 'd483d1f1-5b0f-43e3-9d95-bb52bc2b0eae', 'a84bd45e-2108-48c3-8116-f951f405c528', 3, '2026-06-03 23:44:09.357', 24.88068405, 67.15036325, 'Shah Faisal Block 2, Karachi Division, Sindh', NULL, NULL, NULL, NULL, NULL, '2026-06-03 23:44:09.912', '2026-06-03 23:44:09.912');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `password` varchar(191) NOT NULL,
  `role` enum('AGENT','ADMIN','SUPER_ADMIN') NOT NULL DEFAULT 'AGENT',
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `role`, `isActive`, `createdAt`, `updatedAt`) VALUES
('016b583f-1a88-48ab-bc35-886bb036a384', 'Brian Mcarthur', 'razeproductions@yahoo.com', NULL, '$2b$12$GNi7YVV7Hz69uX0yW0mSW.fZzwROoN411ZMt6rbyDLCy5W9XGta4W', 'AGENT', 1, '2026-06-04 02:56:16.964', '2026-06-04 03:02:03.905'),
('2108ec00-a987-484a-92c8-c9e1a524ae12', 'Zain Ali', 'bussiness.zain@gmail.com', NULL, '$2b$12$fKCmRZ/GIoyDt/E/ObiUKOSmLTWI65zb02L44Y6e1LRWupPYaboL.', 'AGENT', 1, '2026-06-03 22:06:53.063', '2026-06-03 22:06:53.063'),
('74a5dcc8-c0e0-464c-82d3-c7f05c6b01e6', 'Ebony Stevenson', 'ebonystevenson32@gmail.com', NULL, '$2b$12$lyeR/UAP06ouUtqwOe8reOsCUn.ixsgdeFG2esDogt.uHX/So7R4a', 'AGENT', 1, '2026-06-04 02:53:59.045', '2026-06-04 02:53:59.045'),
('a0bce272-bc37-4a63-af07-5c25ef3afbcd', 'Edward Kumi', 'ekumi4815@gmail.com', NULL, '$2b$12$Vio6YY.NffAYFmk7vh1.1ujVAOBwT5Y7hFOewiJ4cBXvqpbQ0OYGS', 'AGENT', 1, '2026-06-04 03:03:50.364', '2026-06-04 03:03:50.364'),
('a84bd45e-2108-48c3-8116-f951f405c528', 'Demo Agent', 'demo.agent@doortrack.com', '+1 555 000 0000', '$2b$12$IsvgqzhfS5F7I4TYBsfhC.YDH72KgX6X7QdXv9FvTQAQjYtAjS5Vy', 'AGENT', 1, '2026-06-01 13:28:20.723', '2026-06-01 13:28:20.723'),
('aa1468ba-7658-4ee2-942b-16aa9af6099f', 'Ronnisha Woods', '2727drew@gmail.com', NULL, '$2b$12$d1qYuuEOmBxA.qUUoQY6NeoE7nYW6EdxqIDmVOWGNTksfR9W6fnAG', 'AGENT', 1, '2026-06-04 03:04:50.166', '2026-06-04 03:04:50.166'),
('e1fc1ee9-05b6-4fc5-aa62-64df31435a3f', 'System Admin', 'admin@doortrack.com', NULL, '$2b$12$ph7OkzTXLtHg0fT0t4PVmOlP.ywtQ932fUDOIrb6WolNQpdfKe3hq', 'SUPER_ADMIN', 1, '2026-06-01 13:28:20.713', '2026-06-01 13:28:20.713'),
('f50d6be4-b2c7-4c68-9d16-725dd60578ba', 'Christopher Schmitt', 'Chschm769490@gmail.com', NULL, '$2b$12$zoYC.ComclXqM9hi6KGHYu2Y2bt2fcstky9gDdo8bhCULAsxo7Xqm', 'AGENT', 1, '2026-06-04 03:03:08.604', '2026-06-04 03:03:08.604');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance_days`
--
ALTER TABLE `attendance_days`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `attendance_days_userId_date_key` (`userId`,`date`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `audit_logs_adminId_fkey` (`adminId`),
  ADD KEY `audit_logs_targetUserId_fkey` (`targetUserId`);

--
-- Indexes for table `punch_entries`
--
ALTER TABLE `punch_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `punch_entries_dayId_fkey` (`dayId`),
  ADD KEY `punch_entries_userId_fkey` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance_days`
--
ALTER TABLE `attendance_days`
  ADD CONSTRAINT `attendance_days_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `audit_logs_targetUserId_fkey` FOREIGN KEY (`targetUserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `punch_entries`
--
ALTER TABLE `punch_entries`
  ADD CONSTRAINT `punch_entries_dayId_fkey` FOREIGN KEY (`dayId`) REFERENCES `attendance_days` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `punch_entries_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
