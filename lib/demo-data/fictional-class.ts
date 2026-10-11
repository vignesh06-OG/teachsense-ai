import { AssessmentBatch } from "../validators/assessment-schema";

export const FICTIONAL_CLASSROOM_ASSESSMENT: AssessmentBatch = {
  assessmentId: "MATH-8-DIAG-01",
  assessmentTitle: "Grade 8 Mid-Term Diagnostic: Linear Equations & Rational Number Operations",
  subject: "Mathematics",
  gradeLevel: "8th Grade",
  questions: [
    {
      id: "Q1",
      prompt: "Solve for x: 2x + 5 = 15. Show your steps.",
      topic: "Two-Step Equations",
      standard: "CCSS.MATH.CONTENT.8.EE.C.7",
      correctAnswer: "x = 5",
      explanation: "Subtract 5 from both sides: 2x = 10. Divide by 2: x = 5.",
    },
    {
      id: "Q2",
      prompt: "Compute: 1/3 + 1/4. Express in simplest form.",
      topic: "Rational Number Operations",
      standard: "CCSS.MATH.CONTENT.7.NS.A.1",
      correctAnswer: "7/12",
      explanation: "Find common denominator 12: 4/12 + 3/12 = 7/12.",
    },
    {
      id: "Q3",
      prompt: "Solve for x: 3(x - 2) = 12. Show your work.",
      topic: "Distributive Property in Equations",
      standard: "CCSS.MATH.CONTENT.8.EE.C.7.B",
      correctAnswer: "x = 6",
      explanation: "Distribute 3: 3x - 6 = 12. Add 6: 3x = 18. Divide by 3: x = 6.",
    },
    {
      id: "Q4",
      prompt: "Compare: Which is greater, -8 or -3? Explain why using a number line.",
      topic: "Integers and Order",
      standard: "CCSS.MATH.CONTENT.6.NS.C.7",
      correctAnswer: "-3",
      explanation: "-3 lies to the right of -8 on the number line, representing a greater value.",
    },
  ],
  submissions: [
    {
      studentId: "STU-001",
      studentName: "Alex Rivera (Demo)",
      answers: [
        {
          questionId: "Q1",
          studentAnswer: "x = 10",
          workShown: "2x + 5 = 15 => 2x = 20 => x = 10",
        },
        {
          questionId: "Q2",
          studentAnswer: "2/7",
          workShown: "1+1=2 on top, 3+4=7 on bottom, so 2/7",
        },
        {
          questionId: "Q3",
          studentAnswer: "x = 6",
          workShown: "3x - 6 = 12 => 3x = 18 => x = 6",
        },
        {
          questionId: "Q4",
          studentAnswer: "-3",
          workShown: "-3 is closer to 0 than -8",
        },
      ],
    },
    {
      studentId: "STU-002",
      studentName: "Jordan Blake (Demo)",
      answers: [
        {
          questionId: "Q1",
          studentAnswer: "x = 10",
          workShown: "Added 5 to both sides: 2x = 20, then divided by 2 gives 10",
        },
        {
          questionId: "Q2",
          studentAnswer: "7/12",
          workShown: "4/12 + 3/12 = 7/12",
        },
        {
          questionId: "Q3",
          studentAnswer: "x = 4.67",
          workShown: "3x - 2 = 12 => 3x = 14 => x = 14/3",
        },
        {
          questionId: "Q4",
          studentAnswer: "-8",
          workShown: "8 is bigger than 3 so -8 is bigger",
        },
      ],
    },
    {
      studentId: "STU-003",
      studentName: "Casey Chen (Demo)",
      answers: [
        {
          questionId: "Q1",
          studentAnswer: "x = 5",
          workShown: "2x = 10 => x = 5",
        },
        {
          questionId: "Q2",
          studentAnswer: "2/7",
          workShown: "Added numerators (1+1) and denominators (3+4) = 2/7",
        },
        {
          questionId: "Q3",
          studentAnswer: "x = 4.67",
          workShown: "3x - 2 = 12 => 3x = 14 => x = 14/3",
        },
        {
          questionId: "Q4",
          studentAnswer: "-3",
          workShown: "negative 3 is greater",
        },
      ],
    },
    {
      studentId: "STU-004",
      studentName: "Morgan Davis (Demo)",
      answers: [
        {
          questionId: "Q1",
          studentAnswer: "x = 10",
          workShown: "2x = 15 + 5 = 20 => x = 10",
        },
        {
          questionId: "Q2",
          studentAnswer: "2/7",
          workShown: "Combined numerator 2 over combined denominator 7",
        },
        {
          questionId: "Q3",
          studentAnswer: "x = 6",
          workShown: "3x - 6 = 12 => 3x = 18 => x = 6",
        },
        {
          questionId: "Q4",
          studentAnswer: "-8",
          workShown: "Because 8 > 3",
        },
      ],
    },
    {
      studentId: "STU-005",
      studentName: "Taylor Brooks (Demo)",
      answers: [
        {
          questionId: "Q1",
          studentAnswer: "x = 5",
          workShown: "2x = 10 => x = 5",
        },
        {
          questionId: "Q2",
          studentAnswer: "7/12",
          workShown: "Common denominator is 12, 4/12 + 3/12 = 7/12",
        },
        {
          questionId: "Q3",
          studentAnswer: "x = 4.67",
          workShown: "3x - 2 = 12 => 3x = 14",
        },
        {
          questionId: "Q4",
          studentAnswer: "-3",
          workShown: "-3 is further right on the number line",
        },
      ],
    },
    {
      studentId: "STU-006",
      studentName: "Samira Patel (Demo)",
      answers: [
        {
          questionId: "Q1",
          studentAnswer: "x = 10",
          workShown: "2x = 20 => x = 10",
        },
        {
          questionId: "Q2",
          studentAnswer: "7/12",
          workShown: "Calculated with LCD 12",
        },
        {
          questionId: "Q3",
          studentAnswer: "x = 6",
          workShown: "3(x-2)=12 => x-2=4 => x=6",
        },
        {
          questionId: "Q4",
          studentAnswer: "-3",
          workShown: "-3 degrees is warmer than -8",
        },
      ],
    },
    {
      studentId: "STU-007",
      studentName: "Riley Washington (Demo)",
      answers: [
        {
          questionId: "Q1",
          studentAnswer: "x = 7", // An ambiguous response that requires review!
          workShown: "Tried guessing numbers, 2*7=14 + 1? Maybe 7.",
        },
        {
          questionId: "Q2",
          studentAnswer: "2/7",
          workShown: "1+1=2, 3+4=7",
        },
        {
          questionId: "Q3",
          studentAnswer: "x = 4.67",
          workShown: "3x - 2 = 12 => 3x = 14",
        },
        {
          questionId: "Q4",
          studentAnswer: "-8",
          workShown: "8 is larger magnitude",
        },
      ],
    },
    {
      studentId: "STU-008",
      studentName: "Quinn O'Connor (Demo)",
      answers: [
        {
          questionId: "Q1",
          studentAnswer: "x = 5",
          workShown: "Subtract 5 then divide by 2",
        },
        {
          questionId: "Q2",
          studentAnswer: "7/12",
          workShown: "Converted to twelfths",
        },
        {
          questionId: "Q3",
          studentAnswer: "x = 6",
          workShown: "3x - 6 = 12 => x = 6",
        },
        {
          questionId: "Q4",
          studentAnswer: "-3",
          workShown: "Rightmost on number line",
        },
      ],
    },
    {
      studentId: "STU-009",
      studentName: "Avery Martinez (Demo)",
      answers: [
        {
          questionId: "Q1",
          studentAnswer: "x = 10",
          workShown: "Moved 5 to other side with plus: 15+5=20 => x=10",
        },
        {
          questionId: "Q2",
          studentAnswer: "2/7",
          workShown: "1/3 + 1/4 = 2/7",
        },
        {
          questionId: "Q3",
          studentAnswer: "x = 4.67",
          workShown: "Did not multiply the -2: 3x - 2 = 12",
        },
        {
          questionId: "Q4",
          studentAnswer: "-8",
          workShown: "8 is higher than 3",
        },
      ],
    },
    {
      studentId: "STU-010",
      studentName: "Dakota Lee (Demo)",
      answers: [
        {
          questionId: "Q1",
          studentAnswer: "x = 5",
          workShown: "2x = 10 => x = 5",
        },
        {
          questionId: "Q2",
          studentAnswer: "1/12", // Arithmetic / confusion error
          workShown: "Subtract instead of add: 4/12 - 3/12 = 1/12",
        },
        {
          questionId: "Q3",
          studentAnswer: "x = 6",
          workShown: "3x - 6 = 12 => x = 6",
        },
        {
          questionId: "Q4",
          studentAnswer: "-3",
          workShown: "-3 is greater than -8",
        },
      ],
    },
  ],
};

// Known Misconception Taxonomy Dictionary
export const KNOWN_MISCONCEPTIONS = {
  INVERSE_OP_SIGN_FLIP: {
    tag: "INVERSE_OP_SIGN_FLIP",
    label: "Inverse Operation Sign Confusion",
    topic: "Two-Step Equations",
    description:
      "Student adds instead of subtracting (or subtracts instead of adding) when isolating variable terms across the equals sign.",
    correctiveStrategy:
      "Reinforce the visual balance scale metaphor. Applying the exact inverse operation preserves equality.",
  },
  ADD_ACROSS_FRACTION_FALLACY: {
    tag: "ADD_ACROSS_FRACTION_FALLACY",
    label: "Add-Across Numerator & Denominator Fallacy",
    topic: "Rational Numbers",
    description:
      "Student adds numerators together and denominators together directly (a/b + c/d = (a+c)/(b+d)) without finding a common unit denominator.",
    correctiveStrategy:
      "Use fraction tile area models. Demonstrate that adding 1/3 and 1/4 represents parts of different sizes that cannot be counted together until partitioned into equal slices (twelfths).",
  },
  DISTRIBUTION_DROP: {
    tag: "DISTRIBUTION_DROP",
    label: "Incomplete Term Distribution",
    topic: "Distributive Property",
    description:
      "Student multiplies the outside factor by only the first variable term, leaving the constant term undistributed (e.g., 3(x - 2) -> 3x - 2).",
    correctiveStrategy:
      "Use geometric area rectangles (width 3, length x and -2) to make visible that 3 scales every component inside the parentheses.",
  },
  NEGATIVE_MAGNITUDE_CONFUSION: {
    tag: "NEGATIVE_MAGNITUDE_CONFUSION",
    label: "Negative Integer Magnitude Dominance",
    topic: "Integers & Ordering",
    description:
      "Student assumes that because absolute value |-8| > |-3|, -8 must be greater than -3, confusing numerical magnitude with relative position.",
    correctiveStrategy:
      "Anchor to debt vs wealth or elevation/temperature metaphors. A debt of $3 leaves you with more money than a debt of $8.",
  },
  UNKNOWN_AMBIGUOUS: {
    tag: "UNKNOWN_AMBIGUOUS",
    label: "Uncertain / Unclassified Error Pattern",
    topic: "General",
    description: "The student's error does not match an established cognitive pattern with sufficient confidence.",
    correctiveStrategy: "Requires 1-on-1 diagnostic questioning by teacher.",
  },
};
