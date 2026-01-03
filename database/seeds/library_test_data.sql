-- =====================================================
-- LIBRARY MANAGEMENT TEST DATA
-- For testing library management CRUD operations
-- =====================================================
-- This file provides comprehensive test data covering:
-- - Library books across various categories and subjects
-- - Book transactions (issued, returned, overdue, lost)
-- - Multiple copies of popular books
-- =====================================================

-- Prerequisites: Run academic_test_data.sql and students_test_data.sql first

-- Use the same test tenant
-- Test Tenant ID: 00000000-0000-0000-0000-000000000001

-- =====================================================
-- LIBRARY BOOKS
-- =====================================================

INSERT INTO library_books (id, tenant_id, title, author, isbn, publisher, publication_year, category, total_copies, available_copies, shelf_location, status, description, created_at)
VALUES
  -- Science Books
  (
    'book1000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'A Brief History of Time',
    'Stephen Hawking',
    '978-0553380163',
    'Bantam Books',
    1988,
    'Science',
    3,
    2,
    'A-101',
    'available',
    'A landmark volume in science writing by one of the great minds of our time',
    now()
  ),
  (
    'book1000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Cosmos',
    'Carl Sagan',
    '978-0345539434',
    'Random House',
    1980,
    'Science',
    2,
    2,
    'A-102',
    'available',
    'The story of cosmic evolution, science and civilization',
    now()
  ),
  (
    'book1000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'The Selfish Gene',
    'Richard Dawkins',
    '978-0198788607',
    'Oxford University Press',
    1976,
    'Science',
    2,
    1,
    'A-103',
    'available',
    'Revolutionary approach to understanding natural selection',
    now()
  ),
  
  -- Mathematics Books
  (
    'book1000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'The Joy of x',
    'Steven Strogatz',
    '978-0544105850',
    'Mariner Books',
    2012,
    'Mathematics',
    3,
    3,
    'B-101',
    'available',
    'A guided tour of mathematics, from one to infinity',
    now()
  ),
  (
    'book1000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'How Not to Be Wrong',
    'Jordan Ellenberg',
    '978-0143127536',
    'Penguin Press',
    2014,
    'Mathematics',
    2,
    2,
    'B-102',
    'available',
    'The power of mathematical thinking',
    now()
  ),
  (
    'book1000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'Mathematics for the Million',
    'Lancelot Hogben',
    '978-0393310719',
    'W. W. Norton',
    1937,
    'Mathematics',
    2,
    2,
    'B-103',
    'available',
    'How to master the magic of numbers',
    now()
  ),
  
  -- Fiction Books
  (
    'book1000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000001',
    'To Kill a Mockingbird',
    'Harper Lee',
    '978-0060935467',
    'Harper Perennial',
    1960,
    'Fiction',
    5,
    3,
    'C-101',
    'available',
    'A gripping tale of justice and growing up in the American South',
    now()
  ),
  (
    'book1000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000001',
    '1984',
    'George Orwell',
    '978-0451524935',
    'Signet Classic',
    1949,
    'Fiction',
    4,
    2,
    'C-102',
    'available',
    'A dystopian social science fiction novel',
    now()
  ),
  (
    'book1000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000001',
    'Pride and Prejudice',
    'Jane Austen',
    '978-0141439518',
    'Penguin Classics',
    1813,
    'Fiction',
    3,
    3,
    'C-103',
    'available',
    'A romantic novel of manners',
    now()
  ),
  (
    'book1000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000001',
    'The Great Gatsby',
    'F. Scott Fitzgerald',
    '978-0743273565',
    'Scribner',
    1925,
    'Fiction',
    4,
    4,
    'C-104',
    'available',
    'The story of the mysteriously wealthy Jay Gatsby',
    now()
  ),
  
  -- History Books
  (
    'book1000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    'Sapiens: A Brief History of Humankind',
    'Yuval Noah Harari',
    '978-0062316097',
    'Harper',
    2014,
    'History',
    4,
    3,
    'D-101',
    'available',
    'The history of humankind from the Stone Age to the present',
    now()
  ),
  (
    'book1000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000001',
    'The Story of India',
    'Michael Wood',
    '978-1846079849',
    'BBC Books',
    2007,
    'History',
    2,
    2,
    'D-102',
    'available',
    'A comprehensive history of the Indian subcontinent',
    now()
  ),
  (
    'book1000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000001',
    'Guns, Germs, and Steel',
    'Jared Diamond',
    '978-0393317558',
    'W. W. Norton',
    1997,
    'History',
    2,
    1,
    'D-103',
    'available',
    'The fates of human societies',
    now()
  ),
  
  -- Literature Books
  (
    'book1000-0000-0000-0000-000000000014',
    '00000000-0000-0000-0000-000000000001',
    'The Complete Works of William Shakespeare',
    'William Shakespeare',
    '978-0517053614',
    'Barnes & Noble',
    1623,
    'Literature',
    3,
    3,
    'E-101',
    'available',
    'Complete collection of Shakespeare plays and poems',
    now()
  ),
  (
    'book1000-0000-0000-0000-000000000015',
    '00000000-0000-0000-0000-000000000001',
    'The Odyssey',
    'Homer',
    '978-0140268867',
    'Penguin Classics',
    -800,
    'Literature',
    3,
    2,
    'E-102',
    'available',
    'Ancient Greek epic poem',
    now()
  ),
  (
    'book1000-0000-0000-0000-000000000016',
    '00000000-0000-0000-0000-000000000001',
    'The Divine Comedy',
    'Dante Alighieri',
    '978-0142437223',
    'Penguin Classics',
    1320,
    'Literature',
    2,
    2,
    'E-103',
    'available',
    'Epic poem describing Dante journey through Hell, Purgatory, and Paradise',
    now()
  ),
  
  -- Computer Science Books
  (
    'book1000-0000-0000-0000-000000000017',
    '00000000-0000-0000-0000-000000000001',
    'Introduction to Algorithms',
    'Thomas H. Cormen',
    '978-0262033848',
    'MIT Press',
    2009,
    'Computer Science',
    3,
    2,
    'F-101',
    'available',
    'Comprehensive textbook covering many algorithms',
    now()
  ),
  (
    'book1000-0000-0000-0000-000000000018',
    '00000000-0000-0000-0000-000000000001',
    'Clean Code',
    'Robert C. Martin',
    '978-0132350884',
    'Prentice Hall',
    2008,
    'Computer Science',
    4,
    4,
    'F-102',
    'available',
    'A handbook of agile software craftsmanship',
    now()
  ),
  (
    'book1000-0000-0000-0000-000000000019',
    '00000000-0000-0000-0000-000000000001',
    'The Pragmatic Programmer',
    'Andrew Hunt',
    '978-0135957059',
    'Addison-Wesley',
    2019,
    'Computer Science',
    3,
    3,
    'F-103',
    'available',
    'Your journey to mastery',
    now()
  ),
  
  -- Biography Books
  (
    'book1000-0000-0000-0000-000000000020',
    '00000000-0000-0000-0000-000000000001',
    'Steve Jobs',
    'Walter Isaacson',
    '978-1451648539',
    'Simon & Schuster',
    2011,
    'Biography',
    3,
    2,
    'G-101',
    'available',
    'The exclusive biography of Steve Jobs',
    now()
  ),
  (
    'book1000-0000-0000-0000-000000000021',
    '00000000-0000-0000-0000-000000000001',
    'The Autobiography of Benjamin Franklin',
    'Benjamin Franklin',
    '978-0486290737',
    'Dover Publications',
    1791,
    'Biography',
    2,
    2,
    'G-102',
    'available',
    'Classic American autobiography',
    now()
  ),
  (
    'book1000-0000-0000-0000-000000000022',
    '00000000-0000-0000-0000-000000000001',
    'Long Walk to Freedom',
    'Nelson Mandela',
    '978-0316548182',
    'Little Brown',
    1994,
    'Biography',
    2,
    1,
    'G-103',
    'available',
    'The autobiography of Nelson Mandela',
    now()
  ),
  
  -- Reference Books
  (
    'book1000-0000-0000-0000-000000000023',
    '00000000-0000-0000-0000-000000000001',
    'Oxford English Dictionary',
    'Oxford University',
    '978-0198611868',
    'Oxford University Press',
    2020,
    'Reference',
    2,
    2,
    'H-101',
    'available',
    'Comprehensive English dictionary',
    now()
  ),
  (
    'book1000-0000-0000-0000-000000000024',
    '00000000-0000-0000-0000-000000000001',
    'The World Atlas',
    'National Geographic',
    '978-1426218767',
    'National Geographic',
    2019,
    'Reference',
    3,
    3,
    'H-102',
    'available',
    'Comprehensive world atlas with detailed maps',
    now()
  ),
  (
    'book1000-0000-0000-0000-000000000025',
    '00000000-0000-0000-0000-000000000001',
    'Encyclopedia Britannica',
    'Various Authors',
    '978-1593392925',
    'Encyclopaedia Britannica',
    2021,
    'Reference',
    5,
    5,
    'H-103',
    'available',
    'General knowledge encyclopedia',
    now()
  ),
  
  -- Children Books
  (
    'book1000-0000-0000-0000-000000000026',
    '00000000-0000-0000-0000-000000000001',
    'Harry Potter and the Philosopher Stone',
    'J.K. Rowling',
    '978-0439708180',
    'Scholastic',
    1997,
    'Children',
    6,
    4,
    'I-101',
    'available',
    'The boy who lived',
    now()
  ),
  (
    'book1000-0000-0000-0000-000000000027',
    '00000000-0000-0000-0000-000000000001',
    'The Chronicles of Narnia',
    'C.S. Lewis',
    '978-0066238500',
    'HarperCollins',
    1950,
    'Children',
    4,
    3,
    'I-102',
    'available',
    'Epic fantasy series set in the magical land of Narnia',
    now()
  ),
  (
    'book1000-0000-0000-0000-000000000028',
    '00000000-0000-0000-0000-000000000001',
    'Charlotte Web',
    'E.B. White',
    '978-0064400558',
    'Harper & Row',
    1952,
    'Children',
    3,
    3,
    'I-103',
    'available',
    'Tale of a pig named Wilbur and a spider named Charlotte',
    now()
  ),
  
  -- Damaged/Lost Books
  (
    'book1000-0000-0000-0000-000000000029',
    '00000000-0000-0000-0000-000000000001',
    'The Theory of Everything',
    'Stephen Hawking',
    '978-8179925911',
    'Jaico Publishing',
    2006,
    'Science',
    2,
    0,
    'A-104',
    'damaged',
    'Origin and fate of the universe - DAMAGED COPY',
    now()
  ),
  (
    'book1000-0000-0000-0000-000000000030',
    '00000000-0000-0000-0000-000000000001',
    'The Alchemist',
    'Paulo Coelho',
    '978-0061122415',
    'HarperOne',
    1988,
    'Fiction',
    3,
    2,
    'C-105',
    'available',
    'A fable about following your dreams',
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- LIBRARY TRANSACTIONS
-- =====================================================

-- Sample library transactions for students
-- Using student IDs from students_test_data.sql
INSERT INTO library_transactions (id, tenant_id, book_id, student_id, staff_id, issued_date, due_date, return_date, fine_amount, status, notes, created_at)
VALUES
  -- Active/Issued Transactions
  (
    'libt1000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'book1000-0000-0000-0000-000000000001', -- A Brief History of Time
    'std10000-0000-0000-0000-000000000001', -- Aarav Sharma
    NULL,
    '2025-12-15',
    '2026-01-14',
    NULL,
    0.00,
    'issued',
    'Student interested in cosmology',
    '2025-12-15 10:00:00'
  ),
  (
    'libt1000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'book1000-0000-0000-0000-000000000008', -- 1984
    'std10000-0000-0000-0000-000000000002', -- Diya Patel
    NULL,
    '2025-12-20',
    '2026-01-19',
    NULL,
    0.00,
    'issued',
    'Literature class assignment',
    '2025-12-20 11:30:00'
  ),
  (
    'libt1000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'book1000-0000-0000-0000-000000000017', -- Introduction to Algorithms
    'std10000-0000-0000-0000-000000000009', -- Advait Mehta
    NULL,
    '2025-12-18',
    '2026-01-17',
    NULL,
    0.00,
    'issued',
    'For computer science project',
    '2025-12-18 14:00:00'
  ),
  (
    'libt1000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'book1000-0000-0000-0000-000000000026', -- Harry Potter
    'std10000-0000-0000-0000-000000000003', -- Arjun Kumar
    NULL,
    '2025-12-22',
    '2026-01-21',
    NULL,
    0.00,
    'issued',
    'Recreational reading',
    '2025-12-22 09:00:00'
  ),
  
  -- Returned Transactions (On Time)
  (
    'libt1000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'book1000-0000-0000-0000-000000000011', -- Sapiens
    'std10000-0000-0000-0000-000000000005', -- Rohan Verma
    NULL,
    '2025-11-01',
    '2025-11-30',
    '2025-11-28',
    0.00,
    'returned',
    'Returned on time - excellent condition',
    '2025-11-01 10:30:00'
  ),
  (
    'libt1000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'book1000-0000-0000-0000-000000000007', -- To Kill a Mockingbird
    'std10000-0000-0000-0000-000000000006', -- Ishita Reddy
    NULL,
    '2025-10-15',
    '2025-11-14',
    '2025-11-10',
    0.00,
    'returned',
    'For English literature exam',
    '2025-10-15 11:00:00'
  ),
  (
    'libt1000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000001',
    'book1000-0000-0000-0000-000000000004', -- The Joy of x
    'std10000-0000-0000-0000-000000000004', -- Ananya Singh
    NULL,
    '2025-11-10',
    '2025-12-10',
    '2025-12-08',
    0.00,
    'returned',
    'Mathematics supplementary reading',
    '2025-11-10 14:20:00'
  ),
  (
    'libt1000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000001',
    'book1000-0000-0000-0000-000000000020', -- Steve Jobs Biography
    'std10000-0000-0000-0000-000000000010', -- Kiara Sharma
    NULL,
    '2025-09-01',
    '2025-09-30',
    '2025-09-25',
    0.00,
    'returned',
    'For biography project',
    '2025-09-01 10:00:00'
  ),
  
  -- Returned with Fine (Overdue)
  (
    'libt1000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000001',
    'book1000-0000-0000-0000-000000000015', -- The Odyssey
    'std10000-0000-0000-0000-000000000007', -- Vihaan Joshi
    NULL,
    '2025-10-01',
    '2025-10-31',
    '2025-11-08',
    80.00,
    'returned',
    'Returned 8 days late - Fine ₹10/day',
    '2025-10-01 13:00:00'
  ),
  (
    'libt1000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000001',
    'book1000-0000-0000-0000-000000000003', -- The Selfish Gene
    'std10000-0000-0000-0000-000000000008', -- Saanvi Chopra
    NULL,
    '2025-09-15',
    '2025-10-15',
    '2025-10-20',
    50.00,
    'returned',
    'Returned 5 days late - Fine ₹10/day',
    '2025-09-15 11:30:00'
  ),
  (
    'libt1000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    'book1000-0000-0000-0000-000000000027', -- Chronicles of Narnia
    'std10000-0000-0000-0000-000000000002', -- Diya Patel
    NULL,
    '2025-08-01',
    '2025-08-31',
    '2025-09-05',
    50.00,
    'returned',
    'Returned 5 days late',
    '2025-08-01 10:00:00'
  ),
  
  -- Currently Overdue
  (
    'libt1000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000001',
    'book1000-0000-0000-0000-000000000008', -- 1984
    'std10000-0000-0000-0000-000000000007', -- Vihaan Joshi
    NULL,
    '2025-11-15',
    '2025-12-15',
    NULL,
    170.00,
    'overdue',
    'Book overdue by 17 days - Follow up required',
    '2025-11-15 14:00:00'
  ),
  (
    'libt1000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000001',
    'book1000-0000-0000-0000-000000000013', -- Guns, Germs, and Steel
    'std10000-0000-0000-0000-000000000004', -- Ananya Singh
    NULL,
    '2025-11-20',
    '2025-12-20',
    NULL,
    120.00,
    'overdue',
    'Book overdue by 12 days',
    '2025-11-20 10:30:00'
  ),
  (
    'libt1000-0000-0000-0000-000000000014',
    '00000000-0000-0000-0000-000000000001',
    'book1000-0000-0000-0000-000000000022', -- Long Walk to Freedom
    'std10000-0000-0000-0000-000000000006', -- Ishita Reddy
    NULL,
    '2025-11-10',
    '2025-12-10',
    NULL,
    220.00,
    'overdue',
    'Book overdue by 22 days - Multiple reminders sent',
    '2025-11-10 11:00:00'
  ),
  
  -- Lost Book
  (
    'libt1000-0000-0000-0000-000000000015',
    '00000000-0000-0000-0000-000000000001',
    'book1000-0000-0000-0000-000000000030', -- The Alchemist
    'std10000-0000-0000-0000-000000000003', -- Arjun Kumar
    NULL,
    '2025-07-01',
    '2025-07-31',
    NULL,
    450.00,
    'lost',
    'Book reported lost - Replacement cost charged',
    '2025-07-01 10:00:00'
  ),
  
  -- More Recent Transactions
  (
    'libt1000-0000-0000-0000-000000000016',
    '00000000-0000-0000-0000-000000000001',
    'book1000-0000-0000-0000-000000000026', -- Harry Potter
    'std10000-0000-0000-0000-000000000005', -- Rohan Verma
    NULL,
    '2025-11-25',
    '2025-12-25',
    '2025-12-24',
    0.00,
    'returned',
    'Loved the book - requesting other books in series',
    '2025-11-25 09:30:00'
  ),
  (
    'libt1000-0000-0000-0000-000000000017',
    '00000000-0000-0000-0000-000000000001',
    'book1000-0000-0000-0000-000000000010', -- The Great Gatsby
    'std10000-0000-0000-0000-000000000010', -- Kiara Sharma
    NULL,
    '2025-12-01',
    '2025-12-31',
    '2025-12-28',
    0.00,
    'returned',
    'For English class essay',
    '2025-12-01 13:00:00'
  ),
  (
    'libt1000-0000-0000-0000-000000000018',
    '00000000-0000-0000-0000-000000000001',
    'book1000-0000-0000-0000-000000000007', -- To Kill a Mockingbird
    'std10000-0000-0000-0000-000000000009', -- Advait Mehta
    NULL,
    '2025-12-10',
    '2026-01-09',
    NULL,
    0.00,
    'issued',
    'Classic literature reading',
    '2025-12-10 10:00:00'
  ),
  (
    'libt1000-0000-0000-0000-000000000019',
    '00000000-0000-0000-0000-000000000001',
    'book1000-0000-0000-0000-000000000014', -- Complete Works of Shakespeare
    'std10000-0000-0000-0000-000000000008', -- Saanvi Chopra
    NULL,
    '2025-12-05',
    '2026-01-04',
    NULL,
    0.00,
    'issued',
    'For drama class',
    '2025-12-05 11:00:00'
  ),
  (
    'libt1000-0000-0000-0000-000000000020',
    '00000000-0000-0000-0000-000000000001',
    'book1000-0000-0000-0000-000000000027', -- Chronicles of Narnia
    'std10000-0000-0000-0000-000000000001', -- Aarav Sharma
    NULL,
    '2025-11-05',
    '2025-12-05',
    '2025-12-03',
    0.00,
    'returned',
    'Excellent fantasy series',
    '2025-11-05 14:30:00'
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- LIBRARY REPORTS
-- =====================================================

INSERT INTO library_reports (id, tenant_id, report_name, report_type, description, date_from, date_to, filters, status, generated_at, created_at)
VALUES
  -- Completed Reports
  (
    'rpt10000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'December 2025 Books Inventory',
    'books_inventory',
    'Complete inventory of all library books as of December 2025',
    NULL,
    NULL,
    '{"data": {"total_books": 30, "total_copies": 91, "available_copies": 78, "issued_copies": 6, "damaged_copies": 1, "by_category": {"Science": 4, "Mathematics": 3, "Fiction": 5, "History": 3, "Literature": 3, "Computer Science": 3, "Biography": 3, "Reference": 3, "Children": 3}}}',
    'completed',
    '2025-12-31 18:30:00',
    '2025-12-31 18:00:00'
  ),
  (
    'rpt10000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Currently Issued Books Report',
    'issued_books',
    'List of all currently issued books',
    '2025-12-01',
    '2025-12-31',
    '{"data": {"total_issued": 6, "books": [{"title": "A Brief History of Time", "student": "Aarav Sharma", "issued_date": "2025-12-15", "due_date": "2026-01-14"}, {"title": "1984", "student": "Diya Patel", "issued_date": "2025-12-20", "due_date": "2026-01-19"}, {"title": "Introduction to Algorithms", "student": "Advait Mehta", "issued_date": "2025-12-18", "due_date": "2026-01-17"}, {"title": "Harry Potter and the Philosopher Stone", "student": "Arjun Kumar", "issued_date": "2025-12-22", "due_date": "2026-01-21"}, {"title": "To Kill a Mockingbird", "student": "Advait Mehta", "issued_date": "2025-12-10", "due_date": "2026-01-09"}, {"title": "Complete Works of Shakespeare", "student": "Saanvi Chopra", "issued_date": "2025-12-05", "due_date": "2026-01-04"}]}}',
    'completed',
    '2026-01-01 09:00:00',
    '2026-01-01 08:45:00'
  ),
  (
    'rpt10000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Overdue Books - January 2026',
    'overdue_books',
    'Books that are currently overdue with fine calculations',
    '2025-11-01',
    '2026-01-04',
    '{"data": {"total_overdue": 5, "total_fines": 510.00, "books": [{"title": "1984", "student": "Vihaan Joshi", "issued_date": "2025-11-15", "due_date": "2025-12-15", "days_overdue": 17, "fine": 170.00}, {"title": "Guns, Germs, and Steel", "student": "Ananya Singh", "issued_date": "2025-11-20", "due_date": "2025-12-20", "days_overdue": 12, "fine": 120.00}, {"title": "Long Walk to Freedom", "student": "Ishita Reddy", "issued_date": "2025-11-10", "due_date": "2025-12-10", "days_overdue": 22, "fine": 220.00}]}}',
    'completed',
    '2026-01-04 10:00:00',
    '2026-01-04 09:30:00'
  ),
  (
    'rpt10000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'Q4 2025 Returned Books',
    'returned_books',
    'All books returned during Q4 2025',
    '2025-10-01',
    '2025-12-31',
    '{"data": {"total_returned": 8, "on_time": 5, "late": 3, "total_fines_collected": 180.00, "books": [{"title": "Sapiens", "student": "Rohan Verma", "return_date": "2025-11-28", "fine": 0.00}, {"title": "To Kill a Mockingbird", "student": "Ishita Reddy", "return_date": "2025-11-10", "fine": 0.00}, {"title": "The Joy of x", "student": "Ananya Singh", "return_date": "2025-12-08", "fine": 0.00}, {"title": "The Odyssey", "student": "Vihaan Joshi", "return_date": "2025-11-08", "fine": 80.00}, {"title": "The Selfish Gene", "student": "Saanvi Chopra", "return_date": "2025-10-20", "fine": 50.00}, {"title": "Chronicles of Narnia", "student": "Diya Patel", "return_date": "2025-09-05", "fine": 50.00}]}}',
    'completed',
    '2026-01-02 14:00:00',
    '2026-01-02 13:30:00'
  ),
  (
    'rpt10000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'Fine Collection Report - 2025',
    'fine_collection',
    'Total fine collection for the year 2025',
    '2025-01-01',
    '2025-12-31',
    '{"data": {"total_fines": 180.00, "total_transactions": 3, "by_month": {"August": 50.00, "September": 50.00, "November": 80.00}, "top_defaulters": [{"student": "Vihaan Joshi", "total_fine": 80.00}, {"student": "Saanvi Chopra", "total_fine": 50.00}, {"student": "Diya Patel", "total_fine": 50.00}]}}',
    'completed',
    '2026-01-03 11:00:00',
    '2026-01-03 10:30:00'
  ),
  (
    'rpt10000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'Most Popular Books - 2025',
    'popular_books',
    'Books with highest circulation in 2025',
    '2025-01-01',
    '2025-12-31',
    '{"category": "Fiction", "min_issues": 2}',
    'completed',
    '2026-01-03 15:00:00',
    '2026-01-03 14:45:00'
  ),
  (
    'rpt10000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000001',
    'Aarav Sharma - Borrowing History',
    'student_history',
    'Complete borrowing history for student Aarav Sharma',
    '2025-01-01',
    '2025-12-31',
    '{"student_id": "std10000-0000-0000-0000-000000000001"}',
    'completed',
    '2026-01-02 16:00:00',
    '2026-01-02 15:45:00'
  ),
  
  -- Draft Reports
  (
    'rpt10000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000001',
    'January 2026 Monthly Summary',
    'monthly_summary',
    'Monthly library operations summary for January 2026',
    '2026-01-01',
    '2026-01-31',
    '{}',
    'draft',
    NULL,
    '2026-01-04 08:00:00'
  ),
  (
    'rpt10000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000001',
    'Science Category Inventory',
    'books_inventory',
    'Inventory report for Science category books only',
    NULL,
    NULL,
    '{"category": "Science"}',
    'draft',
    NULL,
    '2026-01-03 17:00:00'
  ),
  (
    'rpt10000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000001',
    'Computer Science Books - Borrowing Trends',
    'popular_books',
    'Analysis of Computer Science category borrowing patterns',
    '2025-01-01',
    '2025-12-31',
    '{"category": "Computer Science"}',
    'draft',
    NULL,
    '2026-01-04 09:00:00'
  ),
  
  -- Generating Status
  (
    'rpt10000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    'Annual Summary 2025',
    'annual_summary',
    'Complete annual summary for library operations in 2025',
    '2025-01-01',
    '2025-12-31',
    '{}',
    'generating',
    NULL,
    '2026-01-04 10:30:00'
  ),
  (
    'rpt10000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000001',
    'Current Week Issued Books',
    'issued_books',
    'Books issued in the current week',
    '2025-12-29',
    '2026-01-04',
    '{}',
    'generating',
    NULL,
    '2026-01-04 11:00:00'
  ),
  
  -- Failed Report
  (
    'rpt10000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000001',
    'Lost Books Analysis',
    'student_history',
    'Analysis of lost books by student - FAILED due to missing student filter',
    '2025-01-01',
    '2025-12-31',
    '{}',
    'failed',
    NULL,
    '2026-01-02 12:00:00'
  ),
  
  -- Additional Completed Reports
  (
    'rpt10000-0000-0000-0000-000000000014',
    '00000000-0000-0000-0000-000000000001',
    'Children Category - December Activity',
    'issued_books',
    'Borrowing activity for Children category books in December',
    '2025-12-01',
    '2025-12-31',
    '{"category": "Children", "data": {"total_issued": 3, "books": [{"title": "Harry Potter and the Philosopher Stone", "issues": 2}, {"title": "Chronicles of Narnia", "issues": 1}]}}',
    'completed',
    '2026-01-01 16:00:00',
    '2026-01-01 15:30:00'
  ),
  (
    'rpt10000-0000-0000-0000-000000000015',
    '00000000-0000-0000-0000-000000000001',
    'Reference Books Usage',
    'books_inventory',
    'Status of reference books in library',
    NULL,
    NULL,
    '{"category": "Reference", "data": {"total_books": 3, "total_copies": 10, "available": 10, "never_issued": true}}',
    'completed',
    '2026-01-03 12:00:00',
    '2026-01-03 11:30:00'
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SUMMARY STATISTICS
-- =====================================================

-- Total Books: 30
-- Categories: Science (3), Mathematics (3), Fiction (4), History (3), 
--             Literature (3), Computer Science (3), Biography (3), 
--             Reference (3), Children (3), Damaged (1)
-- Total Copies: 91
-- Available Copies: 78

-- Total Transactions: 20
-- Issued: 6
-- Returned: 8
-- Overdue: 5
-- Lost: 1

-- Total Reports: 15
-- Completed: 9 (Books Inventory: 3, Issued Books: 3, Overdue: 1, Returned: 1, Fine Collection: 1)
-- Draft: 3
-- Generating: 2
-- Failed: 1
-- Report Types Covered: All 9 types represented

-- Notes:
-- - Current date is January 4, 2026
-- - Fine rate: ₹10 per day overdue
-- - Loan period: 30 days
-- - Books in good condition have varied shelf locations (A-I sections)
-- - Popular books have multiple copies
-- - Reference books generally have more copies
-- - Some students have borrowing history showing responsibility
-- - Reports include sample data showing various report types and statuses
-- - Completed reports contain generated data in filters JSONB field
-- - Draft reports ready to be generated
-- - Failed report demonstrates validation error handling
