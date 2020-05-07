'use strict';

require('dotenv').config();
const { Pool } = require('pg');

// check whether this api is runing on production server or not
const isProduction = process.env.IS_PRODUCTION.toLowerCase() === 'true';
console.log(process.env.IS_PRODUCTION);
console.log(`Is this the production environment? ${isProduction ? 'yes' : 'no'}`);


//postgresql://USER:PASSWORD@HOST:PORT/DATABASE
// postgresql://picture_dictionary_user:@localhost:5432/picture_dictionary
const postgreConnectionString =
 `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}`;

console.log(postgreConnectionString);

const postgrePool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : postgreConnectionString,
  ssl: isProduction,
});

function getAllCategories() {
    return postgrePool.query('select * from public."Categories"')
  .then(result => result.rows);
} 

function getQuizzes(category) {
    return postgrePool.query('select * from public."Quiz" where "Quiz"."categoryId" = $1', [category])
  .then(result => result.rows);
}

function getQuizQuestions(quizId) {
    return postgrePool.query('select * from public."Question" where "Question"."quizId" = $1', [quizId])
  .then(result => result.rows);
}

function getQuizName(quizId) {
    return postgrePool.query('select title from public."Quiz" where "Quiz"."id" = $1', [quizId])
  .then(result => result.rows);
}

module.exports = { getAllCategories, getQuizzes, getQuizQuestions, getQuizName }
