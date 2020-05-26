const leftMenu = document.querySelector('.left-menu'),
      hamburger = document.querySelector('.hamburger'),
      modal = document.querySelector('.modal'),
      tvShowsList = document.querySelector('.tv-shows__list');

const DBService = class {
  getData = async (url) => {
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Error: ${response.status}`)
    }
  }

  getTestData = async () => {
    return await this.getData('../test.json')
  }
}

new DBService().getTestData()
  .then((data) => {
    console.log(data);
});

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
  const card = event.target.closest('.tv-shows__item');
  // matches возвращает true/false (проверка на класс таргета)
  if (card) {
    const img = card.querySelector('.tv-card__img');

    if (img.dataset.backdrop) {
      [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
    }
  }
};

tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);