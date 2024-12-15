-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 15, 2024 at 12:49 PM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kosmos_wiki`
--

-- --------------------------------------------------------

--
-- Table structure for table `campagne`
--

DROP TABLE IF EXISTS `campagne`;
CREATE TABLE IF NOT EXISTS `campagne` (
  `id_campagne` int NOT NULL AUTO_INCREMENT,
  `year` year NOT NULL,
  `estimated_volume` varchar(20) NOT NULL,
  PRIMARY KEY (`id_campagne`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `campagne`
--

INSERT INTO `campagne` (`id_campagne`, `year`, `estimated_volume`) VALUES
(1, '2024', '???');

-- --------------------------------------------------------

--
-- Table structure for table `stationinfo`
--

DROP TABLE IF EXISTS `stationinfo`;
CREATE TABLE IF NOT EXISTS `stationinfo` (
  `id_info` int NOT NULL AUTO_INCREMENT,
  `id_station` int NOT NULL,
  `file_name` varchar(200) NOT NULL,
  PRIMARY KEY (`id_info`),
  KEY `id_station` (`id_station`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stations`
--

DROP TABLE IF EXISTS `stations`;
CREATE TABLE IF NOT EXISTS `stations` (
  `id_station` int NOT NULL AUTO_INCREMENT,
  `id_campagne` int NOT NULL,
  `description` varchar(1000) NOT NULL,
  `code_station` varchar(20) NOT NULL,
  PRIMARY KEY (`id_station`),
  KEY `stations_ibfk_1` (`id_campagne`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `stations`
--

INSERT INTO `stations` (`id_station`, `id_campagne`, `description`, `code_station`) VALUES
(1, 1, 'station1', 'K5_BR240024');

-- --------------------------------------------------------

--
-- Table structure for table `systemevents`
--

DROP TABLE IF EXISTS `systemevents`;
CREATE TABLE IF NOT EXISTS `systemevents` (
  `id_event` int NOT NULL AUTO_INCREMENT,
  `id_video` int NOT NULL,
  `timestamp` timestamp NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id_event`),
  KEY `id_video` (`id_video`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `identification` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `access_level` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `identification`, `password`, `access_level`) VALUES
(1, 'admin', 'admin', 'scientific'),
(3, 'member', 'member', 'community_member'),
(4, 'general_user', '', 'general_public');

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

DROP TABLE IF EXISTS `videos`;
CREATE TABLE IF NOT EXISTS `videos` (
  `id_video` int NOT NULL AUTO_INCREMENT,
  `id_station` int NOT NULL,
  `recording_date` date NOT NULL,
  `file_name` varchar(200) NOT NULL,
  `file_size` varchar(200) NOT NULL,
  `id_user` int NOT NULL,
  `metadata` json NOT NULL,
  PRIMARY KEY (`id_video`),
  KEY `id_station` (`id_station`),
  KEY `id_user` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `videos`
--

INSERT INTO `videos` (`id_video`, `id_station`, `recording_date`, `file_name`, `file_size`, `id_user`, `metadata`) VALUES
(1, 1, '2024-12-08', 'Bubbles.mp4', '4502617', 1, '{\"video\": {\"ctdDict\": {\"salinite\": \"\", \"profondeur\": 9.5, \"temperature\": 15.9}, \"gpsDict\": {\"site\": \"Brentec\'h\", \"latitude\": 47.85762, \"longitude\": -3.97411}, \"astroDict\": {\"lune\": \"PQ\", \"maree\": \"BM+1\", \"coefficient\": 74}, \"heureDict\": {\"heure\": 11, \"minute\": 26, \"seconde\": 37}, \"analyseDict\": {\"faune\": \"Mullidae, Gobidae\", \"habitat\": \"laminaires, sable\", \"visibilite\": \"\", \"exploitabilite\": \"\"}, \"codeStation\": \"K5_BR240024\", \"meteoAirDict\": {\"ciel\": \"soleil\", \"vent\": 2, \"tempAir\": 15.6, \"atmPress\": 1013, \"direction\": \"NE\"}, \"meteoMerDict\": {\"houle\": 1, \"etatMer\": \"belle\"}}, \"campagne\": {\"dateDict\": {\"day\": 12, \"date\": \"12/08/2024\", \"year\": 2024, \"month\": 8}, \"zoneDict\": {\"zone\": \"CC\", \"lieudit\": \"Illien\", \"campagne\": \"ATL\", \"protection\": \"Parc naturel marin d\'iroise\"}, \"deploiementDict\": {\"bateau\": \"Beneteau Capelan\", \"pilote\": \"Olivier F.\", \"equipage\": \"C.H., J.C.\", \"partenaires\": \"Ifremer RDT, Ifremer Halgo\"}}}'),
(2, 1, '2024-11-11', 'Waves.mp4', '1825771', 1, '{\"video\": {\"ctdDict\": {\"salinite\": \"\", \"profondeur\": 9.5, \"temperature\": 15.9}, \"gpsDict\": {\"site\": \"Brentec\'h\", \"latitude\": 47.85762, \"longitude\": -3.97411}, \"astroDict\": {\"lune\": \"PQ\", \"maree\": \"BM+1\", \"coefficient\": 74}, \"heureDict\": {\"heure\": 11, \"minute\": 26, \"seconde\": 37}, \"analyseDict\": {\"faune\": \"Mullidae, Gobidae\", \"habitat\": \"laminaires, sable\", \"visibilite\": \"\", \"exploitabilite\": \"\"}, \"codeStation\": \"K5_BR240024\", \"meteoAirDict\": {\"ciel\": \"soleil\", \"vent\": 2, \"tempAir\": 15.6, \"atmPress\": 1013, \"direction\": \"NE\"}, \"meteoMerDict\": {\"houle\": 1, \"etatMer\": \"belle\"}}, \"campagne\": {\"dateDict\": {\"day\": 12, \"date\": \"11/11/2024\", \"year\": 2024, \"month\": 8}, \"zoneDict\": {\"zone\": \"CC\", \"lieudit\": \"Illien\", \"campagne\": \"ATL\", \"protection\": \"Parc naturel marin d\'iroise\"}, \"deploiementDict\": {\"bateau\": \"Beneteau Capelan\", \"pilote\": \"Olivier F.\", \"equipage\": \"C.H., J.C.\", \"partenaires\": \"Ifremer RDT, Ifremer Halgo\"}}}'),
(3, 1, '2024-12-08', 'Bubbles.mp4', '4502617', 1, '{\"video\": {\"ctdDict\": {\"salinite\": \"\", \"profondeur\": 9.5, \"temperature\": 15.9}, \"gpsDict\": {\"site\": \"Brentec\'h\", \"latitude\": 47.85762, \"longitude\": -3.97411}, \"astroDict\": {\"lune\": \"PQ\", \"maree\": \"BM+1\", \"coefficient\": 74}, \"heureDict\": {\"heure\": 11, \"minute\": 26, \"seconde\": 37}, \"analyseDict\": {\"faune\": \"Mullidae, Gobidae\", \"habitat\": \"laminaires, sable\", \"visibilite\": \"\", \"exploitabilite\": \"\"}, \"codeStation\": \"K5_BR240024\", \"meteoAirDict\": {\"ciel\": \"soleil\", \"vent\": 2, \"tempAir\": 15.6, \"atmPress\": 1013, \"direction\": \"NE\"}, \"meteoMerDict\": {\"houle\": 1, \"etatMer\": \"belle\"}}, \"campagne\": {\"dateDict\": {\"day\": 12, \"date\": \"12/08/2024\", \"year\": 2024, \"month\": 8}, \"zoneDict\": {\"zone\": \"CC\", \"lieudit\": \"Illien\", \"campagne\": \"ATL\", \"protection\": \"Parc naturel marin d\'iroise\"}, \"deploiementDict\": {\"bateau\": \"Beneteau Capelan\", \"pilote\": \"Olivier F.\", \"equipage\": \"C.H., J.C.\", \"partenaires\": \"Ifremer RDT, Ifremer Halgo\"}}}');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `stationinfo`
--
ALTER TABLE `stationinfo`
  ADD CONSTRAINT `stationinfo_ibfk_1` FOREIGN KEY (`id_station`) REFERENCES `stations` (`id_station`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `stations`
--
ALTER TABLE `stations`
  ADD CONSTRAINT `stations_ibfk_1` FOREIGN KEY (`id_campagne`) REFERENCES `campagne` (`id_campagne`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `systemevents`
--
ALTER TABLE `systemevents`
  ADD CONSTRAINT `systemevents_ibfk_1` FOREIGN KEY (`id_video`) REFERENCES `videos` (`id_video`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `videos`
--
ALTER TABLE `videos`
  ADD CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `videos_ibfk_2` FOREIGN KEY (`id_station`) REFERENCES `stations` (`id_station`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
