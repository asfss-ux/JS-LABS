const express = require('express');

const { graphqlHTTP } = require('express-graphql');

const app = express();
const ejs = require('ejs');
app.use(express.json());
const mongoose = require('mongoose');
const authorRoutes = require('./routes/authorRoutes');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { Author, Title } = require('./models/Author');
const { schema, root } = require('./graphql-schema');


app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, 
}));




app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));


mongoose.connect('mongodb://localhost:27017/project').then(() => console.log('udalo sie polaczyc')).catch(err => console.error('blad polaczenia'))


app.use(express.urlencoded({extended: true}))

app.set('view engine', 'ejs');
app.get('/', async (req, res) => {
    try{
        const users = await Author.find().populate('title');
        res.render('index', { users });
        console.log(users);
    } catch(err) {
        console.error(err);
        res.status(500).json({message: err.message});
    }
});

app.use('/api/authors', authorRoutes);

app.listen(2009, () => {console.log('serwer is on')})


