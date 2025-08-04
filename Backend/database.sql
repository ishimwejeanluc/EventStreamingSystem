CREATE DATABASE IF NOT EXISTS event_streaming;
USE event_streaming;


CREATE TABLE `users` (
  `id` VARCHAR(36) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin','viewer') NOT NULL DEFAULT 'viewer',
  `status` ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `created_by` VARCHAR(36) DEFAULT NULL,
  `updated_by` VARCHAR(36) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
);

-- Table: events
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `start_date` DATETIME DEFAULT NULL,
  `end_date` DATETIME DEFAULT NULL,
  `status` ENUM('upcoming','ongoing','completed','cancelled') NOT NULL DEFAULT 'upcoming',
  `created_by` VARCHAR(36) DEFAULT NULL,
  `updated_by` VARCHAR(36) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `video_views` (
  `id` VARCHAR(36) NOT NULL,
  `video_id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) DEFAULT NULL,
  `viewed_at` DATETIME NOT NULL,
  `status` ENUM('valid','invalid') NOT NULL DEFAULT 'valid',
  `created_by` VARCHAR(36) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
