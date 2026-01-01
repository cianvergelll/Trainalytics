-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 01, 2026 at 03:26 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `im_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `im_admin_users`
--

CREATE TABLE `im_admin_users` (
  `ID` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` enum('SuperAdmin','Coordinator','Staff') NOT NULL,
  `IsDeleted` tinyint(1) DEFAULT 0,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `Extra1` varchar(255) DEFAULT NULL,
  `Extra2` varchar(255) DEFAULT NULL,
  `Extra3` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `im_admin_users`
--

INSERT INTO `im_admin_users` (`ID`, `Username`, `Password`, `Role`, `IsDeleted`, `CreatedAt`, `Extra1`, `Extra2`, `Extra3`) VALUES
(3, 'juvelyn', '$2b$10$13tmWRIUcKHziOIAxEFPCe/XPp.xL7rDdz3BzcOKVmZsdB9IFBg.W', 'SuperAdmin', 0, '2025-10-08 06:21:54', NULL, NULL, NULL),
(4, 'mariscal', '$2b$10$13tmWRIUcKHziOIAxEFPCe/XPp.xL7rDdz3BzcOKVmZsdB9IFBg.W', 'Coordinator', 0, '2025-10-08 06:21:54', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `im_cec_announcements`
--

CREATE TABLE `im_cec_announcements` (
  `ID` int(11) NOT NULL,
  `AdminID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` text NOT NULL,
  `AttachmentPath` varchar(255) DEFAULT NULL,
  `StartDate` datetime DEFAULT NULL,
  `EndDate` datetime DEFAULT NULL,
  `TargetAudience` enum('All','Department','Specific Student') NOT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Extra1` varchar(255) DEFAULT NULL,
  `Extra2` varchar(255) DEFAULT NULL,
  `Extra3` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `im_cec_announcements`
--

INSERT INTO `im_cec_announcements` (`ID`, `AdminID`, `Title`, `Description`, `AttachmentPath`, `StartDate`, `EndDate`, `TargetAudience`, `IsActive`, `CreatedAt`, `UpdatedAt`, `Extra1`, `Extra2`, `Extra3`) VALUES
(1, 1, 'Midterm Week Schedule', 'Heads up, everyone! Next week is midterms. Please check the attached file for the official schedule and room assignments. Good luck!', '/attachments/midterm-schedule-2025.pdf', '2025-11-03 08:00:00', '2025-11-07 17:00:00', 'All', 1, '2025-10-27 11:33:36', '2025-10-27 11:33:36', NULL, NULL, NULL),
(2, 1, 'OJT Orientation (BSIT Only)', 'Mandatory OJT orientation for all 4th-year BSIT students. This will be held at the AV Hall. Attendance is a must.', NULL, NULL, NULL, 'Department', 1, '2025-10-27 11:33:36', '2025-10-27 11:33:36', NULL, NULL, NULL),
(3, 1, 'Welcome (Start of Sem)', 'Welcome back to the new semester! We hope you had a great break.', NULL, '2025-08-01 08:00:00', '2025-08-08 17:00:00', 'All', 0, '2025-10-27 11:33:36', '2025-10-27 11:33:36', NULL, NULL, NULL),
(4, 1, 'Missing Document: Jane Doe', 'Jane Doe (Student ID 2021-1234), you are missing your Form 137. Please submit it to the registrar\'s office by Friday.', NULL, '2025-10-27 09:00:00', '2025-10-31 17:00:00', 'Specific Student', 1, '2025-10-27 11:33:36', '2025-10-27 11:33:36', NULL, NULL, NULL),
(5, 1, 'Regular Holiday: November 1', 'There will be no classes on November 1, 2025 (All Saints\' Day). Classes resume on November 2.', NULL, '2025-10-30 08:00:00', '2025-11-01 23:59:00', 'All', 1, '2025-10-27 11:33:36', '2025-10-27 11:33:36', NULL, NULL, NULL),
(6, 1, 'BSCpE Department Meeting', 'All Computer Engineering students are required to attend a meeting on Friday, 3 PM at the Engr. Bldg. Room 305.', NULL, '2025-10-27 13:00:00', '2025-10-31 15:00:00', 'Department', 1, '2025-10-27 11:33:36', '2025-10-27 11:33:36', NULL, NULL, NULL),
(7, 1, 'OJT Final Report Submission', 'Final OJT reports are due on December 5. Please use the attached template for your cover page and formatting.', '/attachments/ojt-report-template.docx', '2025-11-15 08:00:00', '2025-12-05 17:00:00', 'All', 1, '2025-10-27 11:33:36', '2025-10-27 11:33:36', NULL, NULL, NULL),
(8, 1, 'URGENT: All Classes Cancelled Today (Oct 28)', 'Due to Typhoon Rolly, all classes are cancelled today, October 28, 2025. Stay safe, everyone.', NULL, '2025-10-28 06:00:00', '2025-10-28 23:59:00', 'All', 1, '2025-10-27 11:33:36', '2025-10-27 11:33:36', NULL, NULL, NULL),
(9, 1, 'Incomplete Requirements: John Smith', 'John Smith (Student ID 2020-0012), your OJT waiver is incomplete. Please see Ms. Angela at the admin office.', NULL, NULL, NULL, 'Specific Student', 1, '2025-10-27 11:33:36', '2025-10-27 11:33:36', NULL, NULL, NULL),
(10, 1, 'Student Satisfaction Survey', 'We want to hear from you! Please take 5 minutes to complete the student satisfaction survey: [link to survey]', NULL, '2025-11-10 09:00:00', '2025-11-17 17:00:00', 'All', 1, '2025-10-27 11:33:36', '2025-10-27 11:33:36', NULL, NULL, NULL),
(11, 2, 'System Maintenance: Journals', 'The journal submission portal will be down for scheduled maintenance this Friday.', NULL, '2025-11-01 02:00:00', '2025-11-01 04:00:00', 'All', 1, '2025-10-27 12:01:00', '2025-10-27 12:01:00', NULL, NULL, NULL),
(12, 3, 'Welcome New Staff Member!', 'Please join us in welcoming our new coordinator, Mrs. Angela Diaz.', '/files/attachments/welcome_angela.png', '2025-10-30 08:00:00', '2025-11-05 17:00:00', 'All', 1, '2025-10-27 12:01:00', '2025-10-27 12:01:00', NULL, NULL, NULL),
(13, 1, 'Internship Fair: Tech Companies', 'A virtual internship fair for all IT and CS students will be held next week. Link to follow.', NULL, '2025-11-05 09:00:00', '2025-11-05 16:00:00', 'Department', 1, '2025-10-27 12:01:00', '2025-10-27 12:01:00', NULL, NULL, NULL),
(14, 2, 'Important: Profile Update Request', 'All students must update their contact information and company details in their profile by EOD Friday.', NULL, '2025-11-03 08:00:00', '2025-11-07 17:00:00', 'All', 1, '2025-10-27 12:01:00', '2025-10-27 12:01:00', NULL, NULL, NULL),
(15, 1, 'Specific Student Follow-up: ID 20-1001-001', 'Student ID 20-1001-001, please report to the office regarding your MOA.', NULL, '2025-11-04 09:00:00', '2025-11-05 17:00:00', 'Specific Student', 1, '2025-10-27 12:01:00', '2025-10-27 12:01:00', NULL, NULL, NULL),
(16, 3, 'Holiday Advisory: All Saints\' Day', 'The office will be closed on November 1st and 2nd in observance of All Saints\' Day.', '/files/attachments/holiday_memo.pdf', '2025-10-28 08:00:00', '2025-11-02 17:00:00', 'All', 1, '2025-10-27 12:01:00', '2025-10-27 12:01:00', NULL, NULL, NULL),
(17, 1, 'Department Meeting: Business Ad', 'All Business Administration interns are required to attend a mid-term evaluation meeting.', NULL, '2025-11-10 14:00:00', '2025-11-10 15:00:00', 'Department', 1, '2025-10-27 12:01:00', '2025-10-27 12:01:00', NULL, NULL, NULL),
(18, 2, 'Survey: Internship Experience', 'Please fill out the attached survey to provide feedback on your internship experience so far.', '/files/attachments/survey_link.txt', '2025-11-12 09:00:00', '2025-11-19 17:00:00', 'All', 1, '2025-10-27 12:01:00', '2025-10-27 12:01:00', NULL, NULL, NULL),
(19, 1, 'Reminder: Evaluation Forms Due', 'Coordinator Evaluation Forms are due by the end of this month. Please submit them on time.', NULL, '2025-11-15 08:00:00', '2025-11-30 17:00:00', 'All', 1, '2025-10-27 12:01:00', '2025-10-27 12:01:00', NULL, NULL, NULL),
(20, 3, 'Old Event (Archived): Q2 Town Hall', 'This was the town hall meeting from last quarter.', NULL, '2025-07-15 09:00:00', '2025-07-15 11:00:00', 'All', 0, '2025-10-27 12:01:00', '2025-10-27 12:01:00', NULL, NULL, NULL),
(21, 4, 'asdasd', 'asdasd', NULL, '2025-10-01 21:00:00', '2025-10-23 16:00:00', 'All', 1, '2025-10-27 12:03:53', '2025-10-27 12:03:53', NULL, NULL, NULL),
(22, 4, 'asdasd', 'asdasd', NULL, '2025-10-11 09:00:00', '2025-10-31 16:00:00', 'All', 1, '2025-10-28 04:03:34', '2025-10-28 04:03:34', NULL, NULL, NULL),
(23, 4, 'asdasd', 'asdasdasd', NULL, '2025-11-13 09:00:00', '2025-11-14 16:00:00', 'All', 1, '2025-11-12 02:41:25', '2025-11-12 02:41:25', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `im_cec_attendance`
--

CREATE TABLE `im_cec_attendance` (
  `ID` int(11) NOT NULL,
  `SchoolID` varchar(10) NOT NULL,
  `StudentID` varchar(50) NOT NULL,
  `DepartmentID` varchar(50) NOT NULL,
  `TimeIn` datetime NOT NULL,
  `TimeOut` datetime DEFAULT NULL,
  `HoursRendered` decimal(5,2) DEFAULT 0.00,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Extra1` varchar(255) DEFAULT NULL,
  `Extra2` varchar(255) DEFAULT NULL,
  `Extra3` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `im_cec_attendance`
--

INSERT INTO `im_cec_attendance` (`ID`, `SchoolID`, `StudentID`, `DepartmentID`, `TimeIn`, `TimeOut`, `HoursRendered`, `CreatedAt`, `UpdatedAt`, `Extra1`, `Extra2`, `Extra3`) VALUES
(1, 'CEC', '2024-0001', 'BSIT', '2025-10-27 08:00:00', '2025-10-27 17:00:00', 8.00, '2025-10-27 14:37:11', '2025-10-27 14:41:20', NULL, NULL, NULL),
(2, 'CEC', '2024-0002', 'BSIT', '2025-10-27 08:05:00', '2025-10-27 17:02:00', 8.00, '2025-10-27 14:37:11', '2025-10-27 14:45:22', NULL, NULL, NULL),
(3, 'CEC', '2024-0003', 'BSIT', '2025-10-27 07:55:00', '2025-10-27 16:58:00', 8.00, '2025-10-27 14:37:11', '2025-10-27 14:45:22', NULL, NULL, NULL),
(4, 'CEC', '2024-0004', 'BSIT', '2025-10-27 08:15:00', '2025-10-27 17:05:00', 7.75, '2025-10-27 14:37:11', '2025-10-27 14:45:22', NULL, NULL, NULL),
(5, 'CEC', '2024-0005', 'BSIT', '2025-10-27 09:00:00', '2025-10-27 17:00:00', 7.00, '2025-10-27 14:37:11', '2025-10-27 14:45:22', NULL, NULL, NULL),
(6, 'CEC', '2024-0006', 'BSIT', '2025-10-27 08:30:00', '2025-10-27 12:30:00', 4.00, '2025-10-27 14:37:11', '2025-10-27 14:45:22', NULL, NULL, NULL),
(7, 'CEC', '2024-0007', 'BSIT', '2025-10-27 07:58:00', '2025-10-27 17:01:00', 8.00, '2025-10-27 14:37:11', '2025-10-27 14:45:22', NULL, NULL, NULL),
(8, 'CEC', '2024-0008', 'BSIT', '2025-10-26 08:00:00', '2025-10-26 17:00:00', 8.00, '2025-10-27 14:37:11', '2025-10-27 14:45:22', NULL, NULL, NULL),
(9, 'CEC', '2024-0009', 'BSIT', '2025-10-26 08:02:00', '2025-10-26 16:00:00', 7.00, '2025-10-27 14:37:11', '2025-10-27 14:45:22', NULL, NULL, NULL),
(10, 'CEC', '2024-0010', 'BSIT', '2025-10-26 09:00:00', '2025-10-26 17:00:00', 7.00, '2025-10-27 14:37:11', '2025-10-27 14:45:22', NULL, NULL, NULL),
(11, 'CEC', '2024-0011', 'BSIT', '2025-10-26 08:00:00', '2025-10-26 12:00:00', 4.00, '2025-10-27 14:37:11', '2025-10-27 14:46:07', NULL, NULL, NULL),
(12, 'CEC', '2024-0012', 'BSIT', '2025-10-26 13:00:00', '2025-10-26 17:00:00', 4.00, '2025-10-27 14:37:11', '2025-10-27 14:46:07', NULL, NULL, NULL),
(13, 'CEC', '2024-0013', 'BSIT', '2025-10-25 08:00:00', '2025-10-25 17:00:00', 8.00, '2025-10-27 14:37:11', '2025-10-27 14:46:07', NULL, NULL, NULL),
(14, 'CEC', '2024-0014', 'BSIT', '2025-10-25 07:50:00', '2025-10-25 16:50:00', 8.00, '2025-10-27 14:37:11', '2025-10-27 14:46:07', NULL, NULL, NULL),
(15, 'CEC', '2024-0015', 'BSIT', '2025-10-25 08:00:00', '2025-10-25 17:00:00', 8.00, '2025-10-27 14:37:11', '2025-10-27 14:46:07', NULL, NULL, NULL),
(16, 'CEC', '2024-0016', 'BSIT', '2025-10-24 09:00:00', '2025-10-24 17:00:00', 7.00, '2025-10-27 14:37:11', '2025-10-27 14:46:07', NULL, NULL, NULL),
(17, 'CEC', '2024-0017', 'BSIT', '2025-10-24 08:00:00', '2025-10-24 17:00:00', 8.00, '2025-10-27 14:37:11', '2025-10-27 14:46:07', NULL, NULL, NULL),
(18, 'CEC', '2024-0018', 'BSIT', '2025-10-24 08:00:00', '2025-10-24 17:00:00', 8.00, '2025-10-27 14:37:11', '2025-10-27 14:46:07', NULL, NULL, NULL),
(19, 'CEC', '2024-0019', 'BSIT', '2025-10-23 08:00:00', '2025-10-23 17:00:00', 8.00, '2025-10-27 14:37:11', '2025-10-27 14:46:07', NULL, NULL, NULL),
(20, 'CEC', '2024-0020', 'BSIT', '2025-10-23 08:00:00', '2025-10-23 12:00:00', 4.00, '2025-10-27 14:37:11', '2025-10-27 14:46:07', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `im_cec_complaints`
--

CREATE TABLE `im_cec_complaints` (
  `ID` int(11) NOT NULL,
  `StudentID` varchar(50) NOT NULL,
  `SchoolID` varchar(10) NOT NULL,
  `DepartmentID` varchar(50) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Date` date NOT NULL,
  `Status` enum('resolved','pending','urgent') NOT NULL DEFAULT 'pending',
  `Description` text NOT NULL,
  `AttachmentPath` varchar(255) DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Extra1` varchar(255) DEFAULT NULL,
  `Extra2` varchar(255) DEFAULT NULL,
  `Extra3` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `im_cec_complaints`
--

INSERT INTO `im_cec_complaints` (`ID`, `StudentID`, `SchoolID`, `DepartmentID`, `Title`, `Date`, `Status`, `Description`, `AttachmentPath`, `CreatedAt`, `UpdatedAt`, `Extra1`, `Extra2`, `Extra3`) VALUES
(1, '2024-0001', 'CEC', 'BSIT', 'Issue with Supervisor Communication', '2025-10-20', 'pending', 'I am having trouble getting clear instructions from my supervisor. Often the tasks assigned are vague and require multiple clarifications, slowing down my progress.', NULL, '2025-10-27 15:22:42', '2025-10-27 15:22:42', NULL, NULL, NULL),
(2, '2024-0002', 'CEC', 'BSIT', 'Workstation Performance Issues', '2025-10-21', 'pending', 'The computer provided for my internship is very slow and frequently freezes, especially when running development tools. This impacts my productivity.', '/files/complaints/workstation_specs.txt', '2025-10-27 15:22:42', '2025-10-27 15:22:42', NULL, NULL, NULL),
(3, '2024-0003', 'CEC', 'BSIT', 'Unclear Task Assignment', '2025-10-22', 'urgent', 'I was assigned a task (\"Refactor Module X\") with no context or expected outcome. I need more details to proceed.', NULL, '2025-10-27 15:22:42', '2025-10-27 15:22:42', NULL, NULL, NULL),
(4, '2024-0004', 'CEC', 'BSIT', 'Hours Log Discrepancy', '2025-10-23', 'resolved', 'My logged hours for last week show 38 instead of 40. I worked the full 40 hours. Update: Supervisor reviewed and approved the correction.', '/files/complaints/timesheet_oct13-17.pdf', '2025-10-27 15:22:42', '2025-10-27 15:22:42', NULL, NULL, NULL),
(5, '2024-0005', 'CEC', 'BSIT', 'Lack of Mentorship', '2025-10-24', 'pending', 'While my supervisor assigns tasks, I feel I lack dedicated mentorship time to ask questions and learn more deeply about the technologies being used.', NULL, '2025-10-27 15:22:42', '2025-10-27 15:22:42', NULL, NULL, NULL),
(6, '2024-0006', 'CEC', 'BSIT', 'Access Required for Tool', '2025-10-25', 'resolved', 'I need access to the company\'s Jira board to track my assigned tasks. Update: IT granted access.', NULL, '2025-10-27 15:22:42', '2025-10-27 15:22:42', NULL, NULL, NULL),
(7, '2024-0007', 'CEC', 'BSIT', 'Feedback on Submitted Work', '2025-10-26', 'pending', 'I submitted my report on the database optimization task last week but haven\'t received any feedback yet.', NULL, '2025-10-27 15:22:42', '2025-10-27 15:22:42', NULL, NULL, NULL),
(8, '2024-0008', 'CEC', 'BSIT', 'Office Environment Too Noisy', '2025-10-27', 'pending', 'The open office plan makes it difficult to concentrate due to constant noise and distractions.', NULL, '2025-10-27 15:22:42', '2025-10-27 15:22:42', NULL, NULL, NULL),
(9, '2024-0009', 'CEC', 'BSIT', 'Request for More Challenging Tasks', '2025-10-27', 'pending', 'The tasks I\'ve been assigned so far feel below my skill level. I would appreciate opportunities to work on more complex problems.', NULL, '2025-10-27 15:22:42', '2025-10-27 15:22:42', NULL, NULL, NULL),
(10, '2024-0010', 'CEC', 'BSIT', 'Software License Needed', '2025-10-27', 'urgent', 'To complete my current task, I need a license for the data visualization software the team uses (e.g., Tableau).', NULL, '2025-10-27 15:22:42', '2025-10-27 15:22:42', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `im_cec_journal`
--

CREATE TABLE `im_cec_journal` (
  `ID` int(11) NOT NULL,
  `StudentID` varchar(50) NOT NULL,
  `SchoolID` varchar(10) NOT NULL,
  `DepartmentID` varchar(50) NOT NULL,
  `Date` date NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` text NOT NULL,
  `Attachment` varchar(255) DEFAULT NULL,
  `Status` enum('approved','pending','denied') NOT NULL DEFAULT 'pending',
  `DateApproved` datetime DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Extra1` varchar(255) DEFAULT NULL,
  `Extra2` varchar(255) DEFAULT NULL,
  `Extra3` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `im_cec_journal`
--

INSERT INTO `im_cec_journal` (`ID`, `StudentID`, `SchoolID`, `DepartmentID`, `Date`, `Title`, `Description`, `Attachment`, `Status`, `DateApproved`, `CreatedAt`, `UpdatedAt`, `Extra1`, `Extra2`, `Extra3`) VALUES
(1, '2024-0001', 'CEC', 'BSIT', '2025-10-27', 'Week 12 - Final Presentation Prep', 'Started drafting the slides for my final presentation. Focused on key achievements and challenges. Got feedback from my supervisor on the outline.', NULL, 'pending', NULL, '2025-10-27 14:12:21', '2025-10-27 14:46:41', NULL, NULL, NULL),
(2, '2024-0002', 'CEC', 'BSIT', '2025-10-24', 'Week 11 - Client Meeting', 'Attended a meeting with a client to discuss project requirements. Took minutes and summarized action items for the team.', '/files/journals/meeting_minutes.pdf', 'approved', '2025-10-25 09:15:00', '2025-10-27 14:12:21', '2025-10-27 14:46:55', NULL, NULL, NULL),
(3, '2024-0003', 'CEC', 'BSIT', '2025-10-23', 'Week 11 - Debugging Session', 'Spent the day debugging the user authentication module. Found and fixed a critical bug related to session handling.', NULL, 'approved', '2025-10-24 10:00:00', '2025-10-27 14:12:21', '2025-10-27 14:47:00', NULL, NULL, NULL),
(4, '2024-0004', 'CEC', 'BSIT', '2025-10-22', 'Week 11 - Code Review', 'Participated in a code review for a senior developer\'s feature. Learned a lot about best practices in our codebase.', NULL, 'approved', '2025-10-24 10:00:00', '2025-10-27 14:12:21', '2025-10-27 15:05:58', NULL, NULL, NULL),
(5, '2024-0005', 'CEC', 'BSIT', '2025-10-21', 'Week 11 - New Feature Kick-off', 'Started work on a new feature: user profile settings. Wrote the initial API endpoints.', NULL, 'denied', NULL, '2025-10-27 14:12:21', '2025-10-27 15:05:58', NULL, NULL, NULL),
(6, '2024-0006', 'CEC', 'BSIT', '2025-10-27', 'Final Report Writing', 'Began compiling all my weekly reports into the final internship report. Also updated my task board.', NULL, 'pending', NULL, '2025-10-27 14:12:21', '2025-10-27 15:05:58', NULL, NULL, NULL),
(7, '2024-0007', 'CEC', 'BSIT', '2025-10-24', 'Database Optimization Task', 'My supervisor tasked me with analyzing slow queries. I used EXPLAIN ANALYZE to identify a missing index and proposed a solution.', '/files/journals/query_analysis.sql', 'approved', '2025-10-26 11:30:00', '2025-10-27 14:12:21', '2025-10-27 15:05:58', NULL, NULL, NULL),
(8, '2024-0008', 'CEC', 'BSIT', '2025-10-23', 'Frontend Unit Testing', 'Wrote unit tests for the new dashboard components using Jest and React Testing Library.', NULL, 'approved', '2025-10-26 11:30:00', '2025-10-27 14:12:21', '2025-10-27 15:05:58', NULL, NULL, NULL),
(9, '2024-0009', 'CEC', 'BSIT', '2025-10-22', 'Team Sprint Planning', 'Attended the bi-weekly sprint planning meeting. Was assigned two tasks for the upcoming sprint.', NULL, 'approved', '2025-10-26 11:30:00', '2025-10-27 14:12:21', '2025-10-27 15:05:58', NULL, NULL, NULL),
(10, '2024-0010', 'CEC', 'BSIT', '2025-10-27', 'Onboarding Day 1', 'Completed HR onboarding and system setup. Met my mentor and the rest of the development team.', NULL, 'pending', NULL, '2025-10-27 14:12:21', '2025-10-27 15:05:58', NULL, NULL, NULL),
(11, '2024-0020', 'CEC', 'BSIT', '2025-10-20', 'Week 10 - Research Task', 'Researched three different charting libraries for the new analytics dashboard. Presented my findings to the team.', '/files/journals/chart_libs.pdf', 'approved', '2025-10-21 14:22:00', '2025-10-27 14:12:21', '2025-10-27 15:06:43', NULL, NULL, NULL),
(12, '2024-0011', 'CEC', 'BSIT', '2025-10-17', 'Week 9 - API Documentation', 'Updated the API documentation using Swagger/OpenAPI for the new endpoints I created last week.', NULL, 'approved', '2025-10-18 10:00:00', '2025-10-27 14:12:21', '2025-10-27 15:06:43', NULL, NULL, NULL),
(13, '2024-0012', 'CEC', 'BSIT', '2025-10-16', 'Week 9 - System Design Meeting', 'Sat in on a system design meeting for a new microservice. Learned about trade-offs in distributed systems.', NULL, 'denied', NULL, '2025-10-27 14:12:21', '2025-10-27 15:06:43', NULL, NULL, NULL),
(14, '2024-0013', 'CEC', 'BSIT', '2025-10-15', 'Week 9 - Refactoring CSS', 'Refactored legacy CSS files into Tailwind CSS for the main landing page.', NULL, 'approved', '2025-10-18 10:00:00', '2025-10-27 14:12:21', '2025-10-27 15:06:43', NULL, NULL, NULL),
(15, '2024-0014', 'CEC', 'BSIT', '2025-10-27', 'First Journal Entry', 'This is my first journal entry. I am still learning the system.', NULL, 'pending', NULL, '2025-10-27 14:12:21', '2025-10-27 15:06:43', NULL, NULL, NULL),
(16, '2024-0015', 'CEC', 'BSIT', '2025-10-20', 'Finalizing User Flow', 'Worked with the UX designer to finalize the user flow for the password reset feature. Created a diagram.', '/files/journals/user_flow.png', 'approved', '2025-10-22 16:05:00', '2025-10-27 14:12:21', '2025-10-27 15:06:43', NULL, NULL, NULL),
(17, '2024-0016', 'CEC', 'BSIT', '2025-10-17', 'Error Handling Implementation', 'Implemented global error handling for the backend API. All errors are now logged to a central service.', NULL, 'approved', '2025-10-22 16:05:00', '2025-10-27 14:12:21', '2025-10-27 15:06:43', NULL, NULL, NULL),
(18, '2024-0017', 'CEC', 'BSIT', '2025-10-16', 'Learning Docker', 'My mentor walked me through the project\'s Docker setup. Learned how to build and run containers locally.', NULL, 'approved', '2025-10-22 16:05:00', '2025-10-27 14:12:21', '2025-10-27 15:06:43', NULL, NULL, NULL),
(19, '2024-0018', 'CEC', 'BSIT', '2025-10-20', 'Week 11 - Planning', 'Planned my tasks for the week. My main focus is on the new feature and preparing for the code review.', NULL, 'approved', '2025-10-24 10:00:00', '2025-10-27 14:12:21', '2025-10-27 15:06:43', NULL, NULL, NULL),
(20, '2024-0019', 'CEC', 'BSIT', '2025-10-21', 'Fixing CI/CD Pipeline', 'The build was failing. Investigated the CI/CD pipeline and found a script error in the build step. Fixed it.', NULL, 'approved', '2025-10-26 11:30:00', '2025-10-27 14:12:21', '2025-10-27 15:06:43', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `im_cec_notifications`
--

CREATE TABLE `im_cec_notifications` (
  `ID` int(11) NOT NULL,
  `StudentID` varchar(50) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Message` text NOT NULL,
  `IsRead` tinyint(1) DEFAULT 0,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `Extra1` varchar(255) DEFAULT NULL,
  `Extra2` varchar(255) DEFAULT NULL,
  `Extra3` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `im_cec_students`
--

CREATE TABLE `im_cec_students` (
  `ID` int(11) NOT NULL,
  `StudentName` varchar(100) NOT NULL,
  `SchoolID` varchar(10) NOT NULL,
  `DepartmentID` varchar(50) NOT NULL,
  `StudentID` varchar(50) NOT NULL,
  `Section` varchar(50) DEFAULT NULL,
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
  `IsArchived` tinyint(1) DEFAULT 0,
  `Extra2` varchar(255) DEFAULT NULL,
  `Extra3` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `im_cec_students`
--

INSERT INTO `im_cec_students` (`ID`, `StudentName`, `SchoolID`, `DepartmentID`, `StudentID`, `Section`, `BirthDate`, `Email`, `ContactNumber`, `CompanyName`, `CompanyAddress`, `TargetHours`, `TotalHours`, `RemainingHours`, `HasMOA`, `HasEndorsement`, `HasWaiver`, `HasCompletion`, `HasEvaluation`, `IsCompleted`, `IsActive`, `IsArchived`, `Extra2`, `Extra3`) VALUES
(9, 'Maria Dela Cruz', 'CEC', 'BSIT', '2024-0001', '3', '2003-05-15', 'maria.delacruz@email.com', '09171234567', 'Innovate Solutions Cebu', 'Cebu IT Park, Cebu City', 600.00, 600.00, 0.00, 1, 1, 1, 1, 1, 1, 0, NULL, NULL, NULL),
(10, 'Juan Santos', 'CEC', 'BSIT', '2024-0002', '2', '2003-08-22', 'juan.santos@email.com', '09287654321', 'TechGenius PH', 'Mandaue City, Cebu', 600.00, 320.50, 279.50, 1, 1, 1, 0, 0, 0, 1, NULL, NULL, NULL),
(11, 'Katrina Reyes', 'CEC', 'BSIT', '2024-0003', '1', '2003-02-10', 'katrina.reyes@email.com', '09391112233', 'CodeCrafters Inc.', 'Cebu Business Park, Cebu City', 480.00, 150.00, 330.00, 1, 1, 0, 0, 0, 0, 1, NULL, NULL, NULL),
(12, 'Miguel Tan', 'CEC', 'BSIT', '2024-0004', '3', '2003-11-30', 'miguel.tan@email.com', '09454445566', 'DataDriven Dynamics', 'Cebu IT Park, Cebu City', 600.00, 580.00, 20.00, 1, 1, 1, 0, 0, 0, 1, NULL, NULL, NULL),
(13, 'Sofia Garcia', 'CEC', 'BSIT', '2024-0005', '1', '2004-01-25', 'sofia.garcia@email.com', '09187778899', 'NextStep Logic', 'Mandaue City, Cebu', 300.00, 300.00, 0.00, 1, 1, 1, 1, 1, 1, 0, NULL, NULL, NULL),
(14, 'Angelo Lim', 'CEC', 'BSIT', '2024-0006', '2', '2003-07-19', 'angelo.lim@email.com', '09279990011', 'Sykes Asia Inc.', 'Mabolo, Cebu City', 600.00, 0.00, 600.00, 1, 0, 0, 0, 0, 0, 1, NULL, NULL, NULL),
(15, 'Isabella Ocampo', 'CEC', 'BSIT', '2024-0007', '4', '2003-09-05', 'isabella.ocampo@email.com', '09381122334', 'Accenture Inc.', 'Cebu IT Park, Cebu City', 480.00, 480.00, 0.00, 1, 1, 1, 1, 1, 1, 0, NULL, NULL, NULL),
(16, 'David Villanueva', 'CEC', 'BSIT', '2024-0008', '5', '2003-04-12', 'david.v@email.com', '09485566778', 'TechGenius PH', 'Mandaue City, Cebu', 600.00, 450.00, 150.00, 1, 1, 1, 0, 0, 0, 1, NULL, NULL, NULL),
(17, 'Chloe Bautista', 'CEC', 'BSIT', '2024-0009', '4', '2004-03-08', 'chloe.bautista@email.com', '09173344556', 'CodeCrafters Inc.', 'Cebu Business Park, Cebu City', 300.00, 80.00, 220.00, 1, 1, 0, 0, 0, 0, 1, NULL, NULL, NULL),
(18, 'Nathaniel Go', 'CEC', 'BSIT', '2024-0010', '6', '2003-12-28', 'nathaniel.go@email.com', '09297788990', 'Innovate Solutions Cebu', 'Cebu IT Park, Cebu City', 480.00, 240.00, 240.00, 1, 1, 1, 0, 0, 0, 1, NULL, NULL, NULL),
(19, 'Liam Mercado', 'CEC', 'BSIT', '2024-0011', '1', '2004-06-10', 'liam.mercado@email.com', '09172233445', 'Cebu Digital Solutions', 'Cebu Business Park, Cebu City', 480.00, 480.00, 0.00, 1, 1, 1, 1, 1, 1, 0, NULL, NULL, NULL),
(20, 'Olivia Pascual', 'CEC', 'BSIT', '2024-0012', '1', '2004-07-15', 'olivia.pascual@email.com', '09283344556', 'Axis Software Dev', 'Cebu IT Park, Cebu City', 480.00, 120.50, 359.50, 1, 1, 0, 0, 0, 0, 1, NULL, NULL, NULL),
(21, 'Noah Aguilar', 'CEC', 'BSIT', '2024-0013', '2', '2004-08-20', 'noah.aguilar@email.com', '09394455667', 'TideTech Global', 'Mandaue City, Cebu', 600.00, 300.00, 300.00, 1, 1, 1, 0, 0, 0, 1, NULL, NULL, NULL),
(22, 'Emma Salvador', 'CEC', 'BSIT', '2024-0014', '2', '2004-09-25', 'emma.salvador@email.com', '09455566778', 'Cebu Digital Solutions', 'Cebu Business Park, Cebu City', 600.00, 600.00, 0.00, 1, 1, 1, 1, 1, 1, 0, NULL, NULL, NULL),
(23, 'Lucas Ignacio', 'CEC', 'BSIT', '2024-0015', '3', '2004-10-18', 'lucas.ignacio@email.com', '09186677889', 'Axis Software Dev', 'Cebu IT Park, Cebu City', 480.00, 240.00, 240.00, 1, 1, 1, 0, 0, 0, 1, NULL, NULL, NULL),
(24, 'Ava Mendoza', 'CEC', 'BSIT', '2024-0016', '3', '2004-11-12', 'ava.mendoza@email.com', '09277788990', 'TideTech Global', 'Mandaue City, Cebu', 480.00, 400.00, 80.00, 1, 1, 1, 0, 0, 0, 1, NULL, NULL, NULL),
(25, 'Mateo Francisco', 'CEC', 'BSIT', '2024-0017', '4', '2003-01-05', 'mateo.f@email.com', '09388899001', 'Cebu Digital Solutions', 'Cebu Business Park, Cebu City', 600.00, 550.00, 50.00, 1, 1, 1, 0, 0, 0, 1, NULL, NULL, NULL),
(26, 'Mia Legaspi', 'CEC', 'BSIT', '2024-0018', '4', '2003-03-14', 'mia.legaspi@email.com', '09489900112', 'Axis Software Dev', 'Cebu IT Park, Cebu City', 600.00, 600.00, 0.00, 1, 1, 1, 1, 1, 1, 0, NULL, NULL, NULL),
(27, 'Elijah Tolentino', 'CEC', 'BSIT', '2024-0019', '5', '2004-02-09', 'elijah.t@email.com', '09171122334', 'TideTech Global', 'Mandaue City, Cebu', 480.00, 100.00, 380.00, 1, 1, 0, 0, 0, 0, 1, NULL, NULL, NULL),
(28, 'Sophia Andres', 'CEC', 'BSIT', '2024-0020', '6', '2003-06-21', 'sophia.andres@email.com', '09292233445', 'Cebu Digital Solutions', 'Cebu Business Park, Cebu City', 300.00, 0.00, 300.00, 1, 0, 0, 0, 0, 0, 1, NULL, NULL, NULL),
(118, 'Liam Mercado', 'CEC', 'BSIT', '2024-0051', '1', '2004-06-10', 'liam.mercado@email.com', '09172233445', 'Cebu Digital Solutions', 'Cebu Business Park, Cebu City', 480.00, 480.00, 0.00, 1, 1, 1, 1, 1, 1, 0, NULL, NULL, NULL),
(119, 'Olivia Pascual', 'CEC', 'BSIT', '2024-0052', '1', '2004-07-15', 'olivia.pascual@email.com', '09283344556', 'Axis Software Dev', 'Cebu IT Park, Cebu City', 480.00, 120.50, 359.50, 1, 1, 0, 0, 0, 0, 1, NULL, NULL, NULL),
(120, 'Noah Aguilar', 'CEC', 'BSIT', '2024-0053', '2', '2004-08-20', 'noah.aguilar@email.com', '09394455667', 'TideTech Global', 'Mandaue City, Cebu', 600.00, 300.00, 300.00, 1, 1, 1, 0, 0, 0, 1, NULL, NULL, NULL),
(121, 'Emma Salvador', 'CEC', 'BSIT', '2024-0054', '2', '2004-09-25', 'emma.salvador@email.com', '09455566778', 'Cebu Digital Solutions', 'Cebu Business Park, Cebu City', 600.00, 600.00, 0.00, 1, 1, 1, 1, 1, 1, 0, NULL, NULL, NULL),
(122, 'Lucas Ignacio', 'CEC', 'BSIT', '2024-0045', '3', '2004-10-18', 'lucas.ignacio@email.com', '09186677889', 'Axis Software Dev', 'Cebu IT Park, Cebu City', 480.00, 240.00, 240.00, 1, 1, 1, 0, 0, 0, 1, NULL, NULL, NULL),
(123, 'Ava Mendoza', 'CEC', 'BSIT', '2024-0046', '3', '2004-11-12', 'ava.mendoza@email.com', '09277788990', 'TideTech Global', 'Mandaue City, Cebu', 480.00, 400.00, 80.00, 1, 1, 1, 0, 0, 0, 1, NULL, NULL, NULL),
(124, 'Mateo Francisco', 'CEC', 'BSIT', '2024-0057', '4', '2003-01-05', 'mateo.f@email.com', '09388899001', 'Cebu Digital Solutions', 'Cebu Business Park, Cebu City', 600.00, 550.00, 50.00, 1, 1, 1, 0, 0, 0, 1, NULL, NULL, NULL),
(125, 'Mia Legaspi', 'CEC', 'BSIT', '2024-0058', '4', '2003-03-14', 'mia.legaspi@email.com', '09489900112', 'Axis Software Dev', 'Cebu IT Park, Cebu City', 600.00, 600.00, 0.00, 1, 1, 1, 1, 1, 1, 0, NULL, NULL, NULL),
(126, 'Elijah Tolentino', 'CEC', 'BSIT', '2024-0059', '5', '2004-02-09', 'elijah.t@email.com', '09171122334', 'TideTech Global', 'Mandaue City, Cebu', 480.00, 100.00, 380.00, 1, 1, 0, 0, 0, 0, 1, NULL, NULL, NULL),
(127, 'Sophia Andres', 'CEC', 'BSIT', '2024-0030', '3', '2003-06-21', 'sophia.andres@email.com', '09292233445', 'Cebu Digital Solutions', 'Cebu Business Park, Cebu City', 300.00, 0.00, 300.00, 1, 0, 0, 0, 0, 0, 1, NULL, NULL, NULL),
(128, 'Jameson Yap', 'CEC', 'BSIT', '2024-0031', '3', '2004-04-18', 'jameson.yap@email.com', '09174455667', 'Nexus Innovations', 'Cebu IT Park, Cebu City', 600.00, 600.00, 0.00, 1, 1, 1, 1, 1, 1, 0, NULL, NULL, NULL),
(129, 'Gabriella Uy', 'CEC', 'BSIT', '2024-0032', '3', '2005-01-20', 'gabriella.uy@email.com', '09285566778', 'Apex Digital', 'Mandaue City, Cebu', 480.00, 240.00, 240.00, 1, 1, 1, 0, 0, 0, 1, NULL, NULL, NULL),
(130, 'Zachary Go', 'CEC', 'BSIT', '2024-0033', '4', '2003-08-11', 'zachary.go@email.com', '09396677889', 'Quantum Tech', 'Cebu Business Park, Cebu City', 600.00, 150.75, 449.25, 1, 1, 0, 0, 0, 0, 1, NULL, NULL, NULL),
(131, 'Penelope Chua', 'CEC', 'BSIT', '2024-0034', '4', '2004-10-02', 'penelope.chua@email.com', '09457788990', 'Striveworks', 'Mabolo, Cebu City', 300.00, 300.00, 0.00, 1, 1, 1, 1, 1, 1, 0, NULL, NULL, NULL),
(132, 'Leo Castillo', 'CEC', 'BSIT', '2024-0035', '4', '2005-03-29', 'leo.castillo@email.com', '09188899001', 'Cebu Digital Solutions', 'Cebu Business Park, Cebu City', 480.00, 50.00, 430.00, 1, 0, 0, 0, 0, 1, 1, NULL, NULL, NULL),
(133, 'Stella Aquino', 'CEC', 'BSIT', '2024-0036', '4', '2003-06-17', 'stella.aquino@email.com', '09279900112', 'Axis Software Dev', 'Cebu IT Park, Cebu City', 600.00, 600.00, 0.00, 1, 1, 1, 1, 1, 1, 0, NULL, NULL, NULL),
(134, 'Caleb Torres', 'CEC', 'BSIT', '2024-0037', '5', '2004-05-19', 'caleb.t@email.com', '09381122335', 'Nexus Innovations', 'Cebu IT Park, Cebu City', 480.00, 480.00, 0.00, 1, 1, 1, 1, 1, 1, 0, NULL, NULL, NULL),
(135, 'Zoe Sarmiento', 'CEC', 'BSIT', '2024-0038', '5', '2004-08-01', 'zoe.s@email.com', '09485566779', 'Quantum Tech', 'Cebu Business Park, Cebu City', 600.00, 200.00, 400.00, 1, 1, 1, 0, 0, 0, 1, NULL, NULL, NULL),
(136, 'Adrian Fernandez', 'CEC', 'BSIT', '2024-0039', '5', '2003-12-03', 'adrian.f@email.com', '09173344557', 'Apex Digital', 'Mandaue City, Cebu', 600.00, 100.00, 500.00, 1, 1, 0, 0, 0, 0, 1, NULL, NULL, NULL),
(137, 'Lily Ang', 'CEC', 'BSIT', '2024-0040', '5', '2004-01-16', 'lily.ang@email.com', '09297788991', 'Striveworks', 'Mabolo, Cebu City', 300.00, 300.00, 0.00, 1, 1, 1, 1, 1, 1, 0, NULL, NULL, NULL),
(138, 'Daniel Ramos', 'CEC', 'BSIT', '2024-0041', '6', '2003-10-21', 'daniel.r@email.com', '09172233446', 'Nexus Innovations', 'Cebu IT Park, Cebu City', 480.00, 480.00, 0.00, 1, 1, 1, 1, 1, 1, 0, NULL, NULL, NULL),
(139, 'Grace Domingo', 'CEC', 'BSIT', '2024-0042', '6', '2004-12-25', 'grace.d@email.com', '09283344557', 'Apex Digital', 'Mandaue City, Cebu', 600.00, 50.00, 550.00, 1, 1, 0, 0, 0, 0, 1, NULL, NULL, NULL),
(140, 'Julian Castro', 'CEC', 'BSIT', '2024-0043', '6', '2003-02-14', 'julian.c@email.com', '09394455668', 'Quantum Tech', 'Cebu Business Park, Cebu City', 480.00, 240.00, 240.00, 1, 1, 1, 0, 0, 0, 1, NULL, NULL, NULL),
(141, 'Ian Vergel Canete', 'CEC', '1', '22120205', '4', NULL, 'cianvergel@gmail.com', '09997360283', NULL, NULL, 0.00, 0.00, 0.00, 0, 0, 0, 0, 0, 0, 1, NULL, NULL, NULL),
(142, 'sadasd asadasd', 'CEC', '1', 'asdasd', '5', NULL, 'cianvergel@gmail.com', '09997360283', NULL, NULL, 0.00, 0.00, 0.00, 0, 0, 0, 0, 0, 0, 1, NULL, NULL, NULL),
(180, 'Arcee Canete', 'CEC', '1', '1231232342341234', '6', NULL, 'cianvergel@gmail.com', '09997360283', NULL, NULL, 0.00, 0.00, 0.00, 0, 0, 0, 0, 0, 0, 1, NULL, NULL, NULL),
(181, 'Arcee Canete', 'CEC', '1', '12312323423412341231231', '6', NULL, 'cianvergel@gmail.com', '09997360283', NULL, NULL, 0.00, 0.00, 0.00, 0, 0, 0, 0, 0, 0, 1, NULL, NULL, NULL),
(183, 'Arcee Canete', 'CEC', '1', '1231232342341234123123178978978', '6', NULL, 'cianvergel@gmail.com', '09997360283', NULL, NULL, 0.00, 0.00, 0.00, 0, 0, 0, 0, 0, 0, 1, NULL, NULL, NULL),
(184, 'Virgilio Jr. Cañete', 'CEC', '1', '12371231238890890', '6', NULL, 'virgilio@gmail.com', '09394547038', NULL, NULL, 0.00, 0.00, 0.00, 0, 0, 0, 0, 0, 0, 1, NULL, NULL, NULL),
(185, 'Vicenta Cañete', 'CEC', '1', '12371231238890890123123', '5', NULL, 'vicenta@gmail.com', '09173652992', NULL, NULL, 0.00, 0.00, 0.00, 0, 0, 0, 0, 0, 0, 1, NULL, NULL, NULL),
(186, 'Angela Larisma', 'CEC', '1', '0999956982', '6', NULL, 'Angela@gmail.com', '09173652992', NULL, NULL, 0.00, 0.00, 0.00, 0, 0, 0, 0, 0, 0, 1, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `im_schools`
--

CREATE TABLE `im_schools` (
  `schoolID` varchar(10) NOT NULL,
  `school_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `im_schools`
--

INSERT INTO `im_schools` (`schoolID`, `school_name`, `created_at`, `updated_at`) VALUES
('CEC', 'Cebu Eastern College', '2025-10-06 09:00:40', '2025-10-06 09:00:40');

-- --------------------------------------------------------

--
-- Table structure for table `im_sessions`
--

CREATE TABLE `im_sessions` (
  `ID` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_type` enum('admin','student') NOT NULL,
  `session_token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `im_sessions`
--

INSERT INTO `im_sessions` (`ID`, `user_id`, `user_type`, `session_token`, `expires_at`, `created_at`) VALUES
(96, 4, 'admin', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicm9sZSI6IkNvb3JkaW5hdG9yIiwidXNlcm5hbWUiOiJtYXJpc2NhbCIsInVzZXJUeXBlIjoiYWRtaW4iLCJpYXQiOjE3NjI5MTUxOTIsImV4cCI6MTc2MjkxODc5Mn0.0om7Fp0GnmKIj068JshMOFOBNrI_IqhOYYR966H6BNc', '2025-11-11 19:39:52', '2025-11-12 02:39:52'),
(97, 4, 'admin', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicm9sZSI6IkNvb3JkaW5hdG9yIiwidXNlcm5hbWUiOiJtYXJpc2NhbCIsInVzZXJUeXBlIjoiYWRtaW4iLCJpYXQiOjE3NjM5NTUxMTQsImV4cCI6MTc2Mzk1ODcxNH0.Dh1xQujSOSr1Z9R1Ycu42zk6_ThIS84zqSoWzhmmbPw', '2025-11-23 20:31:54', '2025-11-24 03:31:54'),
(98, 1, 'student', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InN0dWRlbnQiLCJ1c2VybmFtZSI6ImNpYW52ZXJnZWwiLCJ1c2VyVHlwZSI6InN0dWRlbnQiLCJpYXQiOjE3NjM5NjE4NzUsImV4cCI6MTc2Mzk2NTQ3NX0.KZv5pZduZEdYOdCZvp78P8gnfv9-oHMKf6enH7h9k58', '2025-11-23 22:24:35', '2025-11-24 05:24:35'),
(103, 4, 'admin', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicm9sZSI6IkNvb3JkaW5hdG9yIiwidXNlcm5hbWUiOiJtYXJpc2NhbCIsInVzZXJUeXBlIjoiYWRtaW4iLCJpYXQiOjE3NjcyNzQyODMsImV4cCI6MTc2NzI3Nzg4M30.T4bPnaa80Xp_fzLEPGZYTuDzPBvJRDOBtgTAO4q2RYg', '2026-01-01 06:31:23', '2026-01-01 13:31:23');

-- --------------------------------------------------------

--
-- Table structure for table `im_users`
--

CREATE TABLE `im_users` (
  `ID` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `IsDeleted` tinyint(1) DEFAULT 0,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `Extra1` varchar(255) DEFAULT NULL,
  `Extra2` varchar(255) DEFAULT NULL,
  `Extra3` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `im_users`
--

INSERT INTO `im_users` (`ID`, `Username`, `Password`, `IsDeleted`, `CreatedAt`, `Extra1`, `Extra2`, `Extra3`) VALUES
(1, 'cianvergel', '$2b$10$13tmWRIUcKHziOIAxEFPCe/XPp.xL7rDdz3BzcOKVmZsdB9IFBg.W', 0, '2025-10-07 05:48:28', NULL, NULL, NULL),
(2, 'jhenesis', '$2b$10$r12eIp4iPgZpU2KMVTXxmOsmNwIwkEyIKzFhKhOTkEAoCkKDEeAea', 0, '2025-10-07 06:10:07', NULL, NULL, NULL),
(3, 'arcee', '$2b$10$PibCJ.UAhmCgD7Upu4vKUOBZufCnLOEsKoli190hUblxz5jfvIBuG', 0, '2025-10-08 08:45:41', NULL, NULL, NULL),
(4, 'cianvergelll@gmail.com', '$2b$10$y2zMRCOpk6pG1Bn54xmgguUD0yC0C.Wcfm/opZTDKLJoIQPCrUzzy', 0, '2025-10-27 11:15:11', NULL, NULL, NULL),
(14, 'cianvergel@gmail.com', '$2b$10$zP4XWKu9Pq29L7eMxWCdl.71HVw9EhKaJPb/zaeX2C7fXyQ1VsD0q', 0, '2025-10-27 11:43:06', NULL, NULL, NULL),
(54, 'asdasdasd', '$2b$10$7dcoQK3RxofkzYNCPy9XGupnmm6W.onB/K44HN99olWluk5bO64by', 0, '2025-11-12 02:56:47', NULL, NULL, NULL),
(55, 'asdasdasdasdasd', '$2b$10$Ug5ZBLKNQZYU8pQUnHAiH.RDcOEGRipfukjAeSgDRwDhZEopqoDWm', 0, '2025-11-12 02:56:54', NULL, NULL, NULL),
(58, 'cianvergelll@gm2435567432ail.com', '$2b$10$OgxzBIfhFVwid.MsG3L8m.K3cu7dCPVDNbUdEuWkLqOBEAu/0KbPS', 0, '2025-11-24 03:35:25', NULL, NULL, NULL),
(59, 'virgilio', '$2b$10$wQZ8vNNom8TWeVU2AhlCPuhGfbE2vYg3x/vyYjy.NW1AowNdBoiP.', 0, '2026-01-01 13:24:19', NULL, NULL, NULL),
(60, 'vicenta', '$2b$10$d3Eu6VFie1ZJs4XwsLngceQMN3UYQ1J6xsVt/TVy2wE7Cg3E1mhLG', 0, '2026-01-01 13:30:54', NULL, NULL, NULL),
(61, 'angela', '$2b$10$CLxZFY.CICTLoqJdganFyeeHTnNWMMV/E1jROBkwEegMLrDb1ZTYG', 0, '2026-01-01 14:11:26', NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `im_admin_users`
--
ALTER TABLE `im_admin_users`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD KEY `idx_username` (`Username`),
  ADD KEY `idx_role` (`Role`),
  ADD KEY `idx_is_deleted` (`IsDeleted`);

--
-- Indexes for table `im_cec_announcements`
--
ALTER TABLE `im_cec_announcements`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `idx_admin` (`AdminID`),
  ADD KEY `idx_target_audience` (`TargetAudience`),
  ADD KEY `idx_is_active` (`IsActive`),
  ADD KEY `idx_created` (`CreatedAt`),
  ADD KEY `idx_start_date` (`StartDate`),
  ADD KEY `idx_end_date` (`EndDate`);

--
-- Indexes for table `im_cec_attendance`
--
ALTER TABLE `im_cec_attendance`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `idx_school` (`SchoolID`),
  ADD KEY `idx_student` (`StudentID`),
  ADD KEY `idx_department` (`DepartmentID`),
  ADD KEY `idx_timein` (`TimeIn`),
  ADD KEY `idx_timeout` (`TimeOut`),
  ADD KEY `idx_created` (`CreatedAt`);

--
-- Indexes for table `im_cec_complaints`
--
ALTER TABLE `im_cec_complaints`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `idx_student` (`StudentID`),
  ADD KEY `idx_school` (`SchoolID`),
  ADD KEY `idx_department` (`DepartmentID`),
  ADD KEY `idx_date` (`Date`),
  ADD KEY `idx_status` (`Status`),
  ADD KEY `idx_created` (`CreatedAt`);

--
-- Indexes for table `im_cec_journal`
--
ALTER TABLE `im_cec_journal`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `idx_student` (`StudentID`),
  ADD KEY `idx_date` (`Date`),
  ADD KEY `idx_school` (`SchoolID`),
  ADD KEY `idx_department` (`DepartmentID`);

--
-- Indexes for table `im_cec_notifications`
--
ALTER TABLE `im_cec_notifications`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `idx_student` (`StudentID`),
  ADD KEY `idx_is_read` (`IsRead`),
  ADD KEY `idx_created` (`CreatedAt`);

--
-- Indexes for table `im_cec_students`
--
ALTER TABLE `im_cec_students`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `unique_student_id` (`StudentID`),
  ADD KEY `idx_student_name` (`StudentName`),
  ADD KEY `idx_school` (`SchoolID`),
  ADD KEY `idx_department` (`DepartmentID`),
  ADD KEY `idx_email` (`Email`),
  ADD KEY `idx_company` (`CompanyName`),
  ADD KEY `idx_is_active` (`IsActive`),
  ADD KEY `idx_is_completed` (`IsCompleted`);

--
-- Indexes for table `im_schools`
--
ALTER TABLE `im_schools`
  ADD PRIMARY KEY (`schoolID`),
  ADD KEY `idx_school_name` (`school_name`);

--
-- Indexes for table `im_sessions`
--
ALTER TABLE `im_sessions`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `session_token` (`session_token`);

--
-- Indexes for table `im_users`
--
ALTER TABLE `im_users`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD KEY `idx_username` (`Username`),
  ADD KEY `idx_is_deleted` (`IsDeleted`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `im_admin_users`
--
ALTER TABLE `im_admin_users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `im_cec_announcements`
--
ALTER TABLE `im_cec_announcements`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `im_cec_attendance`
--
ALTER TABLE `im_cec_attendance`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `im_cec_complaints`
--
ALTER TABLE `im_cec_complaints`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `im_cec_journal`
--
ALTER TABLE `im_cec_journal`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `im_cec_notifications`
--
ALTER TABLE `im_cec_notifications`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `im_cec_students`
--
ALTER TABLE `im_cec_students`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=187;

--
-- AUTO_INCREMENT for table `im_sessions`
--
ALTER TABLE `im_sessions`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `im_users`
--
ALTER TABLE `im_users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `im_cec_notifications`
--
ALTER TABLE `im_cec_notifications`
  ADD CONSTRAINT `im_cec_notifications_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `im_cec_students` (`StudentID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
