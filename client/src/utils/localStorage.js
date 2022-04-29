export const getSavedBookIds = () => {
  const savedBookIds = localStorage.getItem('saved_games')
    ? JSON.parse(localStorage.getItem('saved_games'))
    : [];

  return savedBookIds;
};

export const saveBookIds = (bookIdArr) => {
  if (bookIdArr.length) {
    localStorage.setItem('saved_games', JSON.stringify(bookIdArr));
  } else {
    localStorage.removeItem('saved_games');
  }
};

export const removeBookId = (bookId) => {
  const savedBookIds = localStorage.getItem('saved_games')
    ? JSON.parse(localStorage.getItem('saved_games'))
    : null;

  if (!savedBookIds) {
    return false;
  }

  const updatedSavedBookIds = savedBookIds?.filter((savedBookId) => savedBookId !== bookId);
  localStorage.setItem('saved_games', JSON.stringify(updatedSavedBookIds));

  return true;
};
