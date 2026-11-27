const assert = require("node:assert/strict");
const { test } = require("node:test");
const { completion } = require("../completion");

test("completion marks a fresh learner eligible when lessons pass and coding assessment is COMPLETED", () => {
  const course = {
    completionThreshold: 80,
    modules: [
      {
        lessons: [{ id: 1 }, { id: 2 }],
        assessments: [{ id: 8, status: "ACTIVE", passPercentage: 60 }],
      },
    ],
  };
  const progress = [
    { lessonId: 1, completed: true },
    { lessonId: 2, completed: true },
  ];
  const submissions = [
    { assessmentId: 8, status: "COMPLETED", percentage: 100 },
  ];

  const summary = completion(course, progress, submissions);
  assert.equal(summary.percentage, 100);
  assert.equal(summary.passedAssessments, 1);
  assert.equal(summary.eligible, true);
});

test("completion rejects overflowed percentage scores (>100%) such as 1010%", () => {
  const course = {
    completionThreshold: 80,
    modules: [
      {
        lessons: [{ id: 1 }],
        assessments: [{ id: 1, status: "ACTIVE", passPercentage: 60 }],
      },
    ],
  };
  const progress = [{ lessonId: 1, completed: true }];
  const submissions = [
    { assessmentId: 1, status: "GRADED", percentage: 1010 },
  ];

  const summary = completion(course, progress, submissions);
  assert.equal(summary.passedAssessments, 0);
  assert.equal(summary.eligible, false);
});
