/*! SET storage_engine=INNODB */;
drop table if exists client;

create table client (
  `id`         INTEGER  PRIMARY KEY AUTO_INCREMENT,
  `name`           VARCHAR(50) NOT NULL
);