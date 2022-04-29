import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      username      
    }
  }
}
`;

export const ADD_USER = gql`
 mutation adduser($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
    token
    user {
      _id
      username
    }
  }
}
`;

export const SAVE_BOOK = gql`
  mutation savegame($gameData: GameInput!) {
  saveGame(GameData: $gameData) {
    _id
    username
    email
    savedGames {
      gameId
      creator
      image
      link
      title
      description
    }
  }
}
`;

export const REMOVE_BOOK = gql`
  mutation removegame($gameId: ID!) {
  removeGame(GameId: $gameId) {
    _id
    username
    email
    savedGames {
      gameId
      creator
      description
      image
      link
      title
    }
  }
}
`;
