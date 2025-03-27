-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: vizsga
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `itemNameId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `itemNameId` (`itemNameId`),
  CONSTRAINT `item_ibfk_1` FOREIGN KEY (`itemNameId`) REFERENCES `item_name` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_name`
--

DROP TABLE IF EXISTS `item_name`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_name` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item` varchar(30) COLLATE utf8mb4_hungarian_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `item` (`item`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_name`
--

LOCK TABLES `item_name` WRITE;
/*!40000 ALTER TABLE `item_name` DISABLE KEYS */;
/*!40000 ALTER TABLE `item_name` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `itemId` int NOT NULL,
  `itemNameId` int NOT NULL,
  `storagePlaceId` int NOT NULL,
  `actionType` enum('ADD','UPDATE','DELETE') COLLATE utf8mb4_hungarian_ci NOT NULL,
  `createdBy` int NOT NULL,
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs`
--

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storage_conn`
--

DROP TABLE IF EXISTS `storage_conn`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `storage_conn` (
  `id` int NOT NULL AUTO_INCREMENT,
  `itemId` int NOT NULL,
  `storagePlaceId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `itemId` (`itemId`),
  KEY `storagePlaceId` (`storagePlaceId`),
  CONSTRAINT `storage_conn_ibfk_1` FOREIGN KEY (`itemId`) REFERENCES `item` (`id`),
  CONSTRAINT `storage_conn_ibfk_2` FOREIGN KEY (`storagePlaceId`) REFERENCES `storage_place` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storage_conn`
--

LOCK TABLES `storage_conn` WRITE;
/*!40000 ALTER TABLE `storage_conn` DISABLE KEYS */;
/*!40000 ALTER TABLE `storage_conn` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storage_place`
--

DROP TABLE IF EXISTS `storage_place`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `storage_place` (
  `id` int NOT NULL AUTO_INCREMENT,
  `storage` varchar(20) COLLATE utf8mb4_hungarian_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `storage` (`storage`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storage_place`
--

LOCK TABLES `storage_place` WRITE;
/*!40000 ALTER TABLE `storage_place` DISABLE KEYS */;
/*!40000 ALTER TABLE `storage_place` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userEmail` varchar(255) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `userPassword` varchar(60) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `isAdmin` tinyint(1) DEFAULT '0',
  `isFirstLogin` tinyint(1) NOT NULL DEFAULT '1',
  `isDisabled` tinyint(1) NOT NULL DEFAULT '0',
  `failedLoginAttempts` int NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userEmail` (`userEmail`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','$2b$10$J6UhGAJInKyFpVa1u5UYAO9dnCo1pf0VgmKrbohdtMpACqQ25KYXm',1,0,0,0,'2025-03-27 22:10:40','2025-03-27 22:10:40');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'vizsga'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-27 22:15:38
