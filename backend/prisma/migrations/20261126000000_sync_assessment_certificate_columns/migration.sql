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

-- Create the 6 Prisma tables missing from live PostgreSQL (idempotent)
CREATE TABLE IF NOT EXISTS "AttendanceRecord" (
  "id" SERIAL NOT NULL,
  "enrollmentId" INTEGER NOT NULL,
  "sessionTitle" TEXT NOT NULL,
  "sessionDate" TIMESTAMP(3) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PRESENT',
  "notes" TEXT,
  "recordedBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AttendanceRecord_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "AttendanceRecord_enrollmentId_sessionDate_sessionTitle_key" ON "AttendanceRecord"("enrollmentId", "sessionDate", "sessionTitle");
CREATE INDEX IF NOT EXISTS "AttendanceRecord_sessionDate_idx" ON "AttendanceRecord"("sessionDate");
CREATE INDEX IF NOT EXISTS "AttendanceRecord_status_idx" ON "AttendanceRecord"("status");

CREATE TABLE IF NOT EXISTS "InstructorSessionControl" (
  "id" SERIAL NOT NULL,
  "userId" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "checklist" JSONB NOT NULL DEFAULT '[]',
  "controls" JSONB NOT NULL DEFAULT '{}',
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InstructorSessionControl_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "InstructorSessionControl_userId_sessionId_key" ON "InstructorSessionControl"("userId", "sessionId");
CREATE INDEX IF NOT EXISTS "InstructorSessionControl_sessionId_idx" ON "InstructorSessionControl"("sessionId");

CREATE TABLE IF NOT EXISTS "DevicePushToken" (
  "id" SERIAL NOT NULL,
  "userId" TEXT NOT NULL,
  "expoPushToken" TEXT NOT NULL,
  "platform" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DevicePushToken_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "DevicePushToken_expoPushToken_key" ON "DevicePushToken"("expoPushToken");
CREATE INDEX IF NOT EXISTS "DevicePushToken_userId_idx" ON "DevicePushToken"("userId");

CREATE TABLE IF NOT EXISTS "LmsNote" (
  "id" SERIAL NOT NULL,
  "enrollmentId" INTEGER NOT NULL,
  "lessonId" INTEGER NOT NULL,
  "text" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LmsNote_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "LmsNote_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "LmsNote_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "LmsNote_enrollmentId_lessonId_key" ON "LmsNote"("enrollmentId", "lessonId");

CREATE TABLE IF NOT EXISTS "LmsCertificateDelivery" (
  "id" SERIAL NOT NULL,
  "enrollmentId" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastError" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LmsCertificateDelivery_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "LmsCertificateDelivery_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "LmsCertificateDelivery_enrollmentId_key" ON "LmsCertificateDelivery"("enrollmentId");

CREATE TABLE IF NOT EXISTS "LmsReportDelivery" (
  "id" SERIAL NOT NULL,
  "periodKey" TEXT NOT NULL,
  "from" TEXT NOT NULL,
  "to" TEXT NOT NULL,
  "recipients" JSONB NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "sentAt" TIMESTAMP(3),
  "lastError" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LmsReportDelivery_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "LmsReportDelivery_periodKey_key" ON "LmsReportDelivery"("periodKey");
