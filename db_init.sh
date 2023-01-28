#!/bin/bash

# create database
npx sequelize db:create --env development

# create table
npx sequelize-cli db:migrate

# insert initial data
npx sequelize db:seed:all