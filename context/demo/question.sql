-- ============================================================
-- Demo Data — Shikkhok Pro
-- Supabase SQL Editor এ run করো
-- ============================================================


-- Step 2: Demo questions insert করো

INSERT INTO questions (id, "createdById", title, content, "contentType", subject, "className", chapter, topic, difficulty, "totalMarks", "timeMinutes", visibility, "aiGenerated", "likesCount", "commentsCount", "viewsCount")
VALUES

-- Question 1: SSC Math
(
  'q_demo_001',
  '3e44509c-e774-4575-9650-a03c965704af',
  'SSC Mathematics — Chapter 3: Algebra (Short Questions)',
  '{
    "sections": [
      {
        "title": "Section A: Multiple Choice (MCQ)",
        "marks": 10,
        "questions": [
          { "no": 1, "text": "If x² - 5x + 6 = 0, what are the values of x?", "options": ["A. 2, 3", "B. 1, 6", "C. -2, -3", "D. 3, 4"], "answer": "A" },
          { "no": 2, "text": "The HCF of 12, 18, and 24 is:", "options": ["A. 4", "B. 6", "C. 8", "D. 12"], "answer": "B" },
          { "no": 3, "text": "Which of the following is a perfect square?", "options": ["A. 50", "B. 75", "C. 81", "D. 90"], "answer": "C" },
          { "no": 4, "text": "If 2x + 3 = 11, then x =", "options": ["A. 2", "B. 3", "C. 4", "D. 5"], "answer": "C" },
          { "no": 5, "text": "The value of (a + b)² - (a - b)² is:", "options": ["A. 2ab", "B. 4ab", "C. a² - b²", "D. 2a²"], "answer": "B" }
        ]
      },
      {
        "title": "Section B: Short Questions",
        "marks": 20,
        "questions": [
          { "no": 6, "text": "Simplify: (3x² + 2x - 1) ÷ (x + 1)", "marks": 5 },
          { "no": 7, "text": "Factorize: x² - 7x + 12", "marks": 5 },
          { "no": 8, "text": "If α and β are roots of 2x² - 5x + 3 = 0, find the value of α² + β².", "marks": 10 }
        ]
      },
      {
        "title": "Section C: Creative Question",
        "marks": 20,
        "questions": [
          { "no": 9, "text": "A field is in the shape of a rectangle whose length is (2x + 3) meters and breadth is (x - 1) meters.\n\n(a) Write down the expression for the area of the field.\n(b) If x = 5, calculate the actual area.\n(c) If the perimeter of the field is 40 meters, find the value of x.\n(d) Prove that the diagonal of the field is always greater than its breadth.", "marks": 20 }
        ]
      }
    ]
  }',
  'MD',
  'Mathematics',
  'Class 10',
  'Chapter 3',
  'Algebra',
  'NORMAL',
  50,
  90,
  'PUBLIC',
  false,
  24,
  5,
  312
),

-- Question 2: HSC Physics
(
  'q_demo_002',
  '3e44509c-e774-4575-9650-a03c965704af',
  'HSC Physics — Newton''s Laws of Motion (Creative)',
  '{
    "sections": [
      {
        "title": "Creative Question",
        "marks": 10,
        "questions": [
          {
            "no": 1,
            "text": "A car of mass 1200 kg is moving at 72 km/h on a straight road. The driver applies brakes and the car stops after 5 seconds.\n\n(a) Convert 72 km/h to m/s.\n(b) Calculate the deceleration of the car.\n(c) Find the braking force applied.\n(d) If the road were wet and friction were halved, how long would it take to stop? Justify your answer.",
            "marks": 10
          }
        ]
      }
    ]
  }',
  'MD',
  'Physics',
  'Class 12',
  'Chapter 4',
  'Newton''s Laws of Motion',
  'HARD',
  10,
  20,
  'PUBLIC',
  false,
  41,
  8,
  589
),

-- Question 3: Class 8 Science
(
  'q_demo_003',
  '3e44509c-e774-4575-9650-a03c965704af',
  'Class 8 Science — Photosynthesis & Respiration',
  '{
    "sections": [
      {
        "title": "Section A: Fill in the Blanks",
        "marks": 5,
        "questions": [
          { "no": 1, "text": "The green pigment in plants is called ________.", "marks": 1 },
          { "no": 2, "text": "Photosynthesis takes place in the ________ of plant cells.", "marks": 1 },
          { "no": 3, "text": "The by-product of photosynthesis is ________.", "marks": 1 },
          { "no": 4, "text": "Cellular respiration releases energy in the form of ________.", "marks": 1 },
          { "no": 5, "text": "Anaerobic respiration in yeast produces ________ and CO₂.", "marks": 1 }
        ]
      },
      {
        "title": "Section B: Short Answer",
        "marks": 10,
        "questions": [
          { "no": 6, "text": "Write the chemical equation of photosynthesis and explain each component.", "marks": 5 },
          { "no": 7, "text": "What is the difference between aerobic and anaerobic respiration? Give one example of each.", "marks": 5 }
        ]
      },
      {
        "title": "Section C: Creative Question",
        "marks": 10,
        "questions": [
          { "no": 8, "text": "A student placed a water plant (Hydrilla) under bright sunlight and observed bubbles coming from it.\n\n(a) What gas is being released?\n(b) Write the word equation of photosynthesis.\n(c) What would happen if the plant were placed in darkness? Explain.\n(d) Evaluate the importance of photosynthesis for all living organisms on Earth.", "marks": 10 }
        ]
      }
    ]
  }',
  'MD',
  'Science',
  'Class 8',
  'Chapter 6',
  'Photosynthesis',
  'EASY',
  25,
  45,
  'PUBLIC',
  false,
  18,
  3,
  203
);
