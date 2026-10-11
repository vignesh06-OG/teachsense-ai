import {
  StudentGroup,
  RemedialMaterial,
} from "../validators/assessment-schema";

/**
 * Generates targeted remedial learning materials for a specific student cohort.
 * Operates offline with structured pedagogical templates, maintaining a strict
 * teacher approval gate (`approvalStatus: 'pending'`).
 */
export function generateRemedialMaterialForGroup(group: StudentGroup): RemedialMaterial {
  switch (group.misconceptionTag) {
    case "INVERSE_OP_SIGN_FLIP":
      return {
        id: `MAT-${group.id}`,
        groupId: group.id,
        groupName: group.name,
        misconceptionTag: group.misconceptionTag,
        title: "Mastering Inverse Operations & The Equality Balance Scale",
        targetConcept: "Undoing Addition and Subtraction in Linear Equations",
        conceptualReframing:
          "An equation is a balanced scale. To isolate the variable term, we must apply the opposite (inverse) operation to BOTH sides. If you see + 5, the undoing move is - 5, never + 5.",
        counterExamples: [
          {
            flawedThinking: "2x + 5 = 15 => 2x = 15 + 5 = 20 => x = 10 (Adding 5 because 5 is positive)",
            correctedApproach: "2x + 5 = 15 => 2x + 5 - 5 = 15 - 5 => 2x = 10 => x = 5",
            explanation:
              "Adding 5 tipped the scale from 15 to 20 instead of neutralizing the +5 constant term. Subtracting 5 restores zero-balance.",
          },
        ],
        scaffoldedPractice: [
          {
            problem: "Solve: 3x + 7 = 22. What is the first inverse operation you will apply?",
            hint: "Look at the constant term +7. What operation undoes adding 7?",
            solution: "Subtract 7 from both sides: 3x = 15. Then divide by 3: x = 5.",
          },
          {
            problem: "Solve: 4y - 6 = 18. Watch out for the minus sign!",
            hint: "The constant term is -6. What is the inverse of subtracting 6?",
            solution: "Add 6 to both sides: 4y = 24. Divide by 4: y = 6.",
          },
        ],
        exitTicketQuestion: {
          prompt: "Which step correctly isolates 5x in the equation 5x + 9 = 24?",
          options: [
            "A) 5x = 24 + 9 = 33",
            "B) 5x = 24 - 9 = 15",
            "C) 5x = 24 / 9",
            "D) x = 24 - 9 - 5 = 10",
          ],
          correctIndex: 1,
          diagnosticDistractorNote:
            "Option A is the common sign-flip misconception distractor (adding instead of subtracting).",
        },
        approvalStatus: "pending",
        teacherNotes: "Emphasize drawing a vertical line down through the equals sign to preserve left/right balance.",
      };

    case "ADD_ACROSS_FRACTION_FALLACY":
      return {
        id: `MAT-${group.id}`,
        groupId: group.id,
        groupName: group.name,
        misconceptionTag: group.misconceptionTag,
        title: "Fraction Partitioning: Why We Need Like Denominators",
        targetConcept: "Adding Fractions with Unlike Denominators",
        conceptualReframing:
          "The denominator names the SIZE of the slice, while the numerator counts HOW MANY slices you have. You cannot add 1 third and 1 fourth directly because their slice sizes are different, just like you cannot say 1 dime + 1 quarter = 2 fifty-cent pieces.",
        counterExamples: [
          {
            flawedThinking: "1/3 + 1/4 = (1 + 1) / (3 + 4) = 2/7",
            correctedApproach:
              "1/3 = 4/12 and 1/4 = 3/12. Therefore 4/12 + 3/12 = (4 + 3)/12 = 7/12.",
            explanation:
              "2/7 is less than 1/3 (since 2/7 ≈ 0.285 while 1/3 ≈ 0.333). Adding two positive quantities must produce a result greater than either addend!",
          },
        ],
        scaffoldedPractice: [
          {
            problem: "Find the common denominator and compute: 1/2 + 1/5.",
            hint: "What is the least common multiple of 2 and 5?",
            solution: "LCM is 10. 5/10 + 2/10 = 7/10.",
          },
          {
            problem: "Compute: 2/3 + 1/6. Simplify if possible.",
            hint: "Does 3 divide evenly into 6? You only need to convert 2/3.",
            solution: "2/3 = 4/6. 4/6 + 1/6 = 5/6.",
          },
        ],
        exitTicketQuestion: {
          prompt: "What is the correct sum of 2/5 + 1/3?",
          options: ["A) 3/8", "B) 11/15", "C) 2/15", "D) 3/15"],
          correctIndex: 1,
          diagnosticDistractorNote:
            "Option A (3/8) directly tests the add-across fallacy ((2+1)/(5+3)).",
        },
        approvalStatus: "pending",
        teacherNotes: "Have students use visual fraction bar models or circle fraction manipulatives.",
      };

    case "DISTRIBUTION_DROP":
      return {
        id: `MAT-${group.id}`,
        groupId: group.id,
        groupName: group.name,
        misconceptionTag: group.misconceptionTag,
        title: "The Geometric Area Model for Full Term Distribution",
        targetConcept: "Applying Distributive Property Across Binomials",
        conceptualReframing:
          "When a number sits outside parentheses like a(b + c), it is multiplying EVERYTHING inside the room. Imagine an area of a rectangle with height 'a' and length 'b + c'. Total area = a*b + a*c.",
        counterExamples: [
          {
            flawedThinking: "3(x - 2) = 3x - 2",
            correctedApproach: "3(x - 2) = 3*(x) + 3*(-2) = 3x - 6",
            explanation:
              "The 3 was not distributed to the second term (-2), leaving the constant term underscaled.",
          },
        ],
        scaffoldedPractice: [
          {
            problem: "Expand: 4(2x + 5)",
            hint: "Multiply 4 by 2x, and multiply 4 by +5.",
            solution: "4 * 2x = 8x; 4 * 5 = 20. Total = 8x + 20.",
          },
          {
            problem: "Solve for x: 2(x + 4) = 18",
            hint: "Distribute the 2 first, or divide both sides by 2 first.",
            solution: "2x + 8 = 18 => 2x = 10 => x = 5.",
          },
        ],
        exitTicketQuestion: {
          prompt: "Expand and simplify: 5(3x - 4)",
          options: ["A) 15x - 4", "B) 15x - 20", "C) 8x - 20", "D) 15x + 20"],
          correctIndex: 1,
          diagnosticDistractorNote:
            "Option A represents the incomplete distribution error.",
        },
        approvalStatus: "pending",
        teacherNotes: "Draw dual-column area diagrams for tactile reinforcement.",
      };

    default:
      return {
        id: `MAT-${group.id}`,
        groupId: group.id,
        groupName: group.name,
        misconceptionTag: group.misconceptionTag,
        title: `Targeted Intervention: ${group.misconceptionLabel}`,
        targetConcept: group.targetedObjective,
        conceptualReframing:
          "Systematic step verification: check each algebraic step backwards by substituting test values.",
        counterExamples: [
          {
            flawedThinking: "Skipping scratchwork verification",
            correctedApproach: "Plug solution back into the original equation to verify truth value",
            explanation: "Ensures parity across transformations.",
          },
        ],
        scaffoldedPractice: [
          {
            problem: "Check your reasoning step by step.",
            hint: "Work backwards from the target value.",
            solution: "Verify by substitution.",
          },
        ],
        exitTicketQuestion: {
          prompt: "Which verification check confirms the solution to 2x + 5 = 15 is x = 5?",
          options: ["A) 2(5) + 5 = 15", "B) 2(10) + 5 = 15", "C) 2 + 5 = 7", "D) 5 - 2 = 3"],
          correctIndex: 0,
          diagnosticDistractorNote: "Checks substitution mastery.",
        },
        approvalStatus: "pending",
        teacherNotes: "Review with teacher in small cohort.",
      };
  }
}
