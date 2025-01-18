const express = require ('express');
const {handleAddTodo} = require('../controllers/addTodo')

const router = express.Router();

router.post('/addTodo',handleAddTodo);

