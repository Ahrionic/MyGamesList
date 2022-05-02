import React from 'react';
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_GAME} from '../utils/mutations';
import { removeGameId } from '../utils/localStorage';

import Auth from '../utils/auth';

const SavedGame = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const [removeGame, { error }] = useMutation(REMOVE_GAME);

  const userData = data?.me || {};

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteGame = async (gameId) => {
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const data  = await removeGame({
        variables: { gameId },
      });

      // upon success, remove book's id from localStorage
      removeGameId(gameId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing {userData.username}'s games!</h1>
        </Container>
      </Jumbotron>
      <Container className='bg'>
        <h2>
          {userData.savedGames?.length
            ? `Viewing ${userData.savedGames.length} saved ${
                userData.savedGames.length === 1 ? 'game' : 'games'
              }:`
            : 'You have no saved games!'}
        </h2>
        <CardColumns>
          {userData.savedGames?.map((game) => {
            return (
              <Card key={game.id} border="dark">
                {game.thumbnail ? (
                  <Card.Img
                    src={game.thumbnail}
                    alt={`The cover for ${game.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{game.title}</Card.Title>
                  <p className="small">Creators: {game.creator}</p>
                  <Card.Text>{game.description}</Card.Text>

                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteGame(game.gameId)}
                  >
                    Delete this Game!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedGame;
