/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable indent */
'use strict';

const url = 'https://my-json-server.typicode.com/moviedb-tech/movies/list';
let data;
let filteredMovies;
const gallery = document.querySelector('.gallery__container');
const favoriteMovies = document.querySelector('.favorite-movies');
const list = document.createElement('ul');
const select = document.querySelector('.gallery__filter');

fetch(url)
  .then(response => response.json())
  .then(json => {
    data = json.map(movie => ({
      ...movie,
      selected: !!sessionStorage[movie.id],
    }));
    filteredMovies = data;

    setSelect();
    renderMovies(filteredMovies);
    renderFavoriteMovies();
  });

function setSelect() {
  const genres = new Set();
  const basicOption = document.createElement('option');

  basicOption.textContent = 'all genres';
  select.append(basicOption);

  select.addEventListener('change', (event) => {
    if (!genres.has(event.target.value)) {
      filteredMovies = data;
    } else {
      filteredMovies = data.filter(movie => (
        movie.genres.includes(event.target.value))
      );
    }

    gallery.innerHTML = ``;
    renderMovies(filteredMovies);
  });

  data.map(movie => {
    movie.genres.map(genre => {
      genres.add(genre);
    });
  });

  genres.forEach(genre => {
    const option = document.createElement('option');

    option.textContent = genre;
    select.append(option);
  });
}

function renderMovies(movies) {
  movies.forEach(movie => {
    const movieCard = document.createElement('div');

    movieCard.classList.add('movie-card');

    movieCard.innerHTML = `
      <img
        src="${movie.img}"
        class="movie-card__img"
        alt="movie"
      >
      <svg
        viewBox="0 -10 511.98685 511" width="511pt"
        xmlns="http://www.w3.org/2000/svg"
        class="movie-card__svg ${movie.selected ? 'checked' : ''}"
      >
        <path d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"/>
      </svg>
      <p class="movie-card__title">
        ${movie.name}
      </p>
      <p class="movie-card__year">
        ${movie.year}
      </p>
    `;

    movieCard.addEventListener('click', (event) => {
      if (event.target.closest('.movie-card__svg')) {
        if (movie.selected) {
          event.target.closest('.movie-card__svg').classList.remove('checked');
          movie.selected = false;
          sessionStorage[movie.id] = '';
          renderFavoriteMovies(data);
        } else {
          movie.selected = true;
          event.target.closest('.movie-card__svg').classList.add('checked');
          addFavoriteMovie(movie);
          sessionStorage[movie.id] = true;
        }

        return;
      }

      createModal(movie);
    });

    gallery.append(movieCard);
  });
}

function renderFavoriteMovies() {
  list.classList.add('favorite-movies__list');
  favoriteMovies.append(list);
  list.innerHTML = ``;

  data.forEach(movie => {
    if (!movie.selected) {
      return;
    }

    addFavoriteMovie(movie);
  });
}

function addFavoriteMovie(favoriteMovie) {
  const listItem = document.createElement('li');

  listItem.classList.add('favorite-movies__item');

  listItem.innerHTML = `
    ${favoriteMovie.name}
    <button class="page__close-btn">
      X
    </button>
  `;

  listItem.addEventListener('click', (event) => {
    if (event.target.matches('.page__close-btn')) {
      favoriteMovie.selected = false;
      sessionStorage[favoriteMovie.id] = '';
      gallery.innerHTML = ``;
      renderMovies(filteredMovies);
      event.target.closest('.favorite-movies__item').remove();

      return;
    }
    createModal(favoriteMovie);
  });

  list.append(listItem);
}

function createModal(movie) {
  const modal = document.createElement('div');
  const content = document.createElement('div');

  modal.classList.add('modal');
  content.classList.add('modal__content');

  content.innerHTML = `
    <div class="modal__wrapper">
      <img src="${movie.img}" class="modal__img">
      <div class="movie__year">Year: ${movie.year}</div>
      <div class="modal__genres"> Genres:
        ${movie.genres.map(genre => (
          `<div class="modal__genre">${genre}</div>`
        )).join(' ')}
      </div>
    </div>

    <div class="modal__wrapper">
      <h1 class="modal__title">${movie.name}</h1>
      <p class="modal__description">${movie.description}</p>
      <p class="modal__director">Director: ${movie.director}</p>
      <p class="modal__starring">Starring:
          ${movie.starring.map(star => (
            star
          )).join(', ')}
      </p>
    </div>

    <button class="page__close-btn modal__btn">X</button>
  `;

  content.addEventListener('click', (event) => {
    if (!event.target.matches('.page__close-btn')) {
      return;
    }

    modal.remove();
  });

  modal.append(content);
  document.body.append(modal);
}
