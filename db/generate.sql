-- MySQL Script generated by MySQL Workbench
-- Mon Jan  3 19:37:46 2022
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema schoolint
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `schoolint` ;

-- -----------------------------------------------------
-- Schema schoolint
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `schoolint` DEFAULT CHARACTER SET utf8 ;
USE `schoolint` ;

-- -----------------------------------------------------
-- Table `schoolint`.`Template`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `schoolint`.`Template` ;

CREATE TABLE IF NOT EXISTS `schoolint`.`Template` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolint`.`TemplateSheet`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `schoolint`.`TemplateSheet` ;

CREATE TABLE IF NOT EXISTS `schoolint`.`TemplateSheet` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Template_id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_TemplateSheet_Template1_idx` (`Template_id` ASC) VISIBLE,
  CONSTRAINT `fk_TemplateSheet_Template1`
    FOREIGN KEY (`Template_id`)
    REFERENCES `schoolint`.`Template` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolint`.`TemplateFields`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `schoolint`.`TemplateFields` ;

CREATE TABLE IF NOT EXISTS `schoolint`.`TemplateFields` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `TemplateSheet_id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_TemplateFields_TemplateSheet1_idx` (`TemplateSheet_id` ASC) VISIBLE,
  CONSTRAINT `fk_TemplateFields_TemplateSheet1`
    FOREIGN KEY (`TemplateSheet_id`)
    REFERENCES `schoolint`.`TemplateSheet` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolint`.`Course`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `schoolint`.`Course` ;

CREATE TABLE IF NOT EXISTS `schoolint`.`Course` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolint`.`CourseYear`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `schoolint`.`CourseYear` ;

CREATE TABLE IF NOT EXISTS `schoolint`.`CourseYear` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Course_id` INT NOT NULL,
  `year` YEAR NOT NULL,
  `enabled` BIT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Course_id_UNIQUE` (`Course_id` ASC) VISIBLE,
  UNIQUE INDEX `year_UNIQUE` (`year` ASC) VISIBLE,
  CONSTRAINT `fk_CourseYear_Course1`
    FOREIGN KEY (`Course_id`)
    REFERENCES `schoolint`.`Course` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolint`.`Candidate`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `schoolint`.`Candidate` ;

CREATE TABLE IF NOT EXISTS `schoolint`.`Candidate` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `personal_id` VARCHAR(20) NOT NULL,
  `first_name` VARCHAR(25) NOT NULL,
  `last_name` VARCHAR(25) NOT NULL,
  `email` VARCHAR(50) NULL,
  `phone` VARCHAR(20) NULL,
  `notes` TEXT NULL,
  `address` VARCHAR(200) NULL,
  `CourseYear_id` INT NOT NULL,
  `created` DATETIME NOT NULL DEFAULT NOW(),
  PRIMARY KEY (`id`),
  INDEX `fk_Candidate_CourseYear1_idx` (`CourseYear_id` ASC) VISIBLE,
  CONSTRAINT `fk_Candidate_CourseYear1`
    FOREIGN KEY (`CourseYear_id`)
    REFERENCES `schoolint`.`CourseYear` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolint`.`UserRole`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `schoolint`.`UserRole` ;

CREATE TABLE IF NOT EXISTS `schoolint`.`UserRole` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolint`.`User`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `schoolint`.`User` ;

CREATE TABLE IF NOT EXISTS `schoolint`.`User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  `email` VARCHAR(50) NOT NULL,
  `password` VARCHAR(60) NULL,
  `UserRole_id` INT NOT NULL DEFAULT 2,
  `Course_id` INT NULL,
  `deleted` BIT NOT NULL DEFAULT 0,
  `created` DATETIME NOT NULL DEFAULT NOW(),
  PRIMARY KEY (`id`),
  INDEX `fk_User_UserRole1_idx` (`UserRole_id` ASC) VISIBLE,
  INDEX `fk_User_Course1_idx` (`Course_id` ASC) VISIBLE,
  CONSTRAINT `fk_User_UserRole1`
    FOREIGN KEY (`UserRole_id`)
    REFERENCES `schoolint`.`UserRole` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_User_Course1`
    FOREIGN KEY (`Course_id`)
    REFERENCES `schoolint`.`Course` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolint`.`CandidateAttachment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `schoolint`.`CandidateAttachment` ;

CREATE TABLE IF NOT EXISTS `schoolint`.`CandidateAttachment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `filename` VARCHAR(255) NOT NULL,
  `Candidate_id` INT NOT NULL,
  `created` DATETIME NOT NULL DEFAULT NOW(),
  PRIMARY KEY (`id`),
  INDEX `fk_CandidateAttachment_Candidate1_idx` (`Candidate_id` ASC) VISIBLE,
  CONSTRAINT `fk_CandidateAttachment_Candidate1`
    FOREIGN KEY (`Candidate_id`)
    REFERENCES `schoolint`.`Candidate` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolint`.`ImportResult`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `schoolint`.`ImportResult` ;

CREATE TABLE IF NOT EXISTS `schoolint`.`ImportResult` (
  `Candidate_id` INT NOT NULL,
  `room` INT NOT NULL,
  `time` TIME NOT NULL,
  `created` DATETIME NOT NULL DEFAULT NOW(),
  `cat1` TINYINT NOT NULL DEFAULT 0,
  `cat2` TINYINT NOT NULL DEFAULT 0,
  `cat3` TINYINT NOT NULL DEFAULT 0,
  `cat4` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`Candidate_id`),
  CONSTRAINT `fk_ImportResult_Candidate2`
    FOREIGN KEY (`Candidate_id`)
    REFERENCES `schoolint`.`Candidate` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolint`.`InterviewResult`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `schoolint`.`InterviewResult` ;

CREATE TABLE IF NOT EXISTS `schoolint`.`InterviewResult` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Candidate_id` INT NOT NULL,
  `User_id` INT NOT NULL,
  `created` DATETIME NOT NULL DEFAULT NOW(),
  `comment` TEXT NULL,
  `cat1` TINYINT NOT NULL DEFAULT 0,
  `cat2` TINYINT NOT NULL DEFAULT 0,
  `cat3` TINYINT NOT NULL DEFAULT 0,
  `cat4` TINYINT NOT NULL DEFAULT 0,
  `cat5` TINYINT NOT NULL DEFAULT 0,
  `cat6` TINYINT NOT NULL DEFAULT 0,
  `cat7` TINYINT NOT NULL DEFAULT 0,
  `cat8` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `fk_InterviewResult_Candidate1_idx` (`Candidate_id` ASC) VISIBLE,
  INDEX `fk_InterviewResult_User1_idx` (`User_id` ASC) VISIBLE,
  CONSTRAINT `fk_InterviewResult_Candidate1`
    FOREIGN KEY (`Candidate_id`)
    REFERENCES `schoolint`.`Candidate` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_InterviewResult_User1`
    FOREIGN KEY (`User_id`)
    REFERENCES `schoolint`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolint`.`Tag`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `schoolint`.`Tag` ;

CREATE TABLE IF NOT EXISTS `schoolint`.`Tag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `Course_id` INT NOT NULL,
  PRIMARY KEY (`id`, `Course_id`),
  INDEX `fk_Tag_Course1_idx` (`Course_id` ASC) VISIBLE,
  CONSTRAINT `fk_Tag_Course1`
    FOREIGN KEY (`Course_id`)
    REFERENCES `schoolint`.`Course` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolint`.`InterviewResult_has_Tag`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `schoolint`.`InterviewResult_has_Tag` ;

CREATE TABLE IF NOT EXISTS `schoolint`.`InterviewResult_has_Tag` (
  `InterviewResult_id` INT NOT NULL,
  `Tag_id` INT NOT NULL,
  `Tag_Course_id` INT NOT NULL,
  PRIMARY KEY (`InterviewResult_id`, `Tag_id`, `Tag_Course_id`),
  INDEX `fk_InterviewResult_has_Tag_Tag1_idx` (`Tag_id` ASC, `Tag_Course_id` ASC) VISIBLE,
  INDEX `fk_InterviewResult_has_Tag_InterviewResult1_idx` (`InterviewResult_id` ASC) VISIBLE,
  CONSTRAINT `fk_InterviewResult_has_Tag_InterviewResult1`
    FOREIGN KEY (`InterviewResult_id`)
    REFERENCES `schoolint`.`InterviewResult` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_InterviewResult_has_Tag_Tag1`
    FOREIGN KEY (`Tag_id` , `Tag_Course_id`)
    REFERENCES `schoolint`.`Tag` (`id` , `Course_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `schoolint`.`Template`
-- -----------------------------------------------------
START TRANSACTION;
USE `schoolint`;
INSERT INTO `schoolint`.`Template` (`id`, `name`) VALUES (DEFAULT, 'SAIS');

COMMIT;


-- -----------------------------------------------------
-- Data for table `schoolint`.`TemplateSheet`
-- -----------------------------------------------------
START TRANSACTION;
USE `schoolint`;
INSERT INTO `schoolint`.`TemplateSheet` (`id`, `Template_id`, `name`) VALUES (DEFAULT, 1, 'Sheet1');

COMMIT;


-- -----------------------------------------------------
-- Data for table `schoolint`.`TemplateFields`
-- -----------------------------------------------------
START TRANSACTION;
USE `schoolint`;
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (DEFAULT, 1, 'personal_id:Isikukood');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (DEFAULT, 1, 'first_name:Eesnimi');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (DEFAULT, 1, 'last_name:Perenimi');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (DEFAULT, 1, 'email:E-post');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (DEFAULT, 1, 'address:Aadress');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (DEFAULT, 1, 'phone:Telefon');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (DEFAULT, 1, 'notes:Märkused');

COMMIT;


-- -----------------------------------------------------
-- Data for table `schoolint`.`Course`
-- -----------------------------------------------------
START TRANSACTION;
USE `schoolint`;
INSERT INTO `schoolint`.`Course` (`id`, `name`) VALUES (DEFAULT, 'RIF');
INSERT INTO `schoolint`.`Course` (`id`, `name`) VALUES (DEFAULT, 'LO');
INSERT INTO `schoolint`.`Course` (`id`, `name`) VALUES (DEFAULT, 'KTD');

COMMIT;


-- -----------------------------------------------------
-- Data for table `schoolint`.`UserRole`
-- -----------------------------------------------------
START TRANSACTION;
USE `schoolint`;
INSERT INTO `schoolint`.`UserRole` (`id`, `name`) VALUES (DEFAULT, 'Admin');
INSERT INTO `schoolint`.`UserRole` (`id`, `name`) VALUES (DEFAULT, 'User');

COMMIT;


-- -----------------------------------------------------
-- Data for table `schoolint`.`User`
-- -----------------------------------------------------
START TRANSACTION;
USE `schoolint`;
INSERT INTO `schoolint`.`User` (`id`, `first_name`, `last_name`, `email`, `password`, `UserRole_id`, `Course_id`, `deleted`, `created`) VALUES (DEFAULT, 'Admin', 'User', 'admin@yourdomain.com', '$2b$10$A6Hm3hPbnogpdps8NyYIS..DMC.tkWFkwpj4QTiOv/C/ttcbrmQyq', 1, NULL, DEFAULT, DEFAULT);
INSERT INTO `schoolint`.`User` (`id`, `first_name`, `last_name`, `email`, `password`, `UserRole_id`, `Course_id`, `deleted`, `created`) VALUES (DEFAULT, 'Test', 'User', 'test@yourdomain.com', '$2b$10$2o5MRdjsY.0UzbT2zYUxSO8gmkhB3yNOx7cf.9FTA5yYLvYao9/Ai', 2, 1, DEFAULT, DEFAULT);

COMMIT;

