const { 
	GraphQLObjectType, 
	GraphQLString, 
	GraphQLSchema, 
	GraphQLID, 
	GraphQLInt,
	GraphQLList,
} = require('graphql');
const { MovieModel, DirectorModel } = require('../models');


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

// для получания всех фильмов
// query {
// 	movies {
// 		name,
// 		genre
// 	}
// }


// Пример мутации
// mutation($name: String, $age: Int){
// 	addDirector(name: $name, age: $age) {
// 		name,
// 			age
// 	}
// }
// query variables
// {
// 	"name": "Test",
// 		"age": 22
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
				return DirectorModel.findById(parent.directorId)
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
				return MovieModel.find({ directorId: parent.id })
			}
		}
	})
})


// Корневой запрос, который описывается все подзапросы, на получение данных
const Query = new GraphQLObjectType({
	name: 'Query',
	fields: {
		movie: {	// запрос для получения фильма по id
			type: MovieType,	
			args: { id: { type: GraphQLID }},		// Свойство args описывает, какие аргументы принимает запрос 
			resolve(parent, args) {
				return MovieModel.findById(args.id)
			}
		},
		director: {	// запрос для получения фильма по id
			type: DirectorType,	
			args: { id: { type: GraphQLID }},		// Свойство args описывает, какие аргументы принимает запрос 
			resolve(parent, args) {
				return DirectorModel.findById(args.id)
			}
		},
		movies: {
			type: GraphQLList(MovieType),
			resolve(parent, args) {
				return MovieModel.find({})
			}
		},
		directors: {
			type: GraphQLList(DirectorType),
			resolve(parent, args) {
				return DirectorModel.find({})
			}
		}
	}
})

// Мутации это запросы на добавление новый объектов в БД
const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addDirector: {
			type: DirectorType,
			args: {
				name: { type: GraphQLString },
				age: { type: GraphQLInt },
			},
			resolve(parent, args) {
				const director = new DirectorModel({
					name: args.name,
					age: args.age
				})
				return director.save()
			}
		},
		addMovie: {
			type: MovieType,
			args: {
				name: { type: GraphQLString },
				genre: { type: GraphQLString },
				directorId: { type: GraphQLID },
			},
			resolve(parent, args) {
				const movie = new MovieModel({
					name: args.name,
					genre: args.genre,
					directorId: args.directorId,
				})
				return movie.save()
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: Query,
	mutation: Mutation
})