const leftMenu = document.querySelector('.left-menu'),
      hamburger = document.querySelector('.hamburger'),
      modal = document.querySelector('.modal'),
      tvShowsList = document.querySelector('.tv-shows__list');

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
  if (event.target.closest('.cross') || event.target.classList.contains('modal')) {
    document.body.style.overflow = '';
    modal.classList.add('hide');
  }
})