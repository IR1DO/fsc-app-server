-- DropIndex
DROP INDEX `Post_title_key` ON `post`;

-- AlterTable
ALTER TABLE `post` MODIFY `image` VARCHAR(191) NOT NULL DEFAULT '';
