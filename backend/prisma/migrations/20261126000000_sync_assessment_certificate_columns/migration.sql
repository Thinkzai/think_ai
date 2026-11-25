-- Sync missing Course, Assessment, and AssessmentSubmission columns safely (idempotent)
ALTER TABLE "Course"
  ADD COLUMN IF NOT EXISTS "completionThreshold" DOUBLE PRECISION NOT NULL DEFAULT 80;

ALTER TABLE "Assessment"
  ADD COLUMN IF NOT EXISTS "passPercentage" DOUBLE PRECISION NOT NULL DEFAULT 60,
  ADD COLUMN IF NOT EXISTS "maxAttempts" INTEGER NOT NULL DEFAULT 3;

ALTER TABLE "AssessmentSubmission"
  ADD COLUMN IF NOT EXISTS "feedback" TEXT,
  ADD COLUMN IF NOT EXISTS "gradedBy" TEXT,
  ADD COLUMN IF NOT EXISTS "gradedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "flaggedQuestionIds" JSONB,
  ADD COLUMN IF NOT EXISTS "gradingLeaseAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "gradingError" TEXT;

-- Align Assessment.totalMarks with actual Question marks sum where mismatched
UPDATE "Assessment" a
SET "totalMarks" = q.sum_marks
FROM (
  SELECT "assessmentId", SUM("marks")::int AS sum_marks
  FROM "Question"
  GROUP BY "assessmentId"
) q
WHERE a."id" = q."assessmentId"
  AND q.sum_marks > 0
  AND a."totalMarks" <> q.sum_marks;

-- Clamp any previously overflowed submission percentages (> 100%)
UPDATE "AssessmentSubmission"
SET "percentage" = LEAST(100, GREATEST(0, "percentage"))
WHERE "percentage" IS NOT NULL AND ("percentage" > 100 OR "percentage" < 0);
