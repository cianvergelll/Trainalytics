-- im_system.im_users definition

CREATE TABLE `im_users` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `IsDeleted` tinyint(1) DEFAULT 0,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `Extra1` varchar(255) DEFAULT NULL,
  `Extra2` varchar(255) DEFAULT NULL,
  `Extra3` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Username` (`Username`),
  KEY `idx_username` (`Username`),
  KEY `idx_is_deleted` (`IsDeleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- im_system.im_admin_users definition

CREATE TABLE `im_admin_users` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` enum('SuperAdmin','Coordinator','Staff') NOT NULL,
  `IsDeleted` tinyint(1) DEFAULT 0,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `Extra1` varchar(255) DEFAULT NULL,
  `Extra2` varchar(255) DEFAULT NULL,
  `Extra3` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Username` (`Username`),
  KEY `idx_username` (`Username`),
  KEY `idx_role` (`Role`),
  KEY `idx_is_deleted` (`IsDeleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- im_system.im_schools definition

CREATE TABLE `im_schools` (
  `schoolID` varchar(10) NOT NULL,
  `school_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`schoolID`),
  KEY `idx_school_name` (`school_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

