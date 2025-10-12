/*
  Warnings:

  - You are about to drop the `marathon_ids` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `marathonId` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "marathon_ids_marathonId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "marathon_ids";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
INSERT INTO "new_users" ("createdAt", "department", "email", "fullName", "id", "isActive", "password", "phone", "role", "teamId", "teamRole", "university", "updatedAt") SELECT "createdAt", "department", "email", "fullName", "id", "isActive", "password", "phone", "role", "teamId", "teamRole", "university", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
