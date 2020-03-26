const express = require('express');
const router = express.Router();
const pool = require('./pg');
const randomId = require('random-id');
const checkAuth = require("./checkAuth");

router.get('/', checkAuth, (req, res, next) => {
pool
.query("select * from articles")
.then(data => {
    res.status(200).json({
    status: 'success',
    createdOn: new Date(),  
    data: data.rows
    })
 })
 .catch(err => {
    console.log(err);
    res.status(500).json({
        error: err
    })
})

});

router.post('/', checkAuth, (req, res) => {
    console.log(req)
    const { title, article, authorName } = req.body;
    const id = randomId();
    pool
    .query('INSERT INTO articles (id, title, article, "authorName") VALUES($1, $2, $3, $4) RETURNING *', 
    [id, title, article, authorName])
    .then(data => {
        res.status(200).json({
            message: 'Article successfully posted',
            createdOn: new Date(), 
            data: { title, article, authorName }   
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
    
})

router.post('/:articleId/:comments', checkAuth, (req, res, next) => {
    const id = req.params.id
    const comment = req.body.comment;    
    pool
    .query('INSERT INTO articles(comment) VALUES($1) RETURNING *',[comment])
    .then(data => { 
        res.status(200).json({
        message: 'Comment successfully created',
        createdOn: new Date(),
        id: id,
        data: comment
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})

router.get('/:id', checkAuth, (req, res, next) => {
    const id = req.params.id;    
    pool
    .query('SELECT * FROM articles WHERE id = $1', [id])
    .then(data => {
        if (!data.rows[0]) {
            return res.status(404).json({
                message: "Incorrect Id"
               })
        } else {
            res.status(200).json({
                authorId: id,
                createdOn: new Date(),
                data: data.rows[0],
           //  data: { title, article, id },
               })
        }
       
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})

router.put('/:id', checkAuth, (req, res, next) => {
    const id = req.params.id;
    const { title, article } = req.body;
    pool
    .query('UPDATE articles SET title=$1, article=$2 WHERE id=$3 RETURNING *',
    [title, article, id])
    .then(data => {
        res.status(200).json({
            message: "Article successfully updated",
            data: { title, article }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})

router.delete('/:id', checkAuth, (req, res, next) => {
    const id = req.params.id;
    pool
    .query('DELETE FROM articles WHERE id=$1 RETURNING *', [id])
    .then(data => {
        res.status(200).json({
            message: 'Article with  successfully deleted',
            authorId: id
        })
    })    
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
    })


module.exports = router;