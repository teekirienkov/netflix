const leftMenu = document.querySelector('.left-menu'),
      hamburger = document.querySelector('.hamburger'),
      modal = document.querySelector('.modal'),
      tvShowsList = document.querySelector('.tv-shows__list'),

      tvShowsSection = document.querySelector('.tv-shows'),

      tvCardImg = document.querySelector('.tv-card__img'),
      modalTitle = document.querySelector('.modal__title'),
      genresList = document.querySelector('.genres-list'),
      rating = document.querySelector('.rating'),
      description = document.querySelector('.description'),
      modalLink = document.querySelector('.modal__link'),

      API_KEY = '9c464a059d368b1b6fa45ea91caad68b',

      IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

const loading = document.createElement('div');
loading.classList.add('loading');

class DBService {
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
}

const renderCard = (response) => {

  tvShowsList.textContent = ''; // чищем весь список ul с карточками перед рендером

  response.results.forEach(item => {
    const { backdrop_path, name: title, poster_path, vote_average } = item;

    // переменные с проверкой на наличие постера, бэкдропа и рейтинга
    const posterIMG = poster_path ? IMG_URL + poster_path : './img/no-poster.jpg',
          backdropIMG = backdrop_path ? IMG_URL + backdrop_path : '',
          voteElem = vote_average ? `<span class="tv-card__vote">${vote_average}</span>` : '';

    const card = document.createElement('li');
    card.classList.add('tv-shows__item');

    card.innerHTML = `
        <li class="tv-shows__item">
            <a href="#" class="tv-card">
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

{
  tvShowsSection.append(loading);
  new DBService().getTestData()
    .then(renderCard);
}
// Открытие меню по кнопке
hamburger.addEventListener('click', () => {
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
});

// Закрытие меню по клику в любую область страницы
document.addEventListener('click', (event) => {
  // Проверка на родительский класс левого меню, клик внутри меню
  if (!event.target.closest('.left-menu')) {
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
  }
});

// Открываем выпадающий список в левом меню
leftMenu.addEventListener('click', (event) => {
  const {target} = event;
  const dropdown = target.closest('.dropdown');

  // Добавляем класс active, который открывает выпадающий список
  if (dropdown) {
    dropdown.classList.toggle('active');

    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }
});

// Open modal
tvShowsList.addEventListener('click', (event) => {
  const {target} = event;
  const card = target.closest('.tv-card');

  if (card) {

    new DBService().getTestCard()
      .then(data => {

        const { poster_path, name,  genres} = data;

        tvCardImg.src = IMG_URL + poster_path;
        modalTitle.textContent = name; // без .textContent ошибка, поэтому тут обязательно
        genresList.innerHTML = genres.reduce((acc, item) => `${acc} <li>${item.name}</li>`, ''); // возвращаем жанры через метод
        rating
        description
        modalLink
      })

    document.body.style.overflow = 'hidden';
    modal.classList.remove('hide');
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