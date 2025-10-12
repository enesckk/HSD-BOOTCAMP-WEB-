/*
  Warnings:

  - Added the required column `email` to the `applications` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_applications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "projectIdea" TEXT NOT NULL,
    "youtubeVideo" TEXT NOT NULL,
    "logicQuestion1" TEXT NOT NULL,
    "logicQuestion2" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_applications" ("createdAt", "department", "fullName", "id", "logicQuestion1", "logicQuestion2", "notes", "phone", "projectIdea", "reviewedAt", "reviewedBy", "status", "university", "updatedAt", "youtubeVideo") SELECT "createdAt", "department", "fullName", "id", "logicQuestion1", "logicQuestion2", "notes", "phone", "projectIdea", "reviewedAt", "reviewedBy", "status", "university", "updatedAt", "youtubeVideo" FROM "applications";
DROP TABLE "applications";
ALTER TABLE "new_applications" RENAME TO "applications";
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "marathonId" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "teamRole" TEXT,
    "role" TEXT NOT NULL DEFAULT 'PARTICIPANT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "teamId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "users_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_users" ("createdAt", "department", "email", "fullName", "id", "isActive", "marathonId", "password", "phone", "role", "teamId", "teamRole", "university", "updatedAt") SELECT "createdAt", "department", "email", "fullName", "id", "isActive", "marathonId", "password", "phone", "role", "teamId", "teamRole", "university", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_marathonId_key" ON "users"("marathonId");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
