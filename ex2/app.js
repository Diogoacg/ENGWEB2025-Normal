const express = require('express');
const path = require('path');

const indexRouter = require('./routes/index');

const app = express();
const PORT = 25001;
console.log(`A interface web está a correr na porta ${PORT}`);

// Set view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);

app.listen(PORT, () => {
  console.log(`Interface web a correr em http://localhost:${PORT}`);
});