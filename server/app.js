const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const schema = require('./schema/schema');

const app = express();
const PORT = 3005;

app.use('/graphql', graphqlHTTP({
	schema,
	graphiql: true
}));


mongoose.connect('mongodb+srv://alfie9:677091@cluster0.fizol.azure.mongodb.net/graphql-tutorial?retryWrites=true&w=majority', {
	useUnifiedTopology: true,
	useNewUrlParser: true
})

const dbConnection = mongoose.connection
dbConnection.on('error', err => console.log(`Connection error ${err}`))
dbConnection.once('open', () => console.log(`Connected to DB!`))

app.listen(PORT, err => {
	err ? console.log(err) : console.log('Server started');
})

