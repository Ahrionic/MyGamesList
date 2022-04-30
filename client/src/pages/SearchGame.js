import React, { useState, useEffect } from 'react';
import {
  Jumbotron,
  Container,
  Col,
  Form,
  Button,
  Card,
  CardColumns,
} from 'react-bootstrap';

import { useMutation } from '@apollo/client';
import { SAVE_GAME } from '../utils/mutations';
import { saveGameIds, getSavedGameIds } from '../utils/localStorage';

import Auth from '../utils/auth';

const SearchGame = () => {
  // create state for holding returned google api data
  const [searchedGames, setSearchedGames] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved bookId values
  const [savedGameIds, setSavedGameIds] = useState(getSavedGameIds());

  const [saveGame, { error }] = useMutation(SAVE_GAME);

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveGameIds(savedGameIds);
  });

  const rawgKey = '073f79e50bcb4ca187b5bdf70d87e86a'

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com',
          'X-RapidAPI-Key': 'dec105ee6bmshca936e1844266f4p195268jsn40a6cdad4497'
        }

      };

      const response = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/games?category=${searchInput}`, options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err))
      
      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const gameData = items.map((game) => ({
        gameId: game.id,
        creator: game.developer || ['No developer'],
        title: game.title,
        description: game.short_description,
        image: game.thumbnail || '',
      }));

      setSearchedGames(gameData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };


  // create function to handle saving a book to our database
  const handleSaveGame = async (gameId) => {
    // find the book in `searchedBooks` state by the matching id
    const gameToSave = searchedGames.find((game) => game.game.Id === gameId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveGame({
        variables: { gameData: { ...gameToSave } },
      });
      console.log(savedGameIds);
      setSavedGameIds([...savedGameIds, gameToSave.gameId]);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Search for Games!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a game"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedGames.length
            ? `Viewing ${searchedGames.length} results:`
            : 'Search for a game to begin'}
        </h2>
        <CardColumns>
          {searchedGames.map((game) => {
            return (
              <Card key={game.gameId} border="dark">
                {game.image ? (
                  <Card.Img
                    src={game.image}
                    alt={`The cover for ${game.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{game.title}</Card.Title>
                  <p className="small">Creator: {game.creator}</p>
                  <Card.Text>{game.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedGameIds?.some(
                        (savedId) => savedId === game.gameId
                      )}
                      className="btn-block btn-info"
                      onClick={() => handleSaveGame(game.gameId)}
                    >
                      {savedGameIds?.some((savedId) => savedId === game.gameId)
                        ? 'Game Already Saved!'
                        : 'Save This Game!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchGame;
