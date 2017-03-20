CREATE SCHEMA IF NOT EXISTS `wishes_db` DEFAULT CHARACTER SET latin1 ;
USE `wishes_db` ;

-- -----------------------------------------------------
-- Table `wishes_db`.`user_login`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `wishes_db`.`user_login` ;

CREATE TABLE IF NOT EXISTS `wishes_db`.`user_login` (
  `user_id` INT(70) NOT NULL AUTO_INCREMENT,
  `user_email` VARCHAR(45) NOT NULL,
  `user_password` VARCHAR(45) NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_email_UNIQUE` (`user_email` ASC));


-- -----------------------------------------------------
-- Table `wishes_db`.`wishes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `wishes_db`.`wishes` ;

CREATE TABLE IF NOT EXISTS `wishes_db`.`wishes` (
  `wish_id` INT(70) NOT NULL AUTO_INCREMENT,
  `wish` VARCHAR(45) NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`wish_id`));