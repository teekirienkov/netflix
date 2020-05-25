const leftMenu = document.querySelector('.left-menu'),
      hamburger = document.querySelector('.hamburger');

hamburger.addEventListener('click', () => {
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
})

// Закрытие меню по клику в любую область страницы
document.addEventListener('click', (event) => {
  // Проверка на родительский класс левого меню, клик внутри меню
  if (!event.target.closest('.left-menu')) {
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
  }
})