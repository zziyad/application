DROP DATABASE IF EXISTS application;
DROP USER IF EXISTS marcus;
CREATE USER marcus WITH PASSWORD 'marcus';
CREATE DATABASE application OWNER marcus;
