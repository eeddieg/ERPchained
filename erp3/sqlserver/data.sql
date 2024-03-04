-- MySQL dump 10.13  Distrib 8.0.35, for Linux (x86_64)
--
-- Host: localhost    Database: backend3
-- ------------------------------------------------------
-- Server version	8.0.35

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
-- Table structure for table `AssignedBlockchainAddress`
--

DROP TABLE IF EXISTS `AssignedBlockchainAddress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AssignedBlockchainAddress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `AssignedBlockchainAddress_address_key` (`address`),
  UNIQUE KEY `AssignedBlockchainAddress_email_key` (`email`),
  CONSTRAINT `AssignedBlockchainAddress_address_fkey` FOREIGN KEY (`address`) REFERENCES `AvailableBlockchainAddress` (`address`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AssignedBlockchainAddress`
--

LOCK TABLES `AssignedBlockchainAddress` WRITE;
/*!40000 ALTER TABLE `AssignedBlockchainAddress` DISABLE KEYS */;
INSERT INTO `AssignedBlockchainAddress` VALUES (1,'0x9AdE27736ed8482262B1a045fAcaB62fF8bc22FB','ert@ert.ert'),(2,'0xB18392DbeF5d8fE6DB44eD3d490dA6a8235170ff','dfg@dfg.dfg'),(3,'0xeB7b392A06D0F6900Da128Ca1547d53022e6a2DF','cvb@cvb.cvb'),(4,'0xc1b3Fd98CC9541BB90b19EE1c0C5C9633421D73b','cust8@test.com');
/*!40000 ALTER TABLE `AssignedBlockchainAddress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AvailableBlockchainAddress`
--

DROP TABLE IF EXISTS `AvailableBlockchainAddress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AvailableBlockchainAddress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `AvailableBlockchainAddress_address_key` (`address`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AvailableBlockchainAddress`
--

LOCK TABLES `AvailableBlockchainAddress` WRITE;
/*!40000 ALTER TABLE `AvailableBlockchainAddress` DISABLE KEYS */;
INSERT INTO `AvailableBlockchainAddress` VALUES (12,'0x01985F7D085515C42Be83e40B82ec20f6C8b0AD6'),(6,'0x027962aE1147fE47Fe02484583e37dc33fd69f9e'),(10,'0x0E35Fd7bD8a00792A21E4dec562FB0A69e3b25df'),(15,'0x377ef20DF86950a01D3ACa688f74d8f74E912DF2'),(14,'0x391B93347Db43ea054C586Da529b3C61934e083C'),(13,'0x44d1885b62770faE4e99c2900c736E0E1377c17B'),(5,'0x5823a2307E2eD066d94f97C94F946E54cfA9bce4'),(17,'0x68DBd5544D90a8785F75000F5d2a301f17095d7a'),(18,'0x9826D61dC79eAd88A1FAB64FC2AD8FFDa10010C4'),(1,'0x9AdE27736ed8482262B1a045fAcaB62fF8bc22FB'),(8,'0xa2f2798655b49970cb189560aF443d951119C35E'),(11,'0xA81d42117d9745d6CcfC5e0Bec3E19a57592d1da'),(7,'0xafd02900194565d455A95D2638B6E6077Bd0a328'),(2,'0xB18392DbeF5d8fE6DB44eD3d490dA6a8235170ff'),(9,'0xB6d2062255D16E845AA75AaA78f610e69543efc1'),(19,'0xbCC5Ee29c9D5432401deb03035C155b118B9a818'),(4,'0xc1b3Fd98CC9541BB90b19EE1c0C5C9633421D73b'),(16,'0xc5441806ADF3f9d93d46DB414F0EEB7f76e288D4'),(3,'0xeB7b392A06D0F6900Da128Ca1547d53022e6a2DF'),(20,'0xFE53be66ABE220946C785dF3426d062bd1747EfC');
/*!40000 ALTER TABLE `AvailableBlockchainAddress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Customer`
--

DROP TABLE IF EXISTS `Customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Customer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Customer_email_key` (`email`),
  UNIQUE KEY `Customer_address_key` (`address`)
) ENGINE=InnoDB AUTO_INCREMENT=3002 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Customer`
--

LOCK TABLES `Customer` WRITE;
/*!40000 ALTER TABLE `Customer` DISABLE KEYS */;
INSERT INTO `Customer` VALUES (3001,'Customer 8','cust8@test.com','0xc1b3Fd98CC9541BB90b19EE1c0C5C9633421D73b');
/*!40000 ALTER TABLE `Customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Inventory`
--

DROP TABLE IF EXISTS `Inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customerId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Inventory_customerId_key` (`customerId`),
  CONSTRAINT `Inventory_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Inventory`
--

LOCK TABLES `Inventory` WRITE;
/*!40000 ALTER TABLE `Inventory` DISABLE KEYS */;
INSERT INTO `Inventory` VALUES (1,3001);
/*!40000 ALTER TABLE `Inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MFA`
--

DROP TABLE IF EXISTS `MFA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MFA` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `status` tinyint(1) NOT NULL,
  `verified` tinyint(1) NOT NULL,
  `ascii` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hex` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `base32` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `otpAuthUrl` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qr` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `MFA_userId_key` (`userId`),
  CONSTRAINT `MFA_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MFA`
--

LOCK TABLES `MFA` WRITE;
/*!40000 ALTER TABLE `MFA` DISABLE KEYS */;
/*!40000 ALTER TABLE `MFA` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Order`
--

DROP TABLE IF EXISTS `Order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customerId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deliveredAt` datetime(3) DEFAULT NULL,
  `type` enum('INCOMING','OUTCOMING') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PLACED','PROCESS','COMPLETED','CANCELED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PLACED',
  PRIMARY KEY (`id`),
  KEY `Order_customerId_fkey` (`customerId`),
  CONSTRAINT `Order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Order`
--

LOCK TABLES `Order` WRITE;
/*!40000 ALTER TABLE `Order` DISABLE KEYS */;
INSERT INTO `Order` VALUES (1,3001,'2024-01-05 09:17:56.613','2024-01-05 09:17:56.623','INCOMING','COMPLETED');
/*!40000 ALTER TABLE `Order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Receipt`
--

DROP TABLE IF EXISTS `Receipt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Receipt` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int NOT NULL,
  `to` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `from` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `blockHash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `blockNumber` int NOT NULL,
  `status` int NOT NULL,
  `hash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Receipt_orderId_key` (`orderId`),
  UNIQUE KEY `Receipt_hash_key` (`hash`),
  CONSTRAINT `Receipt_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Receipt`
--

LOCK TABLES `Receipt` WRITE;
/*!40000 ALTER TABLE `Receipt` DISABLE KEYS */;
/*!40000 ALTER TABLE `Receipt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Resource`
--

DROP TABLE IF EXISTS `Resource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Resource` (
  `id` int NOT NULL AUTO_INCREMENT,
  `inventoryId` int NOT NULL,
  `orderId` int NOT NULL,
  `title` enum('WHEAT','FLOUR','BREAD') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'WHEAT',
  `amount` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Resource_inventoryId_fkey` (`inventoryId`),
  KEY `Resource_orderId_fkey` (`orderId`),
  CONSTRAINT `Resource_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `Inventory` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Resource_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Resource`
--

LOCK TABLES `Resource` WRITE;
/*!40000 ALTER TABLE `Resource` DISABLE KEYS */;
INSERT INTO `Resource` VALUES (1,1,1,'FLOUR',1000);
/*!40000 ALTER TABLE `Resource` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','MODERATOR','USER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `refreshToken` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mfaId` int DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'ert','ert','ert@ert.ert','$2b$10$vW6XJ8cnM1B28QUPW.QjH.G.kKzQhSOfrHBF7v61co5mapaWdo./a','ADMIN','',NULL,'0x9AdE27736ed8482262B1a045fAcaB62fF8bc22FB'),(2,'dfg','dfg','dfg@dfg.dfg','$2b$10$LE6LAzc26G5waW2sUjaXnejTJKGGaMBf/1wZr47buCs21tuZSjWOu','MODERATOR','',NULL,'0xB18392DbeF5d8fE6DB44eD3d490dA6a8235170ff'),(3,'cvb','cvb','cvb@cvb.cvb','$2b$10$Y6DYACDHzb05LY7xE85iXOUNdPkBRfLVUhaTQKaZBGnsQv.3Ze/gq','USER','',NULL,'0xeB7b392A06D0F6900Da128Ca1547d53022e6a2DF');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('54fd7d75-4972-45f3-90e3-0ece70db4190','8a034ea234474e3aa7a5b4092533bc27d9cfecf95ca57f4d5904f5e52631bdc2','2024-01-05 09:17:52.753','20231209203311_',NULL,NULL,'2024-01-05 09:17:52.454',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-01-05 11:29:56
