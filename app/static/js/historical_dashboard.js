class HistoricalDashboard {
  constructor(data) {
    this.data = data;
    currDataset = this.data.real;
    currentInterest = 'real';

    for (const dataset of currDataset) {
      let xMin = Math.min.apply(Math, dataset.data.map(function (o) { return o.x; }))
      let xMax = Math.max.apply(Math, dataset.data.map(function (o) { return o.x; }))
      let yMin = Math.min.apply(Math, dataset.data.map(function (o) { return o.y; }))
      let yMax = Math.max.apply(Math, dataset.data.map(function (o) { return o.y; }))
      if (xMin < mortgageRanges.xMin) { mortgageRanges.xMin = xMin }
      if (xMax > mortgageRanges.xMax) { mortgageRanges.xMax = xMax }
      if (yMin < mortgageRanges.yMin) { mortgageRanges.yMin = yMin }
      if (yMax > mortgageRanges.yMax) { mortgageRanges.yMax = yMax }
    }

    this.mortgageChart = new MortgageChart(chartConfig);
    chart = this.mortgageChart.chart;

    this.initYearsChips();

    const interestChangeRadio = document.querySelectorAll('.change-interest-radio');

    for (let i = 0, n = interestChangeRadio.length; i < n; i++){
      const currRadio = interestChangeRadio[i];
      if (currRadio.checked){
        currentInterest = currRadio.getAttribute('interest');
      } else {
        yearsChips[currRadio.getAttribute('interest')].filter.setAttribute('hidden', true);
      }

      currRadio.addEventListener('change', (evt) => {
        const interest = currRadio.getAttribute('interest');
        this.setInterest(interest);
      });

    }

    this.updateChart();
    this.mortgageChart.chart.update();
  }

  setInterest(interest){
    yearsChips[currentInterest].filter.setAttribute('hidden', true);
    yearsChips[interest].filter.removeAttribute('hidden');
    currentInterest = interest;
    currDataset = this.data[interest];

    this.updateChart();
    this.mortgageChart.chart.update();
  }

  initYearsChips(){
    // init years buttons
    const buttonListContainer = document.querySelector('.filter-button-container');
    yearsChips = {};

    for (const [key, dataset] of Object.entries(this.data)){
      const buttonList = document.createElement('ul');
      buttonList.classList.add('filter-button-list');

      const chip = {};

      dataset.forEach((points, i) => {
        chip[points.label] = true;
        const btn = createFilterBtn(points.label, i);
        buttonList.appendChild(btn);
      });

      yearsChips[key] = {'chip': chip, 'filter': buttonList};
      buttonListContainer.appendChild(buttonList);
    }
  }

  updateChart() {
    currDataset.forEach((data, i) => {
      this.mortgageChart.chart.data.dataset = [];
      const dataCopy = Object.assign({}, data);
      this.mortgageChart.chart.data.datasets[i] = dataCopy;
      if (!yearsChips[currentInterest].chip[data.label]){
        this.mortgageChart.chart.data.datasets[i].data = [];
      }
    });

    this.mortgageChart.chart.update();
  }

  _createFilterBtn(label, i){
    const li = document.createElement('li');
    li.classList.add('d-inline-block', 'mb-1');

    const span = document.createElement('span');
    span.classList.add('badge', 'badge-secondary', 'chip', 'ml-1');
    span.innerText = label;

    span.classList.add('chip-selected', 'grey-on-disabled');
    span.selected = true;

    span.addEventListener('click', (evt) => {
      yearsChips[currentInterest].chip[label] = !yearsChips[currentInterest].chip[label]
      span.classList.toggle('chip-selected');
      span.selected = !span.selected;

      const dataCopy = Object.assign({}, currDataset[i]);
      this.mortgageChart.chart.data.datasets[i] = dataCopy;

      if (!span.selected){
        this.mortgageChart.chart.data.datasets[i].data = [];
      }

      this.mortgageChart.chart.update();
    })

    li.appendChild(span);
    return li;
  }
}
