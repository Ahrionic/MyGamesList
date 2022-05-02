const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String
    gameCount: Int
    savedGames: [game]
  }

  type game {
    gameId: ID!
    creator: [String]
    description: String
    image: String
    link: String
    title: String!
  }

  type Auth {
    token: ID!
    user: User
  }


  input GameInput {

    creator: [String]
    description: String!
    gameId: String!
    image: String
    link: String
    title: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveGame(creator: String!, description: String!, gameId: String!, image: String!, title: String!): User
    removeGame(GameId: ID!): User

  }
`;

module.exports = typeDefs;
