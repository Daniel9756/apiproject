const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const articleRoutes = require('./api/routes/articles');
const gifRoutes = require('./api/routes/gifs');
const userRoutes = require('./api/routes/users');
const articlecommentRoutes = require('./api/routes/articlecomments');
const gifcommentRoutes = require('./api/routes/gifcomments')

//const db = reqiure("./api/routes/articles")

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Type, Authorization, *");
    if(req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods",
        "PUT, POST, DELETE, PATCH, GET");
        return res.status(200).json({});
    }
    next();
});

app.use('/articles', articleRoutes);
app.use('/gifs', gifRoutes);
app.use('/users', userRoutes);
app.use('/articlecomments', articlecommentRoutes);
app.use('/gifcomments', gifcommentRoutes);



app.use((req, res, next) => {
    const error = new Error('NOT FOUND')
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});




module.exports = app;
