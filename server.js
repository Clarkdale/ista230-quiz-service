const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser')
const url = require('url');
const db = require('./db.js');

// create the server
const app = express();
const port = 3001;

app.use(cors());

// the methods
app.get('/categories', (request, response) => {
    db.getAllCategories()
        .then(x => response.json(x))
        .catch(e => response.status(500).send('The categories could not be retrieved.'));
});

app.get('/quizCategory/:categoryId', (request, response) => {
    let categoryId = request.params.categoryId;
    db.getQuizzes(categoryId)
        .then(x => response.json(x))
        .catch(e => response.status(500).send('The quizzes could not be retrieved.'));
});

app.get('/quiz/:quizId', (request, response) => {
    let quizId = request.params.quizId;
    db.getQuizQuestions(quizId)
        .then(x => {
            app.locals.quizId = quizId;
            app.locals.questions = x;
            app.locals.currentQuestion = 0;
            app.locals.correctCount = 0;
            app.locals.currentAnswered = false;
            response.send("quiz.html");
        })
        .catch(e => response.status(500).send('The quizzes could not be retrieved.'));
});

app.get('/currentQuiz', (request, response) => {
    db.getQuizName(app.locals.quizId)
        .then(x => response.json(x));
});

app.get('/currentQuestionImage', (request, response) => {
    if (app.locals.currentQuestion >= 6) {
        response.send("end");
    } else {
        response.send(app.locals.questions[app.locals.currentQuestion].imageUrl);
    }
});

app.get('/currentQuestionInfo', (request, response) => {
    if (app.locals.currentQuestion >= 6) {
        response.json("end");
    } else {
        response.json(app.locals.questions[app.locals.currentQuestion]);
    }
});

app.get('/checkAnswer/:answer', (request, response) => {
    let answer = request.params.answer;
    let correct = app.locals.questions[app.locals.currentQuestion].answer;
    if (answer === correct && !app.locals.currentAnswered) {
        app.locals.correctCount++;
        app.locals.currentAnswered = true;
    }
    response.send(answer === correct);
});

app.get('/correctAnswer', (request, response) => {
    response.send(app.locals.questions[app.locals.currentQuestion].answer);
});

app.get('/correctCount', (request, response) => {
    response.send("" + app.locals.correctCount);
});

app.get('/next', (request, response) => {
    app.locals.currentQuestion++;
    app.locals.currentAnswered = false;
    response.send("Whatever");
});

// start the server
app.listen(port, () => console.log('Listening on port ' + port));