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

CREATE TABLE `im_sessions` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `user_type` enum('admin','student') NOT NULL,
  `session_token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ID`),
  UNIQUE KEY `session_token` (`session_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- im_system.im_cec_students definition

CREATE TABLE `im_cec_students` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `StudentName` varchar(100) NOT NULL,
  `SchoolID` varchar(10) NOT NULL,
  `DepartmentID` int(11) NOT NULL,
  `StudentID` varchar(50) NOT NULL,
  `BirthDate` date DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `ContactNumber` varchar(20) DEFAULT NULL,
  `CompanyName` varchar(100) DEFAULT NULL,
  `CompanyAddress` text DEFAULT NULL,
  `TargetHours` decimal(7,2) DEFAULT 0.00,
  `TotalHours` decimal(7,2) DEFAULT 0.00,
  `RemainingHours` decimal(7,2) DEFAULT 0.00,
  `HasMOA` tinyint(1) DEFAULT 0,
  `HasEndorsement` tinyint(1) DEFAULT 0,
  `HasWaiver` tinyint(1) DEFAULT 0,
  `HasCompletion` tinyint(1) DEFAULT 0,
  `HasEvaluation` tinyint(1) DEFAULT 0,
  `IsCompleted` tinyint(1) DEFAULT 0,
  `IsActive` tinyint(1) DEFAULT 1,
  `Extra1` varchar(255) DEFAULT NULL,
  `Extra2` varchar(255) DEFAULT NULL,
  `Extra3` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `unique_student_id` (`StudentID`),
  KEY `idx_student_name` (`StudentName`),
  KEY `idx_school` (`SchoolID`),
  KEY `idx_department` (`DepartmentID`),
  KEY `idx_email` (`Email`),
  KEY `idx_company` (`CompanyName`),
  KEY `idx_is_active` (`IsActive`),
  KEY `idx_is_completed` (`IsCompleted`),
  CONSTRAINT `im_cec_students_ibfk_1` FOREIGN KEY (`SchoolID`) REFERENCES `im_schools` (`schoolID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;