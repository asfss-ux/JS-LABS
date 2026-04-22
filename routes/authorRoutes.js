const express = require('express');
const router = express.Router();
const {Author, Title} = require('../models/Author');
const authorController = require('../controllers/authorControllers');


router.get('/', authorController.getAllAuthors);


router.get('/:id', authorController.getAuthorById);

router.post('/', authorController.createAuthor);


router.delete('/:id', authorController.deleteAuthor);

router.put('/:id', authorController.updateAuthor);

module.exports = router;    