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

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com',
    'X-RapidAPI-Key': 'dec105ee6bmshca936e1844266f4p195268jsn40a6cdad4497'
  }
}

// var games = [];

const SearchGame = () => {
  // create state for holding returned api data
  const [searchedGames, setSearchedGames] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved game id values
  const [savedGameIds, setSavedGameIds] = useState(getSavedGameIds());

  const [saveGame, { error }] = useMutation(SAVE_GAME);

  // set up useEffect hook to save `gameIDs` list to localStorage on component unmount
  useEffect(() => {
    return () => saveGameIds(savedGameIds);
  });

  // create method to search for games and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const games = await fetch(
        `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${searchInput}`, options)

      if (!games.ok) {
        throw new Error('something went wrong!');
      }

      const items = await games.json();
   
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
      console.error(err)
    }
  }


  // create function to handle saving a game to our database
  const handleSaveGame = async (gameId) => {
    console.log(gameId)
    console.log(searchedGames)
    // find the game in `searchedGames` state by the matching id
    const gameToSave = searchedGames.find((game) => game.gameId === gameId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      console.log(gameToSave)

      const { data } = await saveGame({
        variables: { gameId: `${gameToSave.gameId}`, creator: gameToSave.creator, title: gameToSave.title, description: gameToSave.description, image: gameToSave.image },
      });
      console.log(savedGameIds);
      setSavedGameIds([...savedGameIds, gameToSave.gameId]);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <Jumbotron fluid className="text-light bg-secondary">
        <Container>
          <h1>Search for Free to Play Games!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a genre"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="dark" size="lg">
                  Search
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
            : ''}
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
                  <p className="small">Creators: {game.title}</p>
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
