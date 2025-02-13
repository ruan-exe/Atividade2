/*
  Warnings:

  - Added the required column `bairro` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cidade` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logradouro` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "bairro"  TEXT NOT NULL,
ADD COLUMN     "cidade" TEXT NOT NULL,
ADD COLUMN     "estado" TEXT NOT NULL,
ADD COLUMN     "logradouro" TEXT NOT NULL;
