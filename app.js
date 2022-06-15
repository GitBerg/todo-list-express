const express = require('express');
const path = require('path');
const checkListRouter = require('./src/routes/checklist');
const taskRouter  = require('./src/routes/task');
const rootRouter = require('./src/routes/index');
const methodOverride = require('method-override');

require("./configs/database");

const app = express();

app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'ejs');

//middlewares
app.use(methodOverride('_method', {methods: ['POST', 'GET']}));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/', rootRouter);
app.use('/checklists', checkListRouter);
app.use('/checklists', taskRouter.taskRouter);
app.use('/tasks', taskRouter.simpleTaskRouter);

app.listen(3000, () => {
    console.log('Listening Port 3000!');
})