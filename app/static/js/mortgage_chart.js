class MortgageChart {
  constructor (chartConfig){
    const canvas = document.createElement('canvas');
    canvas.setAttribute('dir', 'rtl');
    canvas.setAttribute('id', 'mortgageChart');
    canvas.setAttribute('width', 400);
    canvas.setAttribute('height', 400);

    canvas.addEventListener('click', (evt) => {
      canvasClickEvent();
    });

    const container = document.createElement('div');
    container.classList.add('container');
    container.setAttribute('dir', 'rtl');
    container.style.textAlign = 'right';

    document.body.appendChild(container);
    container.appendChild(canvas);

    this.chart = new Chart(canvas.getContext('2d'), chartConfig);
  }
}