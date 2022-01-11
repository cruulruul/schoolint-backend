-- MySQL Script generated by MySQL Workbench
-- Mon Jan 10 22:31:40 2022
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
  `name` VARCHAR(100) NOT NULL,
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
  `Template_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Course_Template1_idx` (`Template_id` ASC) VISIBLE,
  CONSTRAINT `fk_Course_Template1`
    FOREIGN KEY (`Template_id`)
    REFERENCES `schoolint`.`Template` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolint`.`CourseYear`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `schoolint`.`CourseYear` ;

CREATE TABLE IF NOT EXISTS `schoolint`.`CourseYear` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Course_id` INT NOT NULL,
  `year` YEAR NOT NULL,
  `enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `created` DATETIME NULL DEFAULT NOW(),
  PRIMARY KEY (`id`),
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
  `personal_id` BIGINT NOT NULL,
  `first_name` VARCHAR(25) NOT NULL,
  `last_name` VARCHAR(25) NOT NULL,
  `email` VARCHAR(50) NULL,
  `phone` VARCHAR(20) NULL,
  `notes` TEXT NULL,
  `address` VARCHAR(200) NULL,
  `exam1` TINYINT NULL,
  `exam2` TINYINT NULL,
  `exam3` TINYINT NULL,
  `exam4` TINYINT NULL,
  `CourseYear_id` INT NOT NULL,
  `created` DATETIME NOT NULL DEFAULT NOW(),
  `present` TINYINT(1) NOT NULL DEFAULT 0,
  INDEX `fk_Candidate_CourseYear1_idx` (`CourseYear_id` ASC) VISIBLE,
  PRIMARY KEY (`id`),
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
  `original_name` VARCHAR(255) NOT NULL,
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
  `Candidate_personal_id` BIGINT NOT NULL,
  `CourseYear_id` INT NOT NULL,
  `room` INT NULL,
  `time` TIME NULL,
  `created` DATETIME NOT NULL DEFAULT NOW(),
  `cat1` TINYINT NOT NULL DEFAULT 0,
  `cat2` TINYINT NOT NULL DEFAULT 0,
  `cat3` TINYINT NOT NULL DEFAULT 0,
  `cat4` TINYINT NOT NULL DEFAULT 0,
  `final_score` TINYINT NOT NULL,
  `text` TEXT NULL,
  PRIMARY KEY (`Candidate_personal_id`, `CourseYear_id`),
  CONSTRAINT `fk_ImportResult_CourseYear1`
    FOREIGN KEY (`CourseYear_id`)
    REFERENCES `schoolint`.`CourseYear` (`id`)
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
  `interview_cat1` TINYINT NULL DEFAULT 0,
  `interview_cat2` TINYINT NULL DEFAULT 0,
  `interview_cat3` TINYINT NULL DEFAULT 0,
  `interview_cat4` TINYINT NULL DEFAULT 0,
  `interview_cat5` TINYINT NULL DEFAULT 0,
  `interview_cat6` TINYINT NULL DEFAULT 0,
  `interview_cat7` TINYINT NULL DEFAULT 0,
  `interview_cat8` TINYINT NULL DEFAULT 0,
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
  `deleted` BIT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
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
  PRIMARY KEY (`InterviewResult_id`, `Tag_id`),
  INDEX `fk_InterviewResult_has_Tag_InterviewResult1_idx` (`InterviewResult_id` ASC) VISIBLE,
  INDEX `fk_InterviewResult_has_Tag_Tag1_idx` (`Tag_id` ASC) VISIBLE,
  CONSTRAINT `fk_InterviewResult_has_Tag_InterviewResult1`
    FOREIGN KEY (`InterviewResult_id`)
    REFERENCES `schoolint`.`InterviewResult` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_InterviewResult_has_Tag_Tag1`
    FOREIGN KEY (`Tag_id`)
    REFERENCES `schoolint`.`Tag` (`id`)
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
INSERT INTO `schoolint`.`Template` (`id`, `name`) VALUES (1, 'SAIS');
INSERT INTO `schoolint`.`Template` (`id`, `name`) VALUES (2, 'RIF');

COMMIT;


-- -----------------------------------------------------
-- Data for table `schoolint`.`TemplateSheet`
-- -----------------------------------------------------
START TRANSACTION;
USE `schoolint`;
INSERT INTO `schoolint`.`TemplateSheet` (`id`, `Template_id`, `name`) VALUES (1, 1, 'Sheet1');
INSERT INTO `schoolint`.`TemplateSheet` (`id`, `Template_id`, `name`) VALUES (2, 2, 'Tulemused');

COMMIT;


-- -----------------------------------------------------
-- Data for table `schoolint`.`TemplateFields`
-- -----------------------------------------------------
START TRANSACTION;
USE `schoolint`;
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (1, 1, 'personal_id;Isikukood');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (2, 1, 'first_name;Eesnimi');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (3, 1, 'last_name;Perenimi');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (4, 1, 'email;E-post');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (5, 1, 'address;Aadress: tegelik');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (6, 1, 'phone;Telefon');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (7, 1, 'notes|null;Märkused');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (8, 1, 'exam1|null;Eesti keel (Riigieksam)');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (9, 1, 'exam2|null;Eesti keel teise keelena (Riigieksam)');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (10, 1, 'exam3|null;Emakeel (eesti keel) (Riigieksam)');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (11, 1, 'exam4|null;Inglise keel (võõrkeel) (Riigieksam)');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (12, 2, 'Candidate_personal_id;Isikukood');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (13, 2, 'cat1;Valik 35p');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (14, 2, 'cat2;Loogika 45p');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (15, 2, 'cat3;Prog. 10p');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (16, 2, 'cat4;Disain 10p');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (18, 2, 'text|null;');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (19, 2, 'time;Aeg');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (20, 2, 'room;Ruum');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `TemplateSheet_id`, `name`) VALUES (17, 2, 'final_score;KOKKU');

COMMIT;


-- -----------------------------------------------------
-- Data for table `schoolint`.`Course`
-- -----------------------------------------------------
START TRANSACTION;
USE `schoolint`;
INSERT INTO `schoolint`.`Course` (`id`, `name`, `Template_id`) VALUES (1, 'RIF', 2);
INSERT INTO `schoolint`.`Course` (`id`, `name`, `Template_id`) VALUES (2, 'LO', 2);
INSERT INTO `schoolint`.`Course` (`id`, `name`, `Template_id`) VALUES (3, 'KTD', 2);

COMMIT;


-- -----------------------------------------------------
-- Data for table `schoolint`.`CourseYear`
-- -----------------------------------------------------
START TRANSACTION;
USE `schoolint`;
INSERT INTO `schoolint`.`CourseYear` (`id`, `Course_id`, `year`, `enabled`, `created`) VALUES (1, 2, 2022, 1, '2022-01-05 11:45:24');

COMMIT;


-- -----------------------------------------------------
-- Data for table `schoolint`.`Candidate`
-- -----------------------------------------------------
START TRANSACTION;
USE `schoolint`;
INSERT INTO `schoolint`.`Candidate` (`id`, `personal_id`, `first_name`, `last_name`, `email`, `phone`, `notes`, `address`, `exam1`, `exam2`, `exam3`, `exam4`, `CourseYear_id`, `created`, `present`) VALUES (1, 39118082234, 'Mati', 'Tati', 'mati@mati.ee', '55434353', 'ainult tasulisele kohale, eelmistest r.k tasuta õp  ei ole möödas 3 x nom.aeg', 'Talu 5, Tallinn', 50, NULL, NULL, NULL, 1, '2022-01-05 19:55:00', 0);
INSERT INTO `schoolint`.`Candidate` (`id`, `personal_id`, `first_name`, `last_name`, `email`, `phone`, `notes`, `address`, `exam1`, `exam2`, `exam3`, `exam4`, `CourseYear_id`, `created`, `present`) VALUES (2, 39211982245, 'Artur', 'Talvik', 'Juha@puhas.ee', '55434353', 'eesti keel peab saavutama C1.2 õpingute jooksul', 'Karja tee 3, tartu', NULL, NULL, 50, NULL, 1, '2022-01-05 19:55:00', 0);
INSERT INTO `schoolint`.`Candidate` (`id`, `personal_id`, `first_name`, `last_name`, `email`, `phone`, `notes`, `address`, `exam1`, `exam2`, `exam3`, `exam4`, `CourseYear_id`, `created`, `present`) VALUES (3, 39305882256, 'Veiko', 'Reha', 'veiko@rehamees.ee', '37256433432', NULL, 'Tallinn, Mustamäe tee 666', NULL, NULL, NULL, NULL, 1, '2022-01-05 19:55:00', 0);

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


-- -----------------------------------------------------
-- Data for table `schoolint`.`Tag`
-- -----------------------------------------------------
START TRANSACTION;
USE `schoolint`;
INSERT INTO `schoolint`.`Tag` (`id`, `name`, `Course_id`, `deleted`) VALUES (DEFAULT, 'Innukas', 1, DEFAULT);
INSERT INTO `schoolint`.`Tag` (`id`, `name`, `Course_id`, `deleted`) VALUES (DEFAULT, 'Tubli', 2, DEFAULT);

COMMIT;

