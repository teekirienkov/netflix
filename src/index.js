const leftMenu = document.querySelector('.left-menu'),
      hamburger = document.querySelector('.hamburger'),
      modal = document.querySelector('.modal'),

      tvShowsList = document.querySelector('.tv-shows__list'),
      tvShowsSection = document.querySelector('.tv-shows'),
      tvShowsHead = document.querySelector('.tv-shows__head'),

      tvCardImg = document.querySelector('.tv-card__img'),
      modalTitle = document.querySelector('.modal__title'),
      genresList = document.querySelector('.genres-list'),
      rating = document.querySelector('.rating'),
      description = document.querySelector('.description'),
      modalLink = document.querySelector('.modal__link'),

      searchForm = document.querySelector('.search__form'),
      searchInput = document.querySelector('.search__form-input'),

      preloader = document.querySelector('.preloader'),

      dropdown = document.querySelectorAll('.dropdown'),

      posterWrapper = document.querySelector('.poster__wrapper'),
      modalContent = document.querySelector('.modal__content'),

      IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

const loading = document.createElement('div');
loading.classList.add('loading');

class DBService {
  constructor() {
    this.API_KEY = '9c464a059d368b1b6fa45ea91caad68b';
    this.SERVER = 'https://api.themoviedb.org/3';
  }

  getData = async (url) => {
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Error: ${response.status}`)
    }
  }

  getTestData = () => {
    return this.getData('../test.json')
  }

  getTestCard = () => {
    return this.getData('../card.json')
  }

  getSearchResult = (query) => {
    return this.getData(`${this.SERVER}/search/tv?api_key=${this.API_KEY}&query=${query}&language=ru`) // ПОИСК
  }

  getTVShow = (id) => {
    return this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`) // 
  }

  getTopRated = () => {
    return this.getData(`${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU&page=1`)
  }

  getPopular = () => {
    return this.getData(`${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU&page=1`)
  }

  getToday = () => {
    return this.getData(`${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=ru-RU&page=1`)
  }

  getOnTheAirWeek = () => {
    return this.getData(`${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU&page=1`)
  }
}

const renderCard = (response, target) => {

  tvShowsList.textContent = ''; // чищем весь список ul с карточками перед рендером

  if (!response.total_results) {
    loading.remove();
    tvShowsHead.textContent = 'К сожалению по Вашему запросу ничего не найдено';
    return;
  }

  tvShowsHead.textContent = target ? target.textContent : 'Результат поиска';

  response.results.forEach((item) => {
    const { backdrop_path, name: title, poster_path, vote_average, id } = item;

    // переменные с проверкой на наличие постера, бэкдропа и рейтинга
    const posterIMG = poster_path ? IMG_URL + poster_path : './img/no-poster.jpg',
          backdropIMG = backdrop_path ? IMG_URL + backdrop_path : '',
          voteElem = vote_average ? `<span class="tv-card__vote">${vote_average}</span>` : '';

    const card = document.createElement('li');
    card.classList.add('tv-shows__item');

    card.innerHTML = `
        <li class="tv-shows__item">
            <a href="#" class="tv-card" id="${id}">
                ${voteElem}
                <img class="tv-card__img"
                      src="${posterIMG}"
                      data-backdrop="${backdropIMG}"
                      alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
            </a>
        </li>`;

    loading.remove();
    tvShowsList.append(card); // новый метод вместо apendChild, вставляет в конец tvShowsList
  })
}

searchForm.addEventListener('submit', (event) => {
  tvShowsSection.append(loading);
  event.preventDefault();

  const value = searchInput.value.trim();

  new DBService().getSearchResult(value)
    .then(renderCard);

  searchInput.value = ''; // очищает input поиска
});


// Открытие меню по кнопке
const closeDropdown = () => {
  dropdown.forEach((item) => {
    item.classList.remove('active'); // скрытие развернутых элементов в меню при закрытии
  })
}

hamburger.addEventListener('click', () => {
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
  closeDropdown();
});

// Закрытие меню по клику в любую область страницы
document.addEventListener('click', (event) => {
  // Проверка на родительский класс левого меню, клик внутри меню
  if (!event.target.closest('.left-menu')) {
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
    closeDropdown();
  }
});

// Открываем выпадающий список в левом меню
leftMenu.addEventListener('click', (event) => {

  event.preventDefault();
  
  const { target } = event;
  const dropdown = target.closest('.dropdown'); // ищем клик по открывающемся списку

  // Добавляем класс active, который открывает выпадающий список
  if (dropdown) {
    dropdown.classList.toggle('active');

    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }

  if (target.closest('#search')) { // клик по поиску в меню
    tvShowsList.textContent = '';
    tvShowsHead.textContent = '';
  }

  if (target.closest('#top-rated')) {
    new DBService().getTopRated()
      .then((response) => renderCard(response, target));
  }

  if (target.closest('#popular')) {
    new DBService().getPopular()
      .then((response) => renderCard(response, target));
  }

  if (target.closest('#week')) {
    new DBService().getOnTheAirWeek()
      .then((response) => renderCard(response, target));
  }

  if (target.closest('#today')) {
    new DBService().getToday()
      .then((response) => renderCard(response, target));
  }
});

// Open modal
tvShowsList.addEventListener('click', (event) => {

  event.preventDefault();

  const { target } = event;
  const card = target.closest('.tv-card');

  if (card) {

    new DBService().getTVShow(card.id)
      .then((data) => {

        const { poster_path, name: title,  genres, vote_average, overview, homepage } = data;

        if (poster_path) {
          tvCardImg.src = IMG_URL + poster_path;
          tvCardImg.alt = title;
          posterWrapper.style.display = '';
          modalContent.style.paddingLeft = '';
        } else {
          posterWrapper.style.display = 'none';
          modalContent.style.paddingLeft = '25px';
        }
        
        modalTitle.textContent = title; // без .textContent ошибка, поэтому тут обязательно

        genresList.innerHTML = genres.reduce((acc, item) => `${acc} <li>${item.name}</li>`, ''); // возвращаем жанры через метод

        rating.textContent = vote_average;
        description.textContent = overview;
        modalLink.href = homepage;
      })
      .then(() => {
        document.body.style.overflow = 'hidden';        // этот участок перенес, он был после первого then
        modal.classList.remove('hide');
      })
      .finally(() => {
        preloader.style.display = '';
      })
  }
});

// Close modal
modal.addEventListener('click', (event) => {
  // Проверка клика на кнопку или в любую точку сайта (не в модал)
  if (event.target.closest('.cross') || event.target.classList.contains('modal')) {
    document.body.style.overflow = '';
    modal.classList.add('hide');
  }
});

// Функция для изменения картинок при наведении на карточки
const changeImage = (event) => {
  const imagesCard = event.target.closest('.tv-shows__item');
  // matches возвращает true/false (проверка на класс таргета)
  if (imagesCard) {
    const img = imagesCard.querySelector('.tv-card__img');

    if (img.dataset.backdrop) {
      [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
    }
  }
};

tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);