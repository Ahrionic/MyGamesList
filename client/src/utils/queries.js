import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      savedGames {
        gameId
        creator
        image
        description
        title
        link
      }
    }
  }
`;
