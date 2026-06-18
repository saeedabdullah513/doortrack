-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: 82.197.82.109    Database: u119666576_doortodoor_db
-- ------------------------------------------------------
-- Server version	11.8.6-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('a0cc31fe-f424-43f8-acea-5a7833ad331c','bedd39f0648f2048ecf4a313ab344bbab07148935ce331ecd37f8f820478fe55','2026-06-05 09:36:25.688','20260605093544_add_reset_token',NULL,NULL,'2026-06-05 09:36:25.518',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance_days`
--

DROP TABLE IF EXISTS `attendance_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attendance_days` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `date` date NOT NULL,
  `totalHours` decimal(6,2) DEFAULT NULL,
  `status` enum('IN_PROGRESS','COMPLETED','BELOW_TARGET','ABSENT') NOT NULL DEFAULT 'IN_PROGRESS',
  `editedByAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `notes` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `attendance_days_userId_date_key` (`userId`,`date`),
  CONSTRAINT `attendance_days_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_days`
--

LOCK TABLES `attendance_days` WRITE;
/*!40000 ALTER TABLE `attendance_days` DISABLE KEYS */;
INSERT INTO `attendance_days` VALUES ('0a2be673-2a69-4835-bc6d-657526cb2dfe','aa1468ba-7658-4ee2-942b-16aa9af6099f','2026-06-05',8.46,'COMPLETED',0,NULL,'2026-06-05 17:11:56.015','2026-06-06 01:39:41.159'),('0b37da36-079f-42b8-be6a-cc38f3d68f8b','aa1468ba-7658-4ee2-942b-16aa9af6099f','2026-06-08',2.42,'BELOW_TARGET',0,NULL,'2026-06-08 16:41:50.115','2026-06-08 19:07:18.187'),('0c3591af-2bb4-487e-b576-c10810234e69','a0bce272-bc37-4a63-af07-5c25ef3afbcd','2026-06-08',8.52,'COMPLETED',0,NULL,'2026-06-08 16:45:42.679','2026-06-09 01:16:58.312'),('126822b0-34a5-4fcf-a3c2-fc00b5ee9fb2','a84bd45e-2108-48c3-8116-f951f405c528','2026-06-01',0.19,'BELOW_TARGET',0,NULL,'2026-06-01 13:31:35.391','2026-06-01 14:08:41.894'),('16eec634-643c-4db7-8b02-940a2bec582b','016b583f-1a88-48ab-bc35-886bb036a384','2026-06-09',3.68,'BELOW_TARGET',0,NULL,'2026-06-09 20:30:02.170','2026-06-10 00:10:35.646'),('25a91da7-64d5-437f-a9ef-a647e1597e89','016b583f-1a88-48ab-bc35-886bb036a384','2026-06-04',7.69,'BELOW_TARGET',0,NULL,'2026-06-04 15:50:15.567','2026-06-04 23:31:51.960'),('39982cf9-8818-4647-a6ec-311f9222812f','a84bd45e-2108-48c3-8116-f951f405c528','2026-05-31',NULL,'IN_PROGRESS',0,NULL,'2026-06-01 13:42:47.247','2026-06-01 13:42:48.320'),('4752ddcb-9c26-4ad6-b0f8-5dbe8d72a464','5e30e26d-601a-49ad-ba68-2d25a3cad2de','2026-06-16',6.02,'BELOW_TARGET',0,NULL,'2026-06-16 17:00:00.821','2026-06-16 23:01:05.637'),('5276e0eb-4264-4d2a-9758-8afab17be080','016b583f-1a88-48ab-bc35-886bb036a384','2026-06-05',8.88,'COMPLETED',0,NULL,'2026-06-05 16:16:32.746','2026-06-06 01:09:16.272'),('57afe176-2ee1-4f4c-b8b2-f45fdf773410','2108ec00-a987-484a-92c8-c9e1a524ae12','2026-06-03',0.00,'BELOW_TARGET',0,NULL,'2026-06-03 22:07:40.481','2026-06-03 22:07:46.812'),('6d276785-beb2-4a9b-8ef1-0f7d3b998afe','5e30e26d-601a-49ad-ba68-2d25a3cad2de','2026-06-09',3.22,'BELOW_TARGET',0,NULL,'2026-06-09 20:52:17.226','2026-06-10 00:05:33.357'),('71050f42-1334-4717-b792-5fa4eda039a1','016b583f-1a88-48ab-bc35-886bb036a384','2026-06-10',6.22,'BELOW_TARGET',0,NULL,'2026-06-10 15:45:50.362','2026-06-10 22:26:23.591'),('7cbf0e33-4522-4b1a-ba02-89da600fa431','f50d6be4-b2c7-4c68-9d16-725dd60578ba','2026-06-16',4.87,'BELOW_TARGET',0,NULL,'2026-06-16 16:58:40.341','2026-06-16 21:50:41.874'),('866fdd65-3392-497a-9d81-34cd00b1124e','f50d6be4-b2c7-4c68-9d16-725dd60578ba','2026-06-12',4.36,'BELOW_TARGET',0,NULL,'2026-06-12 18:45:01.733','2026-06-12 23:06:29.948'),('8c6689a2-4d9b-4f0a-9328-f482f9ca2843','016b583f-1a88-48ab-bc35-886bb036a384','2026-06-12',4.48,'BELOW_TARGET',0,NULL,'2026-06-12 17:25:23.898','2026-06-12 23:12:22.754'),('91fef072-de82-4946-b48c-b754f7844fa3','74a5dcc8-c0e0-464c-82d3-c7f05c6b01e6','2026-06-04',1.04,'BELOW_TARGET',0,NULL,'2026-06-04 16:27:48.082','2026-06-04 17:30:18.946'),('96a46edb-1b32-4d31-9bd9-7710034956aa','f50d6be4-b2c7-4c68-9d16-725dd60578ba','2026-06-09',2.54,'BELOW_TARGET',0,NULL,'2026-06-09 21:22:26.390','2026-06-09 23:54:45.800'),('9baec428-246d-4e36-8fdc-f63ca4b57eef','a84bd45e-2108-48c3-8116-f951f405c528','2026-06-05',2.80,'BELOW_TARGET',0,NULL,'2026-06-05 10:46:49.137','2026-06-05 13:34:34.515'),('a0342ae5-2ff4-405d-aed5-a72618367448','a84bd45e-2108-48c3-8116-f951f405c528','2026-06-11',0.02,'BELOW_TARGET',0,NULL,'2026-06-11 15:37:31.223','2026-06-11 15:38:38.258'),('a072b71a-934b-45ce-8434-709b72324b37','a84bd45e-2108-48c3-8116-f951f405c528','2026-06-02',NULL,'IN_PROGRESS',0,NULL,'2026-06-02 15:54:50.571','2026-06-02 15:54:50.571'),('b95012f5-0cf0-4dd0-a2d4-8d5ad927957e','5e30e26d-601a-49ad-ba68-2d25a3cad2de','2026-06-08',1.29,'BELOW_TARGET',0,NULL,'2026-06-08 18:36:58.818','2026-06-08 19:54:26.391'),('c0a226dd-6711-4037-b441-2df7f46f7435','f50d6be4-b2c7-4c68-9d16-725dd60578ba','2026-06-10',4.02,'BELOW_TARGET',0,NULL,'2026-06-10 18:25:08.501','2026-06-10 22:26:34.629'),('c811c3ac-074b-4878-adab-d416963d076a','aa1468ba-7658-4ee2-942b-16aa9af6099f','2026-06-04',6.62,'BELOW_TARGET',1,'','2026-06-04 16:51:33.038','2026-06-04 23:48:52.165'),('d483d1f1-5b0f-43e3-9d95-bb52bc2b0eae','a84bd45e-2108-48c3-8116-f951f405c528','2026-06-03',0.01,'BELOW_TARGET',0,NULL,'2026-06-03 18:52:37.041','2026-06-03 19:09:08.887'),('da01fd61-047b-4d2b-8a64-52453a916c0c','016b583f-1a88-48ab-bc35-886bb036a384','2026-06-16',5.25,'BELOW_TARGET',0,NULL,'2026-06-16 16:59:03.120','2026-06-16 22:14:09.102'),('e572060b-b13c-4410-a918-89f817cccabd','f50d6be4-b2c7-4c68-9d16-725dd60578ba','2026-06-04',5.27,'BELOW_TARGET',0,NULL,'2026-06-04 16:19:30.814','2026-06-04 21:35:57.338'),('e8737ab9-8d41-4ebf-840a-8093b5d9bb97','f50d6be4-b2c7-4c68-9d16-725dd60578ba','2026-06-05',8.76,'COMPLETED',0,NULL,'2026-06-05 16:17:39.423','2026-06-06 01:02:58.097'),('f3ec548e-ee49-4e6c-9fe0-738fb0fd6823','f50d6be4-b2c7-4c68-9d16-725dd60578ba','2026-06-15',4.49,'BELOW_TARGET',0,NULL,'2026-06-15 18:33:51.416','2026-06-15 23:03:19.320'),('fdd61bf5-024c-4acc-af9c-3707262ef299','a84bd45e-2108-48c3-8116-f951f405c528','2026-06-04',0.25,'BELOW_TARGET',0,NULL,'2026-06-04 00:41:34.274','2026-06-04 08:00:37.077');
/*!40000 ALTER TABLE `attendance_days` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `audit_logs` (
  `id` varchar(191) NOT NULL,
  `adminId` varchar(191) NOT NULL,
  `targetUserId` varchar(191) DEFAULT NULL,
  `action` varchar(191) NOT NULL,
  `oldValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`oldValue`)),
  `newValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`newValue`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `audit_logs_adminId_fkey` (`adminId`),
  KEY `audit_logs_targetUserId_fkey` (`targetUserId`),
  CONSTRAINT `audit_logs_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `audit_logs_targetUserId_fkey` FOREIGN KEY (`targetUserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `punch_entries`
--

DROP TABLE IF EXISTS `punch_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `punch_entries_dayId_fkey` (`dayId`),
  KEY `punch_entries_userId_fkey` (`userId`),
  CONSTRAINT `punch_entries_dayId_fkey` FOREIGN KEY (`dayId`) REFERENCES `attendance_days` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `punch_entries_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `punch_entries`
--

LOCK TABLES `punch_entries` WRITE;
/*!40000 ALTER TABLE `punch_entries` DISABLE KEYS */;
INSERT INTO `punch_entries` VALUES ('075ef893-6a19-44a5-a1b7-9c86afb18099','0c3591af-2bb4-487e-b576-c10810234e69','a0bce272-bc37-4a63-af07-5c25ef3afbcd',1,'2026-06-08 16:45:42.519',44.85604036,-93.23458441,'Bloomington, Minnesota','2026-06-09 01:16:57.506',44.79055133,-93.48550616,'Shakopee, Minnesota',8.52,'2026-06-08 16:45:42.902','2026-06-09 01:16:58.146'),('07fc8306-0630-4328-96a4-c831ee11af3d','4752ddcb-9c26-4ad6-b0f8-5dbe8d72a464','5e30e26d-601a-49ad-ba68-2d25a3cad2de',1,'2026-06-16 17:00:00.802',44.85595820,-93.23478200,'Bloomington, Minnesota','2026-06-16 23:01:05.102',44.96477950,-93.19687130,'South Saint Anthony Park, Saint Paul, Minnesota',6.02,'2026-06-16 17:00:01.131','2026-06-16 23:01:05.477'),('08261c1a-b537-4277-9152-93d5f8685588','da01fd61-047b-4d2b-8a64-52453a916c0c','016b583f-1a88-48ab-bc35-886bb036a384',1,'2026-06-16 16:59:02.902',44.85606594,-93.23472081,'Bloomington, Minnesota','2026-06-16 22:14:08.748',45.00125985,-93.01296648,'North Saint Paul, Minnesota',5.25,'2026-06-16 16:59:03.305','2026-06-16 22:14:08.939'),('09f65edb-4a8b-4406-86b7-d975fbf058ce','91fef072-de82-4946-b48c-b754f7844fa3','74a5dcc8-c0e0-464c-82d3-c7f05c6b01e6',2,'2026-06-04 19:26:42.117',45.00378116,-93.08249588,'Maplewood, Minnesota',NULL,NULL,NULL,NULL,NULL,'2026-06-04 19:26:42.527','2026-06-04 19:26:42.527'),('0cd1f4b1-1164-4c3a-83ff-653c69a394a4','0a2be673-2a69-4835-bc6d-657526cb2dfe','aa1468ba-7658-4ee2-942b-16aa9af6099f',1,'2026-06-05 17:11:55.959',45.01343290,-93.03557710,'Maplewood, Minnesota','2026-06-06 01:39:40.555',45.00497135,-93.08920720,'Maplewood, Minnesota',8.46,'2026-06-05 17:11:56.142','2026-06-06 01:39:40.976'),('0e2320c3-9944-4141-8516-4820645ebf5e','71050f42-1334-4717-b792-5fa4eda039a1','016b583f-1a88-48ab-bc35-886bb036a384',1,'2026-06-10 15:45:50.320',45.00106894,-93.01296349,'North Saint Paul, Minnesota','2026-06-10 18:30:32.994',45.03351886,-92.99864023,'Maplewood, Minnesota',2.75,'2026-06-10 15:45:50.724','2026-06-10 18:30:33.139'),('1b3f94c6-638e-43e4-b41f-5cee26352241','71050f42-1334-4717-b792-5fa4eda039a1','016b583f-1a88-48ab-bc35-886bb036a384',2,'2026-06-10 18:58:26.402',45.00635590,-93.01254063,'North Saint Paul, Minnesota','2026-06-10 22:26:22.999',44.95639718,-93.02537279,'Eastview, Saint Paul, Minnesota',3.47,'2026-06-10 18:58:26.762','2026-06-10 22:26:23.422'),('1d0fe6e2-180f-4ea8-b01a-34afd3ae0220','b95012f5-0cf0-4dd0-a2d4-8d5ad927957e','5e30e26d-601a-49ad-ba68-2d25a3cad2de',1,'2026-06-08 18:36:58.760',44.85614610,-93.23452270,'Bloomington, Minnesota','2026-06-08 19:54:25.835',44.85549960,-93.23416270,'Bloomington, Minnesota',1.29,'2026-06-08 18:36:58.979','2026-06-08 19:54:26.191'),('1fd7aedb-3b4e-4e58-91e9-56be0105c8d7','9baec428-246d-4e36-8fdc-f63ca4b57eef','a84bd45e-2108-48c3-8116-f951f405c528',1,'2026-06-05 10:46:49.086',24.85486316,67.02540335,'Fowler Lines, Karachi Division, Sindh','2026-06-05 13:34:33.971',24.85482781,67.02533870,'Fowler Lines, Karachi Division, Sindh',2.80,'2026-06-05 10:46:49.457','2026-06-05 13:34:34.350'),('2d6d8c36-818b-486e-a379-b5f1654c1057','39982cf9-8818-4647-a6ec-311f9222812f','a84bd45e-2108-48c3-8116-f951f405c528',1,'2026-06-01 13:42:47.213',24.85477094,67.02539549,'Fowler Lines, Karachi Division, Sindh',NULL,NULL,NULL,NULL,NULL,'2026-06-01 13:42:48.310','2026-06-01 13:42:48.310'),('30a1a9a3-809c-4ed3-8eec-bbe6000e952f','6d276785-beb2-4a9b-8ef1-0f7d3b998afe','5e30e26d-601a-49ad-ba68-2d25a3cad2de',1,'2026-06-09 20:52:17.178',44.96211940,-93.19001030,'South Saint Anthony Park, Saint Paul, Minnesota','2026-06-10 00:05:31.591',44.96476510,-93.19694180,'South Saint Anthony Park, Saint Paul, Minnesota',3.22,'2026-06-09 20:52:17.513','2026-06-10 00:05:32.167'),('34abf846-fd72-4830-acad-d1a1223a6d1f','c811c3ac-074b-4878-adab-d416963d076a','aa1468ba-7658-4ee2-942b-16aa9af6099f',1,'2026-06-04 16:51:00.000',45.00659925,-93.07143452,'Maplewood, Minnesota','2026-06-04 23:28:00.000',NULL,NULL,NULL,6.62,'2026-06-04 16:51:33.275','2026-06-04 23:48:52.007'),('36e18dbc-5c57-4727-b40e-ad17d1c05ff4','fdd61bf5-024c-4acc-af9c-3707262ef299','a84bd45e-2108-48c3-8116-f951f405c528',2,'2026-06-04 03:12:09.803',44.84235174,-93.17924785,'Eagan, Minnesota','2026-06-04 03:24:54.011',44.84267603,-93.17899244,'Eagan, Minnesota',0.21,'2026-06-04 03:12:10.178','2026-06-04 03:24:54.386'),('4a9f967f-5773-4c76-842e-ba05b9768dfd','a072b71a-934b-45ce-8434-709b72324b37','a84bd45e-2108-48c3-8116-f951f405c528',1,'2026-06-02 15:54:50.547',24.85485945,67.02550081,'Fowler Lines, Karachi Division, Sindh',NULL,NULL,NULL,NULL,NULL,'2026-06-02 15:54:51.724','2026-06-02 15:54:51.724'),('52fadfa2-8575-46a4-bea7-45ab44274b74','fdd61bf5-024c-4acc-af9c-3707262ef299','a84bd45e-2108-48c3-8116-f951f405c528',1,'2026-06-04 00:41:34.185',24.88238444,67.14987725,'Shah Faisal Block 2, Karachi Division, Sindh','2026-06-04 00:41:55.217',24.88238444,67.14987725,'Shah Faisal Block 2, Karachi Division, Sindh',0.01,'2026-06-04 00:41:34.564','2026-06-04 00:41:55.357'),('530edcdb-976a-470b-b143-004754d76403','16eec634-643c-4db7-8b02-940a2bec582b','016b583f-1a88-48ab-bc35-886bb036a384',1,'2026-06-09 20:30:02.076',45.00373405,-93.00722230,'North Saint Paul, Minnesota','2026-06-10 00:10:35.065',45.00636473,-93.01600374,'Maplewood, Minnesota',3.68,'2026-06-09 20:30:02.450','2026-06-10 00:10:35.415'),('5d4c2bdf-0352-4ed5-8292-8f4816d7c225','d483d1f1-5b0f-43e3-9d95-bb52bc2b0eae','a84bd45e-2108-48c3-8116-f951f405c528',2,'2026-06-03 19:08:51.912',45.00298091,-93.07900993,'Maplewood, Minnesota','2026-06-03 19:09:08.335',45.00320175,-93.07901860,'Maplewood, Minnesota',0.00,'2026-06-03 19:08:52.218','2026-06-03 19:09:08.728'),('62d51386-5733-4859-83ec-3b14ddec49bd','91fef072-de82-4946-b48c-b754f7844fa3','74a5dcc8-c0e0-464c-82d3-c7f05c6b01e6',1,'2026-06-04 16:27:47.917',45.00675551,-93.07169127,'Maplewood, Minnesota','2026-06-04 17:30:18.492',45.00515659,-93.07174261,'Maplewood, Minnesota',1.04,'2026-06-04 16:27:48.221','2026-06-04 17:30:18.788'),('657807bb-c882-4e0a-89c6-5d824e497afd','25a91da7-64d5-437f-a9ef-a647e1597e89','016b583f-1a88-48ab-bc35-886bb036a384',1,'2026-06-04 15:50:15.459',45.00669430,-93.07149349,'Maplewood, Minnesota','2026-06-04 23:31:51.452',45.00125985,-93.01296000,'North Saint Paul, Minnesota',7.69,'2026-06-04 15:50:15.837','2026-06-04 23:31:51.803'),('6db4f315-90f3-4056-a8ad-01a6baf4c630','f3ec548e-ee49-4e6c-9fe0-738fb0fd6823','f50d6be4-b2c7-4c68-9d16-725dd60578ba',1,'2026-06-15 18:33:51.246',45.02964950,-93.00949950,'Maplewood, Minnesota','2026-06-15 23:03:18.724',45.00049070,-93.08592920,'Maplewood, Minnesota',4.49,'2026-06-15 18:33:51.632','2026-06-15 23:03:19.116'),('711c5555-e7f9-4080-85d0-434007eae481','a0342ae5-2ff4-405d-aed5-a72618367448','a84bd45e-2108-48c3-8116-f951f405c528',1,'2026-06-11 15:37:31.151',24.85481823,67.02545548,'Fowler Lines, Karachi Division, Sindh','2026-06-11 15:38:37.741',24.85497143,67.02557777,'Fowler Lines, Karachi Division, Sindh',0.02,'2026-06-11 15:37:31.565','2026-06-11 15:38:38.098'),('742aa880-206b-46f2-8746-58414259911f','d483d1f1-5b0f-43e3-9d95-bb52bc2b0eae','a84bd45e-2108-48c3-8116-f951f405c528',1,'2026-06-03 18:52:36.988',45.00306219,-93.07831930,'Maplewood, Minnesota','2026-06-03 18:52:56.141',45.00304295,-93.07826059,'Maplewood, Minnesota',0.01,'2026-06-03 18:52:37.377','2026-06-03 18:52:56.476'),('784c7e38-1017-45b1-b874-4a318af0c9eb','126822b0-34a5-4fcf-a3c2-fc00b5ee9fb2','a84bd45e-2108-48c3-8116-f951f405c528',3,'2026-06-01 14:00:04.387',24.85477871,67.02539526,'Fowler Lines, Karachi Division, Sindh','2026-06-01 14:08:40.886',24.85476490,67.02539815,'Fowler Lines, Karachi Division, Sindh',0.14,'2026-06-01 14:00:05.632','2026-06-01 14:08:41.884'),('830a710a-321a-4120-ac1d-455fd6df7034','e572060b-b13c-4410-a918-89f817cccabd','f50d6be4-b2c7-4c68-9d16-725dd60578ba',1,'2026-06-04 16:19:30.754',45.00694050,-93.07152170,'Maplewood, Minnesota','2026-06-04 21:35:56.814',45.00218590,-93.06820550,'Maplewood, Minnesota',5.27,'2026-06-04 16:19:31.137','2026-06-04 21:35:57.176'),('850385f6-8b0d-4b89-b635-b3fcd78d30c8','fdd61bf5-024c-4acc-af9c-3707262ef299','a84bd45e-2108-48c3-8116-f951f405c528',4,'2026-06-04 07:59:07.216',44.84234697,-93.17831911,'Eagan, Minnesota','2026-06-04 08:00:36.670',44.84233740,-93.17832452,'Eagan, Minnesota',0.02,'2026-06-04 07:59:07.572','2026-06-04 08:00:36.972'),('88f68376-8e8e-4bad-a7ba-63727bbf78ad','96a46edb-1b32-4d31-9bd9-7710034956aa','f50d6be4-b2c7-4c68-9d16-725dd60578ba',1,'2026-06-09 21:22:26.323',45.01361010,-93.02974400,'Maplewood, Minnesota','2026-06-09 23:54:45.284',45.01302100,-93.02070620,'Maplewood, Minnesota',2.54,'2026-06-09 21:22:26.687','2026-06-09 23:54:45.644'),('8abccfd4-ca36-478a-ba5e-36ed94b11520','8c6689a2-4d9b-4f0a-9328-f482f9ca2843','016b583f-1a88-48ab-bc35-886bb036a384',2,'2026-06-12 20:42:25.704',44.88473389,-93.08158839,'West Saint Paul, Minnesota','2026-06-12 23:12:22.269',45.00106637,-93.01296419,'North Saint Paul, Minnesota',2.50,'2026-06-12 20:42:26.078','2026-06-12 23:12:22.596'),('8b517564-7966-4484-be5a-9b539b7413b5','fdd61bf5-024c-4acc-af9c-3707262ef299','a84bd45e-2108-48c3-8116-f951f405c528',5,'2026-06-04 16:23:24.512',44.84235045,-93.17827691,'Eagan, Minnesota',NULL,NULL,NULL,NULL,NULL,'2026-06-04 16:23:24.736','2026-06-04 16:23:24.736'),('a2ea358f-6522-4670-a836-f13daba10e91','8c6689a2-4d9b-4f0a-9328-f482f9ca2843','016b583f-1a88-48ab-bc35-886bb036a384',1,'2026-06-12 17:25:23.695',45.00106840,-93.01296314,'North Saint Paul, Minnesota','2026-06-12 19:23:55.084',45.03478156,-92.99705155,'Maplewood, Minnesota',1.98,'2026-06-12 17:25:24.070','2026-06-12 19:23:55.480'),('a5ec6ad1-1f8c-4cff-916f-aa4c9baae712','c0a226dd-6711-4037-b441-2df7f46f7435','f50d6be4-b2c7-4c68-9d16-725dd60578ba',1,'2026-06-10 18:25:08.425',45.01880500,-93.02932270,'Maplewood, Minnesota','2026-06-10 22:26:34.371',45.02106590,-93.01941780,'Maplewood, Minnesota',4.02,'2026-06-10 18:25:08.864','2026-06-10 22:26:34.534'),('ad0edbec-1841-4577-8e1d-d5dc51149d60','866fdd65-3392-497a-9d81-34cd00b1124e','f50d6be4-b2c7-4c68-9d16-725dd60578ba',1,'2026-06-12 18:45:01.686',45.02645940,-93.02012460,'Maplewood, Minnesota','2026-06-12 23:06:29.392',45.01282580,-93.03389870,'Maplewood, Minnesota',4.36,'2026-06-12 18:45:02.039','2026-06-12 23:06:29.771'),('b5a2d8f1-7d1f-4306-a44e-988c5c52520e','0b37da36-079f-42b8-be6a-cc38f3d68f8b','aa1468ba-7658-4ee2-942b-16aa9af6099f',1,'2026-06-08 16:41:49.920',44.85612785,-93.23483151,'Bloomington, Minnesota','2026-06-08 19:07:17.655',44.85605831,-93.23491646,'Bloomington, Minnesota',2.42,'2026-06-08 16:41:50.269','2026-06-08 19:07:18.014'),('be041b35-640c-4692-a7ac-922bd59334d7','126822b0-34a5-4fcf-a3c2-fc00b5ee9fb2','a84bd45e-2108-48c3-8116-f951f405c528',2,'2026-06-01 13:47:24.703',24.85476355,67.02538489,'Fowler Lines, Karachi Division, Sindh','2026-06-01 13:49:46.842',24.85477571,67.02538831,'Fowler Lines, Karachi Division, Sindh',0.04,'2026-06-01 13:47:26.053','2026-06-01 13:49:47.980'),('c9fc6bb5-5007-4172-a465-83f3b30ad9f0','57afe176-2ee1-4f4c-b8b2-f45fdf773410','2108ec00-a987-484a-92c8-c9e1a524ae12',1,'2026-06-03 22:07:40.419',44.84238029,-93.17922907,'Eagan, Minnesota','2026-06-03 22:07:46.536',44.84238029,-93.17922907,'Eagan, Minnesota',0.00,'2026-06-03 22:07:40.779','2026-06-03 22:07:46.656'),('ce6ec5ac-6609-4349-8bab-a1536c620de0','5276e0eb-4264-4d2a-9758-8afab17be080','016b583f-1a88-48ab-bc35-886bb036a384',1,'2026-06-05 16:16:32.676',45.01035775,-93.02458409,'Maplewood, Minnesota','2026-06-06 01:09:15.905',45.00106999,-93.01296448,'North Saint Paul, Minnesota',8.88,'2026-06-05 16:16:32.987','2026-06-06 01:09:16.107'),('d8709511-b45f-434c-9a0a-79e02f2b8e2d','fdd61bf5-024c-4acc-af9c-3707262ef299','a84bd45e-2108-48c3-8116-f951f405c528',3,'2026-06-04 07:56:10.186',44.84234051,-93.17829076,'Eagan, Minnesota','2026-06-04 07:56:48.479',44.84234683,-93.17832629,'Eagan, Minnesota',0.01,'2026-06-04 07:56:10.542','2026-06-04 07:56:48.795'),('e6bb298c-2f21-4976-86f4-b71cf93e4301','7cbf0e33-4522-4b1a-ba02-89da600fa431','f50d6be4-b2c7-4c68-9d16-725dd60578ba',1,'2026-06-16 16:58:40.284',44.85595600,-93.23476840,'Bloomington, Minnesota','2026-06-16 21:50:41.318',44.99409420,-93.02338660,'Maplewood, Minnesota',4.87,'2026-06-16 16:58:40.655','2026-06-16 21:50:41.689'),('edf06098-0b89-42ef-8a0b-8debde5726b8','126822b0-34a5-4fcf-a3c2-fc00b5ee9fb2','a84bd45e-2108-48c3-8116-f951f405c528',1,'2026-06-01 13:31:35.383',24.85477527,67.02539381,'فاؤلر لائنز, کراچی ڈویژن, سندھ','2026-06-01 13:32:23.649',24.85477407,67.02539774,'فاؤلر لائنز, کراچی ڈویژن, سندھ',0.01,'2026-06-01 13:31:37.664','2026-06-01 13:32:26.113'),('f4296211-e390-4550-be77-6d398985f294','d483d1f1-5b0f-43e3-9d95-bb52bc2b0eae','a84bd45e-2108-48c3-8116-f951f405c528',3,'2026-06-03 23:44:09.357',24.88068405,67.15036325,'Shah Faisal Block 2, Karachi Division, Sindh',NULL,NULL,NULL,NULL,NULL,'2026-06-03 23:44:09.912','2026-06-03 23:44:09.912'),('f87e623e-3fb6-4710-a0b6-c34ace9311ea','e8737ab9-8d41-4ebf-840a-8093b5d9bb97','f50d6be4-b2c7-4c68-9d16-725dd60578ba',1,'2026-06-05 16:17:39.380',45.01038380,-93.02455750,'Maplewood, Minnesota','2026-06-06 01:02:57.421',44.96561210,-93.01726130,'Greater East Side, Saint Paul, Minnesota',8.76,'2026-06-05 16:17:39.771','2026-06-06 01:02:57.919');
/*!40000 ALTER TABLE `punch_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_entries`
--

DROP TABLE IF EXISTS `sales_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sales_entries` (
  `id` varchar(191) NOT NULL,
  `agentId` varchar(191) NOT NULL,
  `agentName` varchar(191) NOT NULL,
  `portal` varchar(191) NOT NULL,
  `provider` varchar(191) NOT NULL,
  `customerName` varchar(191) NOT NULL,
  `customerPhone` varchar(191) NOT NULL,
  `customerAddress` varchar(191) NOT NULL,
  `city` varchar(191) NOT NULL,
  `state` varchar(191) NOT NULL,
  `zipCode` varchar(191) NOT NULL,
  `hasMobile` tinyint(1) NOT NULL DEFAULT 0,
  `hasInternet` tinyint(1) NOT NULL DEFAULT 0,
  `hasTv` tinyint(1) NOT NULL DEFAULT 0,
  `hasPhone` tinyint(1) NOT NULL DEFAULT 0,
  `hasHomeSecurity` tinyint(1) NOT NULL DEFAULT 0,
  `comments` text DEFAULT NULL,
  `activationStatus` varchar(191) NOT NULL,
  `paymentStatus` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sales_entries_agentId_fkey` (`agentId`),
  CONSTRAINT `sales_entries_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_entries`
--

LOCK TABLES `sales_entries` WRITE;
/*!40000 ALTER TABLE `sales_entries` DISABLE KEYS */;
INSERT INTO `sales_entries` VALUES ('10be82ee-7758-4f01-8e38-200292ee9428','f50d6be4-b2c7-4c68-9d16-725dd60578ba','Christopher Schmitt','COP','Xfinity','Russell Hollerbach','6512242225','2595 Ariel St N','Maplewood','MN','55109',1,1,0,0,0,'Gig internet and mobile\nRussell Hollerbach\n2595 Ariel St N Maplewood MN\n8772105370771830\n331090150748695741\n3729676289157180443','Pending','Unpaid','2026-06-15 00:00:00.000','2026-06-16 00:18:11.454'),('27aeb461-7e5c-40ef-ae06-237fb4934bcf','a84bd45e-2108-48c3-8116-f951f405c528','Demo Agent','Residential','Xfinity','Test','1234567890','2626 E 82nd St Ste 230','Bloomington','MN','55425',1,1,0,0,0,'\nInternet Acct 8772105370771517\nInternet Order 331090921173306409\nMonile Order 3726494288720499244','Non-Active','Unpaid','2026-06-12 17:36:12.297','2026-06-12 17:36:12.297'),('588612b6-7142-4ad6-bf81-0239f8a7a635','f50d6be4-b2c7-4c68-9d16-725dd60578ba','Christopher Schmitt','Residential','Xfinity','Morgan Bussie','6512792207','1822 Mesabi avenue','Maplewood','MN','55109',1,1,0,0,0,'All up and running and activated phones and internet. Two lines and Gigabit internet.','Activation','Unpaid','2026-06-13 04:09:25.003','2026-06-13 04:09:25.003'),('6ec94542-ab5f-4e51-a3a6-57637de823bc','f50d6be4-b2c7-4c68-9d16-725dd60578ba','Christopher Schmitt','Residential','Xfinity','Judy Keppers','6127418957','2664 Gem St N','Maplewood','MN','55109',1,1,0,0,0,'Activated internet gigabit. Transferred one phone and activated it. ','Non-Active','Unpaid','2026-06-13 04:15:38.191','2026-06-13 04:15:38.191'),('7266f840-f82b-408a-9149-32b2ffd2206f','f50d6be4-b2c7-4c68-9d16-725dd60578ba','Christopher Schmitt','COP','Xfinity','Betty Cody','6515876456','1571 Grandview ave e','Maplewood','MN','55109',1,1,0,0,0,'Pending shipping of modem and new phone\n331090173340296954\n8772105370771665\n3721658288903041833\n1033033316','Non-Active','Unpaid','2026-06-12 00:00:00.000','2026-06-16 10:24:51.153'),('9e953710-8791-412a-86ee-d5aec26dfb5d','016b583f-1a88-48ab-bc35-886bb036a384','Brian Mcarthur','COP','Xfinity','Khadija green','6512399305','2111 Bradley st','Maplewood','MN','55109',1,1,0,0,0,'8772105370771459 Acc number \n\nInternet work order number 331090458235283268\n\nMobile account number 1032931875','Pending','Unpaid','2026-06-15 00:00:00.000','2026-06-16 20:44:44.787'),('c14375d3-ad2f-4d8b-81bd-9d3febcea594','a84bd45e-2108-48c3-8116-f951f405c528','Demo Agent','Residential','Xfinity','Tailor Deep','04232423422','asdsad','dasdsad','IA','sadsadsa',1,0,0,1,0,'asdasdasdsdsaddasd','Activation','Paid','2026-06-12 13:26:58.996','2026-06-12 13:26:58.996'),('ea3823c8-38e3-42f6-91e9-3728aa02a102','f50d6be4-b2c7-4c68-9d16-725dd60578ba','Christopher Schmitt','Residential','Xfinity','Minh Bui','7634024756','2018 Kenwood dr w','Maplewood','MN','55117',1,1,0,0,0,'The cell phone is not active yet it was mailed to the customer. But the internet is active and installed.','Activation','Unpaid','2026-06-13 04:07:02.380','2026-06-13 04:07:02.380'),('fe700e02-9496-494b-a34a-f18f516ffd05','f50d6be4-b2c7-4c68-9d16-725dd60578ba','Christopher Schmitt','Residential','Xfinity','Andrea Paakkonen ','6512393153','1749 County Rd C E','Maplewood','MN','55109',1,1,0,0,0,'I activated the internet it is up and running. I also activated the line ported from ATT 6512393153. The other number I believe ends in 5575 and is a number porting from Century Link and it takes 7-10 business days','Activation','Unpaid','2026-06-13 04:13:00.783','2026-06-13 04:13:00.783');
/*!40000 ALTER TABLE `sales_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `password` varchar(191) NOT NULL,
  `role` enum('AGENT','ADMIN','SUPER_ADMIN') NOT NULL DEFAULT 'AGENT',
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `resetToken` varchar(191) DEFAULT NULL,
  `resetTokenExpires` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('016b583f-1a88-48ab-bc35-886bb036a384','Brian Mcarthur','razeproductions@yahoo.com',NULL,'$2b$12$GNi7YVV7Hz69uX0yW0mSW.fZzwROoN411ZMt6rbyDLCy5W9XGta4W','AGENT',1,'2026-06-04 02:56:16.964','2026-06-04 03:02:03.905',NULL,NULL),('2108ec00-a987-484a-92c8-c9e1a524ae12','Zain Ali','bussiness.zain@gmail.com',NULL,'$2b$12$fKCmRZ/GIoyDt/E/ObiUKOSmLTWI65zb02L44Y6e1LRWupPYaboL.','AGENT',1,'2026-06-03 22:06:53.063','2026-06-03 22:06:53.063',NULL,NULL),('5e30e26d-601a-49ad-ba68-2d25a3cad2de','Jon Bergantin ','jonlimarbergantin@yahoo.com',NULL,'$2b$12$p7.7e7LEy88VkTaROcUAfeJVe9ZoCT0AzQzNQGW/St0CuKtO19Pbe','AGENT',1,'2026-06-08 18:34:33.977','2026-06-08 18:34:33.977',NULL,NULL),('74a5dcc8-c0e0-464c-82d3-c7f05c6b01e6','Ebony Stevenson','ebonystevenson32@gmail.com',NULL,'$2b$12$lyeR/UAP06ouUtqwOe8reOsCUn.ixsgdeFG2esDogt.uHX/So7R4a','AGENT',0,'2026-06-04 02:53:59.045','2026-06-09 00:31:36.208',NULL,NULL),('a0bce272-bc37-4a63-af07-5c25ef3afbcd','Edward Kumi','ekumi4815@gmail.com',NULL,'$2b$12$bjQZi5kcOjaMO3ryb02Af.Oi5xHbY1k.ES6JhqJ87rZYQ1sqpUG36','AGENT',0,'2026-06-04 03:03:50.364','2026-06-09 18:17:57.453',NULL,NULL),('a84bd45e-2108-48c3-8116-f951f405c528','Demo Agent','demo.agent@doortrack.com','+1 555 000 0000','$2b$12$IsvgqzhfS5F7I4TYBsfhC.YDH72KgX6X7QdXv9FvTQAQjYtAjS5Vy','AGENT',1,'2026-06-01 13:28:20.723','2026-06-01 13:28:20.723',NULL,NULL),('aa1468ba-7658-4ee2-942b-16aa9af6099f','Ronnisha Woods','2727drew@gmail.com',NULL,'$2b$12$d1qYuuEOmBxA.qUUoQY6NeoE7nYW6EdxqIDmVOWGNTksfR9W6fnAG','AGENT',0,'2026-06-04 03:04:50.166','2026-06-09 18:18:01.093',NULL,NULL),('e1fc1ee9-05b6-4fc5-aa62-64df31435a3f','System Admin','admin@doortrack.com',NULL,'$2b$12$ph7OkzTXLtHg0fT0t4PVmOlP.ywtQ932fUDOIrb6WolNQpdfKe3hq','SUPER_ADMIN',1,'2026-06-01 13:28:20.713','2026-06-01 13:28:20.713',NULL,NULL),('f50d6be4-b2c7-4c68-9d16-725dd60578ba','Christopher Schmitt','Chschm769490@gmail.com',NULL,'$2b$12$zoYC.ComclXqM9hi6KGHYu2Y2bt2fcstky9gDdo8bhCULAsxo7Xqm','AGENT',1,'2026-06-04 03:03:08.604','2026-06-04 03:03:08.604',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-18 17:24:35
