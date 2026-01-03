-- =====================================================
-- SUBJECTS MANAGEMENT TEST DATA
-- =====================================================
-- This file contains comprehensive test data for subjects and class-subject mappings
-- Run this after academic_test_data.sql (which creates classes)

-- Prerequisites:
-- 1. Tenant must exist (from initial setup)
-- 2. Classes must exist (from academic_test_data.sql)
-- 3. Update tenant_id and class IDs according to your database

-- =====================================================
-- SETUP VARIABLES
-- =====================================================
-- Replace these with your actual IDs from the database
DO $$
DECLARE
  v_tenant_id UUID;
  v_class_1_id UUID;
  v_class_2_id UUID;
  v_class_3_id UUID;
  v_class_4_id UUID;
  v_class_5_id UUID;
  v_class_6_id UUID;
  v_class_7_id UUID;
  v_class_8_id UUID;
  v_class_9_id UUID;
  v_class_10_id UUID;
  
  v_subject_math_id UUID;
  v_subject_english_id UUID;
  v_subject_science_id UUID;
  v_subject_social_id UUID;
  v_subject_hindi_id UUID;
  v_subject_cs_id UUID;
  v_subject_pe_id UUID;
  v_subject_art_id UUID;
  v_subject_music_id UUID;
  v_subject_evs_id UUID;
  v_subject_physics_id UUID;
  v_subject_chemistry_id UUID;
  v_subject_biology_id UUID;
  v_subject_history_id UUID;
  v_subject_geography_id UUID;
  v_subject_economics_id UUID;
  v_subject_sanskrit_id UUID;
  v_subject_french_id UUID;
BEGIN
  -- Get tenant_id (assuming first tenant)
  SELECT id INTO v_tenant_id FROM tenants LIMIT 1;
  
  -- Get class IDs by name
  SELECT id INTO v_class_1_id FROM classes WHERE tenant_id = v_tenant_id AND name = 'Class 1' LIMIT 1;
  SELECT id INTO v_class_2_id FROM classes WHERE tenant_id = v_tenant_id AND name = 'Class 2' LIMIT 1;
  SELECT id INTO v_class_3_id FROM classes WHERE tenant_id = v_tenant_id AND name = 'Class 3' LIMIT 1;
  SELECT id INTO v_class_4_id FROM classes WHERE tenant_id = v_tenant_id AND name = 'Class 4' LIMIT 1;
  SELECT id INTO v_class_5_id FROM classes WHERE tenant_id = v_tenant_id AND name = 'Class 5' LIMIT 1;
  SELECT id INTO v_class_6_id FROM classes WHERE tenant_id = v_tenant_id AND name = 'Class 6' LIMIT 1;
  SELECT id INTO v_class_7_id FROM classes WHERE tenant_id = v_tenant_id AND name = 'Class 7' LIMIT 1;
  SELECT id INTO v_class_8_id FROM classes WHERE tenant_id = v_tenant_id AND name = 'Class 8' LIMIT 1;
  SELECT id INTO v_class_9_id FROM classes WHERE tenant_id = v_tenant_id AND name = 'Class 9' LIMIT 1;
  SELECT id INTO v_class_10_id FROM classes WHERE tenant_id = v_tenant_id AND name = 'Class 10' LIMIT 1;
  
  RAISE NOTICE 'Using tenant_id: %', v_tenant_id;
  
  -- =====================================================
  -- INSERT SUBJECTS
  -- =====================================================
  
  -- Core Academic Subjects
  INSERT INTO subjects (tenant_id, name, code, description, created_at)
  VALUES 
    (v_tenant_id, 'Mathematics', 'MATH', 'Study of numbers, quantities, shapes, and patterns', NOW()),
    (v_tenant_id, 'English', 'ENG', 'English language, literature, and communication skills', NOW()),
    (v_tenant_id, 'Science', 'SCI', 'General science covering physics, chemistry, and biology basics', NOW()),
    (v_tenant_id, 'Social Studies', 'SST', 'History, geography, civics, and social awareness', NOW()),
    (v_tenant_id, 'Hindi', 'HIN', 'Hindi language and literature', NOW())
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_subject_math_id, v_subject_english_id, v_subject_science_id, v_subject_social_id, v_subject_hindi_id;
  
  -- If subjects already exist, get their IDs
  IF v_subject_math_id IS NULL THEN
    SELECT id INTO v_subject_math_id FROM subjects WHERE tenant_id = v_tenant_id AND code = 'MATH' LIMIT 1;
    SELECT id INTO v_subject_english_id FROM subjects WHERE tenant_id = v_tenant_id AND code = 'ENG' LIMIT 1;
    SELECT id INTO v_subject_science_id FROM subjects WHERE tenant_id = v_tenant_id AND code = 'SCI' LIMIT 1;
    SELECT id INTO v_subject_social_id FROM subjects WHERE tenant_id = v_tenant_id AND code = 'SST' LIMIT 1;
    SELECT id INTO v_subject_hindi_id FROM subjects WHERE tenant_id = v_tenant_id AND code = 'HIN' LIMIT 1;
  END IF;
  
  -- Advanced Science Subjects (for higher classes)
  INSERT INTO subjects (tenant_id, name, code, description, created_at)
  VALUES 
    (v_tenant_id, 'Physics', 'PHY', 'Study of matter, energy, and their interactions', NOW()),
    (v_tenant_id, 'Chemistry', 'CHEM', 'Study of substances, their properties, and reactions', NOW()),
    (v_tenant_id, 'Biology', 'BIO', 'Study of living organisms and life processes', NOW())
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_subject_physics_id, v_subject_chemistry_id, v_subject_biology_id;
  
  IF v_subject_physics_id IS NULL THEN
    SELECT id INTO v_subject_physics_id FROM subjects WHERE tenant_id = v_tenant_id AND code = 'PHY' LIMIT 1;
    SELECT id INTO v_subject_chemistry_id FROM subjects WHERE tenant_id = v_tenant_id AND code = 'CHEM' LIMIT 1;
    SELECT id INTO v_subject_biology_id FROM subjects WHERE tenant_id = v_tenant_id AND code = 'BIO' LIMIT 1;
  END IF;
  
  -- Social Science Subjects (for higher classes)
  INSERT INTO subjects (tenant_id, name, code, description, created_at)
  VALUES 
    (v_tenant_id, 'History', 'HIST', 'Study of past events and civilizations', NOW()),
    (v_tenant_id, 'Geography', 'GEO', 'Study of Earth, its features, and human interaction', NOW()),
    (v_tenant_id, 'Economics', 'ECO', 'Study of production, distribution, and consumption of goods', NOW())
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_subject_history_id, v_subject_geography_id, v_subject_economics_id;
  
  IF v_subject_history_id IS NULL THEN
    SELECT id INTO v_subject_history_id FROM subjects WHERE tenant_id = v_tenant_id AND code = 'HIST' LIMIT 1;
    SELECT id INTO v_subject_geography_id FROM subjects WHERE tenant_id = v_tenant_id AND code = 'GEO' LIMIT 1;
    SELECT id INTO v_subject_economics_id FROM subjects WHERE tenant_id = v_tenant_id AND code = 'ECO' LIMIT 1;
  END IF;
  
  -- Co-curricular Subjects
  INSERT INTO subjects (tenant_id, name, code, description, created_at)
  VALUES 
    (v_tenant_id, 'Computer Science', 'CS', 'Programming, software, and information technology', NOW()),
    (v_tenant_id, 'Physical Education', 'PE', 'Sports, fitness, and physical health', NOW()),
    (v_tenant_id, 'Art & Craft', 'ART', 'Drawing, painting, and creative arts', NOW()),
    (v_tenant_id, 'Music', 'MUS', 'Vocal and instrumental music education', NOW()),
    (v_tenant_id, 'Environmental Studies', 'EVS', 'Study of environment and nature for young learners', NOW())
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_subject_cs_id, v_subject_pe_id, v_subject_art_id, v_subject_music_id, v_subject_evs_id;
  
  IF v_subject_cs_id IS NULL THEN
    SELECT id INTO v_subject_cs_id FROM subjects WHERE tenant_id = v_tenant_id AND code = 'CS' LIMIT 1;
    SELECT id INTO v_subject_pe_id FROM subjects WHERE tenant_id = v_tenant_id AND code = 'PE' LIMIT 1;
    SELECT id INTO v_subject_art_id FROM subjects WHERE tenant_id = v_tenant_id AND code = 'ART' LIMIT 1;
    SELECT id INTO v_subject_music_id FROM subjects WHERE tenant_id = v_tenant_id AND code = 'MUS' LIMIT 1;
    SELECT id INTO v_subject_evs_id FROM subjects WHERE tenant_id = v_tenant_id AND code = 'EVS' LIMIT 1;
  END IF;
  
  -- Additional Language Subjects
  INSERT INTO subjects (tenant_id, name, code, description, created_at)
  VALUES 
    (v_tenant_id, 'Sanskrit', 'SKT', 'Ancient Indian language and literature', NOW()),
    (v_tenant_id, 'French', 'FRE', 'French language and culture', NOW())
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_subject_sanskrit_id, v_subject_french_id;
  
  IF v_subject_sanskrit_id IS NULL THEN
    SELECT id INTO v_subject_sanskrit_id FROM subjects WHERE tenant_id = v_tenant_id AND code = 'SKT' LIMIT 1;
    SELECT id INTO v_subject_french_id FROM subjects WHERE tenant_id = v_tenant_id AND code = 'FRE' LIMIT 1;
  END IF;
  
  RAISE NOTICE 'Subjects inserted successfully';
  
  -- =====================================================
  -- MAP SUBJECTS TO CLASSES
  -- =====================================================
  
  -- Class 1 & 2: Elementary subjects (EVS instead of separate science/social)
  IF v_class_1_id IS NOT NULL THEN
    INSERT INTO class_subjects (tenant_id, class_id, subject_id, created_at)
    VALUES 
      (v_tenant_id, v_class_1_id, v_subject_math_id, NOW()),
      (v_tenant_id, v_class_1_id, v_subject_english_id, NOW()),
      (v_tenant_id, v_class_1_id, v_subject_hindi_id, NOW()),
      (v_tenant_id, v_class_1_id, v_subject_evs_id, NOW()),
      (v_tenant_id, v_class_1_id, v_subject_pe_id, NOW()),
      (v_tenant_id, v_class_1_id, v_subject_art_id, NOW()),
      (v_tenant_id, v_class_1_id, v_subject_music_id, NOW())
    ON CONFLICT (class_id, subject_id) DO NOTHING;
    RAISE NOTICE 'Class 1 subjects mapped';
  END IF;
  
  IF v_class_2_id IS NOT NULL THEN
    INSERT INTO class_subjects (tenant_id, class_id, subject_id, created_at)
    VALUES 
      (v_tenant_id, v_class_2_id, v_subject_math_id, NOW()),
      (v_tenant_id, v_class_2_id, v_subject_english_id, NOW()),
      (v_tenant_id, v_class_2_id, v_subject_hindi_id, NOW()),
      (v_tenant_id, v_class_2_id, v_subject_evs_id, NOW()),
      (v_tenant_id, v_class_2_id, v_subject_pe_id, NOW()),
      (v_tenant_id, v_class_2_id, v_subject_art_id, NOW()),
      (v_tenant_id, v_class_2_id, v_subject_music_id, NOW())
    ON CONFLICT (class_id, subject_id) DO NOTHING;
    RAISE NOTICE 'Class 2 subjects mapped';
  END IF;
  
  -- Class 3, 4, 5: Introduce Science and Social Studies
  IF v_class_3_id IS NOT NULL THEN
    INSERT INTO class_subjects (tenant_id, class_id, subject_id, created_at)
    VALUES 
      (v_tenant_id, v_class_3_id, v_subject_math_id, NOW()),
      (v_tenant_id, v_class_3_id, v_subject_english_id, NOW()),
      (v_tenant_id, v_class_3_id, v_subject_hindi_id, NOW()),
      (v_tenant_id, v_class_3_id, v_subject_science_id, NOW()),
      (v_tenant_id, v_class_3_id, v_subject_social_id, NOW()),
      (v_tenant_id, v_class_3_id, v_subject_cs_id, NOW()),
      (v_tenant_id, v_class_3_id, v_subject_pe_id, NOW()),
      (v_tenant_id, v_class_3_id, v_subject_art_id, NOW()),
      (v_tenant_id, v_class_3_id, v_subject_music_id, NOW())
    ON CONFLICT (class_id, subject_id) DO NOTHING;
    RAISE NOTICE 'Class 3 subjects mapped';
  END IF;
  
  IF v_class_4_id IS NOT NULL THEN
    INSERT INTO class_subjects (tenant_id, class_id, subject_id, created_at)
    VALUES 
      (v_tenant_id, v_class_4_id, v_subject_math_id, NOW()),
      (v_tenant_id, v_class_4_id, v_subject_english_id, NOW()),
      (v_tenant_id, v_class_4_id, v_subject_hindi_id, NOW()),
      (v_tenant_id, v_class_4_id, v_subject_science_id, NOW()),
      (v_tenant_id, v_class_4_id, v_subject_social_id, NOW()),
      (v_tenant_id, v_class_4_id, v_subject_cs_id, NOW()),
      (v_tenant_id, v_class_4_id, v_subject_pe_id, NOW()),
      (v_tenant_id, v_class_4_id, v_subject_art_id, NOW()),
      (v_tenant_id, v_class_4_id, v_subject_music_id, NOW())
    ON CONFLICT (class_id, subject_id) DO NOTHING;
    RAISE NOTICE 'Class 4 subjects mapped';
  END IF;
  
  IF v_class_5_id IS NOT NULL THEN
    INSERT INTO class_subjects (tenant_id, class_id, subject_id, created_at)
    VALUES 
      (v_tenant_id, v_class_5_id, v_subject_math_id, NOW()),
      (v_tenant_id, v_class_5_id, v_subject_english_id, NOW()),
      (v_tenant_id, v_class_5_id, v_subject_hindi_id, NOW()),
      (v_tenant_id, v_class_5_id, v_subject_science_id, NOW()),
      (v_tenant_id, v_class_5_id, v_subject_social_id, NOW()),
      (v_tenant_id, v_class_5_id, v_subject_cs_id, NOW()),
      (v_tenant_id, v_class_5_id, v_subject_pe_id, NOW()),
      (v_tenant_id, v_class_5_id, v_subject_art_id, NOW()),
      (v_tenant_id, v_class_5_id, v_subject_music_id, NOW()),
      (v_tenant_id, v_class_5_id, v_subject_sanskrit_id, NOW())
    ON CONFLICT (class_id, subject_id) DO NOTHING;
    RAISE NOTICE 'Class 5 subjects mapped';
  END IF;
  
  -- Class 6, 7, 8: Middle school with more subjects
  IF v_class_6_id IS NOT NULL THEN
    INSERT INTO class_subjects (tenant_id, class_id, subject_id, created_at)
    VALUES 
      (v_tenant_id, v_class_6_id, v_subject_math_id, NOW()),
      (v_tenant_id, v_class_6_id, v_subject_english_id, NOW()),
      (v_tenant_id, v_class_6_id, v_subject_hindi_id, NOW()),
      (v_tenant_id, v_class_6_id, v_subject_science_id, NOW()),
      (v_tenant_id, v_class_6_id, v_subject_social_id, NOW()),
      (v_tenant_id, v_class_6_id, v_subject_cs_id, NOW()),
      (v_tenant_id, v_class_6_id, v_subject_pe_id, NOW()),
      (v_tenant_id, v_class_6_id, v_subject_art_id, NOW()),
      (v_tenant_id, v_class_6_id, v_subject_sanskrit_id, NOW())
    ON CONFLICT (class_id, subject_id) DO NOTHING;
    RAISE NOTICE 'Class 6 subjects mapped';
  END IF;
  
  IF v_class_7_id IS NOT NULL THEN
    INSERT INTO class_subjects (tenant_id, class_id, subject_id, created_at)
    VALUES 
      (v_tenant_id, v_class_7_id, v_subject_math_id, NOW()),
      (v_tenant_id, v_class_7_id, v_subject_english_id, NOW()),
      (v_tenant_id, v_class_7_id, v_subject_hindi_id, NOW()),
      (v_tenant_id, v_class_7_id, v_subject_science_id, NOW()),
      (v_tenant_id, v_class_7_id, v_subject_social_id, NOW()),
      (v_tenant_id, v_class_7_id, v_subject_cs_id, NOW()),
      (v_tenant_id, v_class_7_id, v_subject_pe_id, NOW()),
      (v_tenant_id, v_class_7_id, v_subject_art_id, NOW()),
      (v_tenant_id, v_class_7_id, v_subject_sanskrit_id, NOW())
    ON CONFLICT (class_id, subject_id) DO NOTHING;
    RAISE NOTICE 'Class 7 subjects mapped';
  END IF;
  
  IF v_class_8_id IS NOT NULL THEN
    INSERT INTO class_subjects (tenant_id, class_id, subject_id, created_at)
    VALUES 
      (v_tenant_id, v_class_8_id, v_subject_math_id, NOW()),
      (v_tenant_id, v_class_8_id, v_subject_english_id, NOW()),
      (v_tenant_id, v_class_8_id, v_subject_hindi_id, NOW()),
      (v_tenant_id, v_class_8_id, v_subject_science_id, NOW()),
      (v_tenant_id, v_class_8_id, v_subject_social_id, NOW()),
      (v_tenant_id, v_class_8_id, v_subject_cs_id, NOW()),
      (v_tenant_id, v_class_8_id, v_subject_pe_id, NOW()),
      (v_tenant_id, v_class_8_id, v_subject_art_id, NOW()),
      (v_tenant_id, v_class_8_id, v_subject_sanskrit_id, NOW()),
      (v_tenant_id, v_class_8_id, v_subject_french_id, NOW())
    ON CONFLICT (class_id, subject_id) DO NOTHING;
    RAISE NOTICE 'Class 8 subjects mapped';
  END IF;
  
  -- Class 9 & 10: High school with specialized subjects
  IF v_class_9_id IS NOT NULL THEN
    INSERT INTO class_subjects (tenant_id, class_id, subject_id, created_at)
    VALUES 
      (v_tenant_id, v_class_9_id, v_subject_math_id, NOW()),
      (v_tenant_id, v_class_9_id, v_subject_english_id, NOW()),
      (v_tenant_id, v_class_9_id, v_subject_hindi_id, NOW()),
      (v_tenant_id, v_class_9_id, v_subject_physics_id, NOW()),
      (v_tenant_id, v_class_9_id, v_subject_chemistry_id, NOW()),
      (v_tenant_id, v_class_9_id, v_subject_biology_id, NOW()),
      (v_tenant_id, v_class_9_id, v_subject_history_id, NOW()),
      (v_tenant_id, v_class_9_id, v_subject_geography_id, NOW()),
      (v_tenant_id, v_class_9_id, v_subject_economics_id, NOW()),
      (v_tenant_id, v_class_9_id, v_subject_cs_id, NOW()),
      (v_tenant_id, v_class_9_id, v_subject_pe_id, NOW()),
      (v_tenant_id, v_class_9_id, v_subject_sanskrit_id, NOW())
    ON CONFLICT (class_id, subject_id) DO NOTHING;
    RAISE NOTICE 'Class 9 subjects mapped';
  END IF;
  
  IF v_class_10_id IS NOT NULL THEN
    INSERT INTO class_subjects (tenant_id, class_id, subject_id, created_at)
    VALUES 
      (v_tenant_id, v_class_10_id, v_subject_math_id, NOW()),
      (v_tenant_id, v_class_10_id, v_subject_english_id, NOW()),
      (v_tenant_id, v_class_10_id, v_subject_hindi_id, NOW()),
      (v_tenant_id, v_class_10_id, v_subject_physics_id, NOW()),
      (v_tenant_id, v_class_10_id, v_subject_chemistry_id, NOW()),
      (v_tenant_id, v_class_10_id, v_subject_biology_id, NOW()),
      (v_tenant_id, v_class_10_id, v_subject_history_id, NOW()),
      (v_tenant_id, v_class_10_id, v_subject_geography_id, NOW()),
      (v_tenant_id, v_class_10_id, v_subject_economics_id, NOW()),
      (v_tenant_id, v_class_10_id, v_subject_cs_id, NOW()),
      (v_tenant_id, v_class_10_id, v_subject_pe_id, NOW()),
      (v_tenant_id, v_class_10_id, v_subject_sanskrit_id, NOW())
    ON CONFLICT (class_id, subject_id) DO NOTHING;
    RAISE NOTICE 'Class 10 subjects mapped';
  END IF;
  
  RAISE NOTICE 'All subject-class mappings completed successfully!';
  
END $$;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify the data was inserted correctly

-- Check total subjects created
-- SELECT COUNT(*) as total_subjects FROM subjects;

-- Check subjects with their assigned class count
-- SELECT 
--   s.code,
--   s.name,
--   COUNT(cs.class_id) as assigned_to_classes
-- FROM subjects s
-- LEFT JOIN class_subjects cs ON s.id = cs.subject_id
-- GROUP BY s.id, s.code, s.name
-- ORDER BY s.code;

-- Check subjects for a specific class
-- SELECT 
--   c.name as class_name,
--   s.code as subject_code,
--   s.name as subject_name
-- FROM classes c
-- JOIN class_subjects cs ON c.id = cs.class_id
-- JOIN subjects s ON cs.subject_id = s.id
-- WHERE c.name = 'Class 9'
-- ORDER BY s.code;

-- Check which classes have a specific subject
-- SELECT 
--   s.name as subject_name,
--   c.name as class_name
-- FROM subjects s
-- JOIN class_subjects cs ON s.id = cs.subject_id
-- JOIN classes c ON cs.class_id = c.id
-- WHERE s.code = 'MATH'
-- ORDER BY c.name;
