create database EBookStore;
show databases;
USE EBookStore;
CREATE TABLE `role` (
  `id` INT PRIMARY KEY,
  `role_name` NVARCHAR(10)
);

INSERT INTO role VALUES (1001, 'seller'), (1002, 'buyer');
select * from role;


CREATE TABLE `user` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `email` VARCHAR(255) UNIQUE ,
  `password` VARCHAR(255),
  `name` NVARCHAR(255),
  `role` INT,
  `phone` CHAR(12),
  FOREIGN KEY (`role`) REFERENCES `role`(`id`) ON DELETE set null ON UPDATE CASCADE
);

-- Publisher and author tables
CREATE TABLE `publisher` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `publisher_name` NVARCHAR(255)
);

CREATE TABLE `author` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` NVARCHAR(50),
  `bio` NVARCHAR(255)
);

-- Category table
CREATE TABLE `category` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` NVARCHAR(50),
  `bio` NVARCHAR(255)
);
-- Book table
CREATE TABLE `book` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` NVARCHAR(255),
  `image` TEXT,
  `description` TEXT,
  `publish_date` DATE,
  `price` DOUBLE,
  `discount` DOUBLE,
  `quantity` INT,
  `category_id` INT,
  `publisher_id` INT,
  FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) on update cascade on delete set null ,
  FOREIGN KEY (`publisher_id`) REFERENCES `publisher`(`id`) on update cascade on delete set null
);

-- Book-author junction table
CREATE TABLE `book_author` (
  `book_id` INT,
  `author_id` INT,
  PRIMARY KEY (`book_id`, `author_id`),
  FOREIGN KEY (`book_id`) REFERENCES `book`(`id`) on update cascade on delete cascade ,
  FOREIGN KEY (`author_id`) REFERENCES `author`(`id`) on update cascade on delete cascade
);

-- Order related tables
CREATE TABLE `status` (
  `id` INT PRIMARY KEY,
  `status_name` CHAR(255)
);

CREATE TABLE `order` (
  `order_id` BIGINT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `order_date` DATE,
  `status` INT,
  `method` CHAR(255),
  `payment_date` DATE,
  FOREIGN KEY (`customer_id`) REFERENCES `user`(`id`) on delete cascade on update cascade ,
  FOREIGN KEY (`status`) REFERENCES `status`(`id`) on delete cascade on update cascade
);

CREATE TABLE `order_item` (
  `order_item_id` BIGINT AUTO_INCREMENT,
  `order_id` BIGINT,
  `book_id` INT NOT NULL,
  `quantity` INT,
  `price` INT,
  PRIMARY KEY (`order_item_id`),
  FOREIGN KEY (`order_id`) REFERENCES `order`(`order_id`) on delete cascade on update cascade ,
  FOREIGN KEY (`book_id`) REFERENCES `book`(`id`) on update cascade on delete cascade
);

CREATE TABLE `feedback` (
    `feedback_id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `order_id` BIGINT,
  `star` INT,
  `content` TEXT,
  FOREIGN KEY (`order_id`) REFERENCES `order`(`order_id`) on delete cascade on update cascade
);

-- News tables

CREATE TABLE `news_` (
  `news_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `title` NVARCHAR(255),
  `content` TEXT,
  `book_id` int NOT NULL,
  `image` TEXT,
  FOREIGN KEY (`book_id`) REFERENCES `book`(`id`) on delete cascade on update cascade
);

-- Seller table
CREATE TABLE `seller` (
  `id`INT PRIMARY KEY,
  `store_name` NVARCHAR(255),
  `book_id` INT,
  FOREIGN KEY (`id`) REFERENCES `user`(`id`) on update cascade on delete cascade ,
  FOREIGN KEY (`book_id`) REFERENCES `book`(`id`) on update cascade on delete cascade
);
