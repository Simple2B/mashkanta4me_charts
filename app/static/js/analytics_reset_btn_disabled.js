document.addEventListener('DOMContentLoaded', (evt) => {
  const btnWrapper = document.querySelector('.analytics-wrapper > .reload-btn-wrapper');
  const container = createResetBtn();
  const btn = container.querySelector('button');
  btn.setAttribute('disabled', true);
  btnWrapper.appendChild(container);
});
