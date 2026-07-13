document.querySelectorAll('[data-scroll-to]').forEach((button) => {
  button.addEventListener('click', () => {
    document.getElementById(button.dataset.scrollTo).scrollIntoView({ behavior: 'smooth' });
  });
});
