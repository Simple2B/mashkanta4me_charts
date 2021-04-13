class MortgageChart {
  constructor (chartConfig, wrapper){
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('dir', 'rtl');
    this.canvas.setAttribute('id', 'mortgageChart');
    this.canvas.setAttribute('width', 400);
    this.canvas.setAttribute('height', 400);

    const container = document.createElement('div');
    container.appendChild(this.canvas);
    wrapper.appendChild(container);

    container.classList.add('container');
    container.setAttribute('dir', 'rtl');
    container.style.textAlign = 'right';

    this.chart = new Chart(this.canvas.getContext('2d'), chartConfig);
  }
}
