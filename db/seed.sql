SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

USE `schoolint` ;

-- -----------------------------------------------------
-- Data for table `schoolint`.`Template`
-- -----------------------------------------------------
START TRANSACTION;
USE `schoolint`;
INSERT INTO `schoolint`.`Template` (`id`, `Name`) VALUES (DEFAULT, 'SAIS');

COMMIT;


-- -----------------------------------------------------
-- Data for table `schoolint`.`TemplateFields`
-- -----------------------------------------------------
START TRANSACTION;
USE `schoolint`;
INSERT INTO `schoolint`.`TemplateFields` (`id`, `Template_id`, `Name`) VALUES (DEFAULT, 1, 'Isikukood');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `Template_id`, `Name`) VALUES (DEFAULT, 1, 'Eesnimi');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `Template_id`, `Name`) VALUES (DEFAULT, 1, 'Perenimi');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `Template_id`, `Name`) VALUES (DEFAULT, 1, 'E-post');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `Template_id`, `Name`) VALUES (DEFAULT, 1, 'Aadress');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `Template_id`, `Name`) VALUES (DEFAULT, 1, 'Telefon');
INSERT INTO `schoolint`.`TemplateFields` (`id`, `Template_id`, `Name`) VALUES (DEFAULT, 1, 'Märkused');

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
