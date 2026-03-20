-- ============================================================
--  GRADELY DATABASE — SNU Chennai
--  Tables: programs, semesters, subjects,
--          program_semester_subjects, grade_references
-- ============================================================

CREATE DATABASE IF NOT EXISTS gradely;
USE gradely;

-- ------------------------------------------------------------
-- 1. PROGRAMS
-- ------------------------------------------------------------
CREATE TABLE programs (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO programs (id, name) VALUES
  (1, 'B.Tech AI & DS'),
  (2, 'B.Tech CSE (IoT)'),
  (3, 'B.Tech CSE (CS)');

-- ------------------------------------------------------------
-- 2. SEMESTERS
-- ------------------------------------------------------------
CREATE TABLE semesters (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  semester_number INT         NOT NULL,
  label           VARCHAR(20) NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO semesters (id, semester_number, label) VALUES
  (1, 1, 'Semester 1'),
  (2, 2, 'Semester 2'),
  (3, 3, 'Semester 3'),
  (4, 4, 'Semester 4'),
  (5, 5, 'Semester 5'),
  (6, 6, 'Semester 6'),
  (7, 7, 'Semester 7'),
  (8, 8, 'Semester 8');

-- ------------------------------------------------------------
-- 3. GRADE REFERENCES
-- ------------------------------------------------------------
CREATE TABLE grade_references (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  grade_letter VARCHAR(5)  NOT NULL,
  grade_point  INT         NOT NULL,
  min_marks    INT         NOT NULL,
  max_marks    INT         NOT NULL,
  description  VARCHAR(50) NOT NULL
);

INSERT INTO grade_references (grade_letter, grade_point, min_marks, max_marks, description) VALUES
  ('O',  10, 91, 100, 'Outstanding'),
  ('A+',  9, 81,  90, 'Distinction'),
  ('A',   8, 71,  80, 'Excellent'),
  ('B+',  7, 61,  70, 'Very Good'),
  ('B',   6, 51,  60, 'Good'),
  ('P',   5, 41,  50, 'Pass'),
  ('RA',  0,  0,  40, 'Reappearance');

-- ------------------------------------------------------------
-- 4. SUBJECTS
-- unique_tag is used ONLY when the same name+credits exist
-- across programs but refer to a program-specific variant.
-- e.g. "Programming in C Lab" named differently in CS:
--      "Programming in C Lab (Linux based)"
-- For truly identical name+credits the same row is reused
-- via the junction table.
-- ------------------------------------------------------------
CREATE TABLE subjects (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(200) NOT NULL,
  credits    INT          NOT NULL,
  unique_tag VARCHAR(50)  DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── SEMESTER 1 subjects ──────────────────────────────────────
-- shared identical rows
INSERT INTO subjects (id, name, credits, unique_tag) VALUES
(1,  'Communicative English',                          3, NULL),
(2,  'Programming in C',                               3, NULL),
(3,  'English for Engineers',                          3, NULL),   -- sem2 but defined early for reference clarity
(4,  'Programming in Python',                          2, NULL),
(5,  'Data Structures',                                3, NULL),
(6,  'Programming in Python Lab',                      2, NULL),
(7,  'Data Structures Lab',                            2, NULL);

-- Linear Algebra: IoT=3 credits, Cyber & AI&DS=4 credits → 2 rows
INSERT INTO subjects (id, name, credits, unique_tag) VALUES
(8,  'Linear Algebra',                                 3, NULL),   -- IoT
(9,  'Linear Algebra',                                 4, NULL);   -- Cyber, AI&DS

-- Cyber sem1 specifics
INSERT INTO subjects (id, name, credits, unique_tag) VALUES
(10, 'Engineering Physics',                            3, NULL),
(11, 'Cyber Security Essentials',                      4, NULL),
(12, 'Digital Design + Lab',                           3, NULL),
(13, 'Programming in C Lab',                           2, 'Linux based'),  -- Cyber variant
(14, 'Engineering Physics Lab',                        2, NULL);

-- IoT sem1 specifics
INSERT INTO subjects (id, name, credits, unique_tag) VALUES
(15, 'Environmental Science and Engineering',          2, NULL),
(16, 'Digital Design and Microprocessor',              3, NULL),
(17, 'Basics of Electrical and Electronics Engineering', 3, NULL),
(18, 'Programming in C Lab',                           2, NULL),            -- IoT & AI&DS variant (standard)
(19, 'Digital Design and Microprocessor Lab',          2, NULL);

-- AI&DS sem1 specifics
INSERT INTO subjects (id, name, credits, unique_tag) VALUES
(20, 'Digital Design + Lab',                           3, 'AI&DS');         -- same name+credits as Cyber (id=12) but listed separately in AI&DS curriculum; reuse id=12 in mapping

-- ── SEMESTER 2 subjects ──────────────────────────────────────
INSERT INTO subjects (id, name, credits, unique_tag) VALUES
(21, 'Probability and Statistics',                     3, NULL),
(22, 'Computer Organization',                          3, NULL),            -- Cyber
(23, 'Classical Cryptography',                         3, NULL),
(24, 'Engineering Physics',                            3, 'IoT'),           -- IoT sem2 (same name as id=10, different semester context — reuse id=10 in mapping)
(25, 'Introduction to Internet of Things + Lab',       4, NULL),
(26, 'Engineering Physics Lab',                        2, 'IoT'),           -- reuse id=14 in mapping
(27, 'Computer Organization and Architecture',         3, NULL),            -- IoT & AI&DS
(28, 'Statistical Foundations of Data Science',        3, NULL),
(29, 'Foundations of Data Science + Lab',              4, NULL);

-- ── SEMESTER 3 subjects ──────────────────────────────────────
INSERT INTO subjects (id, name, credits, unique_tag) VALUES
(30, 'Object Oriented Programming',                    3, NULL),
(31, 'Database Management Systems',                    3, NULL),
(32, 'OOP Lab',                                        2, NULL),
(33, 'Database Management Lab',                        2, NULL),
-- Discrete Mathematics: Cyber=3, AI&DS=4 → 2 rows
(34, 'Discrete Mathematics',                           3, NULL),            -- Cyber
(35, 'Discrete Mathematics',                           4, NULL),            -- AI&DS
(36, 'Operating Systems + Lab',                        4, NULL),
(37, 'Modern Cryptography',                            2, NULL),
(38, 'Cognitive Psychology',                           2, NULL),
-- IoT sem3
(39, 'Discrete Mathematics and Graph Theory',          4, NULL),
(40, 'Software Engineering and Design',                3, NULL),
(41, 'Data Structures Lab',                            2, 'IoT-sem3'),      -- IoT has DS lab in sem3 (different from sem2 DS Lab id=7)
(42, 'Database Management Systems Lab',                2, NULL),
-- AI&DS sem3
(43, 'Artificial Intelligence',                        3, NULL),
(44, 'Exploratory Data Analysis and Data Visualization',     2, NULL),
(45, 'Exploratory Data Analysis and Data Visualization Lab', 2, NULL),
(46, 'Object Oriented Programming Lab',                2, NULL);            -- AI&DS names it differently from OOP Lab id=32

-- ── SEMESTER 4 subjects ──────────────────────────────────────
INSERT INTO subjects (id, name, credits, unique_tag) VALUES
(47, 'Design and Analysis of Algorithms',              3, NULL),
(48, 'Open Elective I',                                3, NULL),
(49, 'Extra Academic Activity',                        2, NULL),
(50, 'Computer Networks',                              3, NULL),            -- Cyber & IoT
(51, 'Computer Networks Lab',                          2, NULL),
(52, 'Machine Learning Techniques',                    3, NULL),
(53, 'Graph Theory',                                   4, NULL),
(54, 'System Security Management + Lab',               4, NULL),
(55, 'Machine Learning Lab',                           2, NULL),
-- IoT sem4
(56, 'Operating Systems',                              3, NULL),
(57, 'Introduction to Sensor Technology',              3, NULL),
(58, 'Agile Scrum Process',                            1, NULL),
(59, 'Operating Systems Lab',                          2, NULL),
(60, 'Design Thinking',                                1, NULL),
-- AI&DS sem4
(61, 'Computer Networks + Lab',                        4, NULL),
(62, 'Machine Learning Techniques Lab',                2, NULL),
(63, 'Data Mining',                                    1, NULL),
(64, 'Database Management Systems Lab',                2, 'AIDS-sem4');     -- AI&DS has DBMS lab in sem4 (distinct from id=42)

-- ── SEMESTER 5 subjects ──────────────────────────────────────
INSERT INTO subjects (id, name, credits, unique_tag) VALUES
(65, 'Professional Elective I',                        3, NULL),
(66, 'Open Elective II',                               3, NULL),
(67, 'Optimization Techniques',                        3, NULL),
(68, 'Principles of Management',                       2, NULL),
(69, 'Artificial Intelligence',                        3, 'CYBER-IoT-sem5'), -- Cyber & IoT sem5 (AI&DS has it in sem3 id=43)
(70, 'Web Technologies',                               3, NULL),
-- Web Technologies Lab: IoT=2, AI&DS=1 → 2 rows
(71, 'Web Technologies Lab',                           2, NULL),            -- IoT
(72, 'Web Technologies Lab',                           1, NULL),            -- AI&DS
(73, 'High Performance Computing and Big Data for Cyber Security', 3, NULL),
(74, 'Network Penetration Testing, Ethical Hacking and Social Engineering', 3, NULL),
(75, 'Penetration Testing and Ethical Hacking Lab',    2, NULL),
(76, 'Cyber Security Lab',                             1, NULL),
-- IoT sem5
(77, 'Software and Programming in IoT',                3, NULL),
(78, 'Distributed Computing',                          2, NULL),
(79, 'Business Basics for Entrepreneurs',              0, NULL),
(80, 'Artificial Intelligence Lab',                    2, NULL),
(81, 'Software and Programming in IoT Lab',            1, NULL),
-- AI&DS sem5
(82, 'Statistical Inference',                          3, NULL),
(83, 'Big Data Analytics',                             3, NULL),
(84, 'Introduction to Robotics',                       3, NULL),
(85, 'Introduction to Digital Signal Processing',      1, NULL),
(86, 'Big Data Analytics Lab',                         2, NULL);

-- ── SEMESTER 6 subjects ──────────────────────────────────────
INSERT INTO subjects (id, name, credits, unique_tag) VALUES
(87, 'Professional Elective II',                       3, NULL),
(88, 'Open Elective III',                              3, NULL),
(89, 'Image and Video Processing',                     3, NULL),
(90, 'Image and Video Processing Lab',                 2, NULL),
-- Cyber sem6
(91, 'Network Security',                               2, NULL),
(92, 'Cloud Computing and Security',                   3, NULL),
(93, 'Cyber Forensics',                                3, NULL),
(94, 'Cloud Security Lab',                             2, NULL),
-- IoT sem6
(95, 'Machine Learning Algorithms',                    3, NULL),
(96, 'IoT Architecture and Protocols',                 3, NULL),
(97, 'Cryptography Concepts',                          2, NULL),
(98, 'Professional Elective III',                      3, NULL),
(99, 'Industrial Training',                            1, NULL),
(100,'Mini Project',                                   1, NULL),
(101,'Machine Learning Algorithms Lab',                2, NULL),
-- AI&DS sem6
(102,'Natural Language Processing',                    3, NULL),
(103,'Introduction to Speech Signal Processing',       1, NULL),
(104,'Professional Elective I',                        3, 'AIDS-sem6'),     -- AI&DS has PE-I in sem6 (Cyber & IoT have it in sem5)
(105,'Business Basics for Entrepreneurs',              0, 'AIDS-sem6'),     -- AI&DS has it in sem6 (IoT has it in sem5 id=79)
(106,'Natural Language Processing Lab',                2, NULL);

-- ── SEMESTER 7 subjects ──────────────────────────────────────
INSERT INTO subjects (id, name, credits, unique_tag) VALUES
(107,'Professional Elective IV',                       3, NULL),
(108,'Deep Learning',                                  3, NULL),
(109,'Deep Learning Lab',                              2, NULL),
-- Capstone Project I: Cyber=4, AI&DS=3 → 2 rows
(110,'Capstone Project I',                             4, NULL),            -- Cyber
(111,'Capstone Project I',                             3, NULL),            -- AI&DS
-- Cyber sem7
(112,'Web Application Security',                       3, NULL),
(113,'Professional Elective III',                      3, 'CYBER-sem7'),
(114,'Open Elective III',                              3, 'CYBER-IoT-sem7'),-- Cyber & IoT have OE-III in sem7; AI&DS in sem6
-- IoT sem7
(115,'Trusted Computing and Security Models',          3, NULL),
(116,'Cloud and Fog Computing for IoT',                3, NULL),
(117,'DevOps',                                         3, NULL),
(118,'Management Principles for Engineers',            2, NULL),
(119,'Intellectual Property Rights',                   1, NULL),
(120,'Industrial Training / MOOC / Seminar',           1, NULL),
(121,'DevOps Lab',                                     2, NULL),
(122,'Project Phase-I / Internship',                   3, NULL),
-- AI&DS sem7
(123,'Speech Technology',                              3, NULL),
(124,'Professional Elective III',                      3, 'AIDS-sem7');

-- ── SEMESTER 8 subjects ──────────────────────────────────────
INSERT INTO subjects (id, name, credits, unique_tag) VALUES
(125,'Professional Elective V',                        3, NULL),
(126,'Professional Elective VI',                       3, NULL),
(127,'Capstone Project II',                            6, NULL),            -- Cyber & AI&DS
(128,'Project Phase-II',                               6, NULL);            -- IoT

-- ------------------------------------------------------------
-- 5. PROGRAM_SEMESTER_SUBJECTS  (junction table)
--    program_id: 1=AI&DS  2=IoT  3=Cyber
--    semester_id: 1–8
-- ------------------------------------------------------------
CREATE TABLE program_semester_subjects (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  program_id INT NOT NULL,
  semester_id INT NOT NULL,
  subject_id  INT NOT NULL,
  FOREIGN KEY (program_id)  REFERENCES programs(id),
  FOREIGN KEY (semester_id) REFERENCES semesters(id),
  FOREIGN KEY (subject_id)  REFERENCES subjects(id),
  UNIQUE KEY uq_prog_sem_subj (program_id, semester_id, subject_id)
);

-- ════════════════════════════════════════════════════════════
--  B.Tech CSE (CS)  →  program_id = 3
-- ════════════════════════════════════════════════════════════

-- CS Semester 1
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(3,1,1),   -- Communicative English
(3,1,9),   -- Linear Algebra (4 credits)
(3,1,10),  -- Engineering Physics
(3,1,11),  -- Cyber Security Essentials
(3,1,2),   -- Programming in C
(3,1,12),  -- Digital Design + Lab
(3,1,13),  -- Programming in C Lab (Linux based)
(3,1,14);  -- Engineering Physics Lab

-- CS Semester 2
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(3,2,3),   -- English for Engineers
(3,2,21),  -- Probability and Statistics
(3,2,4),   -- Programming in Python
(3,2,5),   -- Data Structures
(3,2,22),  -- Computer Organization
(3,2,23),  -- Classical Cryptography
(3,2,7),   -- Data Structures Lab
(3,2,6);   -- Programming in Python Lab

-- CS Semester 3
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(3,3,34),  -- Discrete Mathematics (3 credits)
(3,3,30),  -- Object Oriented Programming
(3,3,36),  -- Operating Systems + Lab
(3,3,31),  -- Database Management Systems
(3,3,37),  -- Modern Cryptography
(3,3,38),  -- Cognitive Psychology
(3,3,32),  -- OOP Lab
(3,3,33);  -- Database Management Lab

-- CS Semester 4
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(3,4,47),  -- Design and Analysis of Algorithms
(3,4,53),  -- Graph Theory
(3,4,50),  -- Computer Networks
(3,4,52),  -- Machine Learning Techniques
(3,4,48),  -- Open Elective I
(3,4,54),  -- System Security Management + Lab
(3,4,51),  -- Computer Networks Lab
(3,4,55),  -- Machine Learning Lab
(3,4,49);  -- Extra Academic Activity

-- CS Semester 5
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(3,5,67),  -- Optimization Techniques
(3,5,73),  -- HPC and Big Data for Cyber Security
(3,5,69),  -- Artificial Intelligence
(3,5,74),  -- Network Penetration Testing...
(3,5,68),  -- Principles of Management
(3,5,65),  -- Professional Elective I
(3,5,75),  -- Penetration Testing Lab
(3,5,76);  -- Cyber Security Lab

-- CS Semester 6
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(3,6,89),  -- Image and Video Processing
(3,6,91),  -- Network Security
(3,6,92),  -- Cloud Computing and Security
(3,6,93),  -- Cyber Forensics
(3,6,87),  -- Professional Elective II
(3,6,66),  -- Open Elective II  (reuse id=66 — same name/credits as sem5 OE-II mapping is fine since junction links sem correctly)
(3,6,94),  -- Cloud Security Lab
(3,6,90);  -- Image and Video Processing Lab

-- CS Semester 7
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(3,7,108), -- Deep Learning
(3,7,112), -- Web Application Security
(3,7,113), -- Professional Elective III (Cyber)
(3,7,107), -- Professional Elective IV
(3,7,114), -- Open Elective III (Cyber/IoT sem7)
(3,7,109), -- Deep Learning Lab
(3,7,110); -- Capstone Project I (4 credits)

-- CS Semester 8
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(3,8,125), -- Professional Elective V
(3,8,126), -- Professional Elective VI
(3,8,127); -- Capstone Project II

-- ════════════════════════════════════════════════════════════
--  B.Tech CSE (IoT)  →  program_id = 2
-- ════════════════════════════════════════════════════════════

-- IoT Semester 1
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(2,1,1),   -- Communicative English
(2,1,8),   -- Linear Algebra (3 credits)
(2,1,2),   -- Programming in C
(2,1,15),  -- Environmental Science and Engineering
(2,1,16),  -- Digital Design and Microprocessor
(2,1,17),  -- Basics of Electrical and Electronics Engineering
(2,1,18),  -- Programming in C Lab (standard)
(2,1,19);  -- Digital Design and Microprocessor Lab

-- IoT Semester 2
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(2,2,3),   -- English for Engineers
(2,2,21),  -- Probability and Statistics
(2,2,10),  -- Engineering Physics (reuse id=10, same name+credits)
(2,2,27),  -- Computer Organization and Architecture
(2,2,25),  -- Introduction to Internet of Things + Lab
(2,2,4),   -- Programming in Python
(2,2,14),  -- Engineering Physics Lab (reuse id=14)
(2,2,6);   -- Programming in Python Lab

-- IoT Semester 3
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(2,3,39),  -- Discrete Mathematics and Graph Theory
(2,3,5),   -- Data Structures (reuse id=5)
(2,3,30),  -- Object Oriented Programming
(2,3,31),  -- Database Management Systems
(2,3,40),  -- Software Engineering and Design
(2,3,41),  -- Data Structures Lab (IoT sem3)
(2,3,42);  -- Database Management Systems Lab

-- IoT Semester 4
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(2,4,56),  -- Operating Systems
(2,4,47),  -- Design and Analysis of Algorithms
(2,4,50),  -- Computer Networks
(2,4,57),  -- Introduction to Sensor Technology
(2,4,58),  -- Agile Scrum Process
(2,4,48),  -- Open Elective I
(2,4,59),  -- Operating Systems Lab
(2,4,51),  -- Computer Networks Lab
(2,4,60),  -- Design Thinking
(2,4,49);  -- Extra Academic Activities

-- IoT Semester 5
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(2,5,69),  -- Artificial Intelligence
(2,5,70),  -- Web Technologies
(2,5,77),  -- Software and Programming in IoT
(2,5,78),  -- Distributed Computing
(2,5,79),  -- Business Basics for Entrepreneurs
(2,5,65),  -- Professional Elective I
(2,5,66),  -- Open Elective II
(2,5,71),  -- Web Technologies Lab (2 credits)
(2,5,80),  -- Artificial Intelligence Lab
(2,5,81);  -- Software and Programming in IoT Lab

-- IoT Semester 6
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(2,6,95),  -- Machine Learning Algorithms
(2,6,96),  -- IoT Architecture and Protocols
(2,6,97),  -- Cryptography Concepts
(2,6,87),  -- Professional Elective II
(2,6,98),  -- Professional Elective III
(2,6,88),  -- Open Elective III
(2,6,99),  -- Industrial Training
(2,6,100), -- Mini Project
(2,6,101); -- Machine Learning Algorithms Lab

-- IoT Semester 7
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(2,7,115), -- Trusted Computing and Security Models
(2,7,116), -- Cloud and Fog Computing for IoT
(2,7,117), -- DevOps
(2,7,118), -- Management Principles for Engineers
(2,7,119), -- Intellectual Property Rights
(2,7,107), -- Professional Elective IV
(2,7,120), -- Industrial Training / MOOC / Seminar
(2,7,121), -- DevOps Lab
(2,7,122), -- Project Phase-I / Internship
(2,7,114); -- Open Elective III (Cyber/IoT sem7)

-- IoT Semester 8
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(2,8,125), -- Professional Elective V
(2,8,126), -- Professional Elective VI
(2,8,128); -- Project Phase-II

-- ════════════════════════════════════════════════════════════
--  B.Tech AI & DS  →  program_id = 1
-- ════════════════════════════════════════════════════════════

-- AI&DS Semester 1
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(1,1,1),   -- Communicative English
(1,1,9),   -- Linear Algebra (4 credits)
(1,1,10),  -- Engineering Physics
(1,1,15),  -- Environmental Science and Engineering
(1,1,2),   -- Programming in C
(1,1,12),  -- Digital Design + Lab (reuse Cyber's id=12, same name+credits)
(1,1,18),  -- Programming in C Lab (standard)
(1,1,14);  -- Engineering Physics Lab

-- AI&DS Semester 2
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(1,2,3),   -- English for Engineers
(1,2,28),  -- Statistical Foundations of Data Science
(1,2,4),   -- Programming in Python
(1,2,5),   -- Data Structures
(1,2,27),  -- Computer Organization and Architecture
(1,2,29),  -- Foundations of Data Science + Lab
(1,2,7),   -- Data Structures Lab
(1,2,6);   -- Programming in Python Lab

-- AI&DS Semester 3
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(1,3,35),  -- Discrete Mathematics (4 credits)
(1,3,30),  -- Object Oriented Programming
(1,3,36),  -- Operating Systems + Lab
(1,3,43),  -- Artificial Intelligence
(1,3,44),  -- Exploratory Data Analysis and Data Visualization
(1,3,38),  -- Cognitive Psychology
(1,3,46),  -- Object Oriented Programming Lab
(1,3,45);  -- Exploratory Data Analysis and Data Visualization Lab

-- AI&DS Semester 4
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(1,4,47),  -- Design and Analysis of Algorithms
(1,4,31),  -- Database Management Systems
(1,4,61),  -- Computer Networks + Lab
(1,4,52),  -- Machine Learning Techniques
(1,4,63),  -- Data Mining
(1,4,48),  -- Open Elective I
(1,4,42),  -- Database Management Systems Lab (reuse id=42)
(1,4,62),  -- Machine Learning Techniques Lab
(1,4,49);  -- Extra Academic Activity

-- AI&DS Semester 5
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(1,5,67),  -- Optimization Techniques
(1,5,70),  -- Web Technologies
(1,5,82),  -- Statistical Inference
(1,5,83),  -- Big Data Analytics
(1,5,68),  -- Principles of Management
(1,5,84),  -- Introduction to Robotics
(1,5,85),  -- Introduction to Digital Signal Processing
(1,5,86),  -- Big Data Analytics Lab
(1,5,72);  -- Web Technologies Lab (1 credit)

-- AI&DS Semester 6
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(1,6,89),  -- Image and Video Processing
(1,6,105), -- Business Basics for Entrepreneurs (AIDS-sem6)
(1,6,102), -- Natural Language Processing
(1,6,103), -- Introduction to Speech Signal Processing
(1,6,104), -- Professional Elective I (AIDS-sem6)
(1,6,87),  -- Professional Elective II
(1,6,66),  -- Open Elective II
(1,6,90),  -- Image and Video Processing Lab
(1,6,106); -- Natural Language Processing Lab

-- AI&DS Semester 7
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(1,7,108), -- Deep Learning
(1,7,123), -- Speech Technology
(1,7,124), -- Professional Elective III (AI&DS)
(1,7,107), -- Professional Elective IV
(1,7,88),  -- Open Elective III
(1,7,109), -- Deep Learning Lab
(1,7,111); -- Capstone Project I (3 credits)

-- AI&DS Semester 8
INSERT INTO program_semester_subjects (program_id, semester_id, subject_id) VALUES
(1,8,125), -- Professional Elective V
(1,8,126), -- Professional Elective VI
(1,8,127); -- Capstone Project II

-- ------------------------------------------------------------------------------

select * from programs;
SELECT * FROM subjects;
SELECT * FROM grade_references;
SELECT * FROM program_semester_subjects;
SELECT
  p.name        AS program,
  se.label      AS semester,
  su.name       AS subject,
  su.credits    AS credits,
  su.unique_tag AS unique_tag
FROM program_semester_subjects pss
JOIN programs  p  ON p.id  = pss.program_id
JOIN semesters se ON se.id = pss.semester_id
JOIN subjects  su ON su.id = pss.subject_id
ORDER BY p.name, se.semester_number, su.name;
select * from semesters;