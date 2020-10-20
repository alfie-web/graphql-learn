const { 
	GraphQLObjectType, 
	GraphQLString, 
	GraphQLSchema, 
	GraphQLID, 
	GraphQLInt,
	GraphQLList,
} = require('graphql');

const movies = [
	{ id: '1', name: 'The Matrix', genre: 'Cyberpunk', directorId: '1'},
	{ id: '2', name: 'Fast and furious', genre: 'Action', directorId: '2'},
	{ id: '3', name: 'Snatch', genre: 'Comedy', directorId: '2'},
	{ id: '4', name: 'Home Alone', genre: 'Comedy', directorId: '3'},
	{ id: '5', name: '1984', genre: 'Sci-Fi', directorId: '3'},
	{ id: '6', name: 'Home Alone', genre: 'Comedy', directorId: '3'},
]

const directors = [
	{ id: '1', name: 'Quentin Tarantino', age: 55 },
	{ id: '2', name: 'Michael Radford', age: 72 },
	{ id: '3', name: 'Guy Ritchie', age: 50 },
]

// Пример запроса
// query($id: ID) {
// 	movie(id: $id) {
// 		id,
// 			name,
// 			genre,
// 			director {
// 			name,
// 				age
// 		}
// 	}
// }
// query variables
// {
// 	"id": 1
// }


// Схема данных, описывающая сущность (фильм)
const MovieType = new GraphQLObjectType({
	name: 'Movie',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
		director: {
			type: DirectorType,
			resolve(parent, args) {
				return directors.find(d => d.id == parent.id);
			}
		}
	})
})

const DirectorType = new GraphQLObjectType({
	name: 'Director',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		movies: {
			type: new GraphQLList(MovieType),
			resolve(parent, args) {
				return movies.filter(m => m.directorId === parent.id)
			}
		}
	})
})

// Корневой запрос, который описывается все подзапросы, свазанные с сущностью (фильмом)
const Query = new GraphQLObjectType({
	name: 'Query',
	fields: {
		movie: {	// запрос для получения фильма по id
			type: MovieType,	
			args: { id: { type: GraphQLID }},		// Свойство args описывает, какие аргументы принимает запрос 
			resolve(parent, args) {
				return movies.find(m => m.id == args.id);
			}
		},
		director: {	// запрос для получения фильма по id
			type: DirectorType,	
			args: { id: { type: GraphQLID }},		// Свойство args описывает, какие аргументы принимает запрос 
			resolve(parent, args) {
				return directors.find(d => d.id == args.id);
			}
		},
		movies: {
			type: GraphQLList(MovieType),
			resolve(parent, args) {
				return movies
			}
		},
		directors: {
			type: GraphQLList(DirectorType),
			resolve(parent, args) {
				return directors
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: Query
})