// кнопка для переключения темы
const themeToggleButton = document.getElementById('theme-toggle');


// переключение классов темной и светлой тем
themeToggleButton.addEventListener('click', async () => {
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
});


