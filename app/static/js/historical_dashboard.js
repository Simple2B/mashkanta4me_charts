class HistoricalDashboard {
  constructor(data) {
    this.data = data;
    dashboards.historical.currDataset = this.data.real;
    dashboards.historical.currentInterest = 'real';

    for (const dataset of dashboards.historical.currDataset) {
      let xMin = Math.min.apply(Math, dataset.data.map(function (o) { return o.x; }))
      let xMax = Math.max.apply(Math, dataset.data.map(function (o) { return o.x; }))
      let yMin = Math.min.apply(Math, dataset.data.map(function (o) { return o.y; }))
      let yMax = Math.max.apply(Math, dataset.data.map(function (o) { return o.y; }))
      if (xMin < mortgageRanges.xMin) { mortgageRanges.xMin = xMin }
      if (xMax > mortgageRanges.xMax) { mortgageRanges.xMax = xMax }
      if (yMin < mortgageRanges.yMin) { mortgageRanges.yMin = yMin }
      if (yMax > mortgageRanges.yMax) { mortgageRanges.yMax = yMax }
    }

    const wrapper = document.querySelector('.historical-wrapper');
    console.log(dashboards.historical.chartConfig);
    this.mortgageChart = new MortgageChart(dashboards.historical.chartConfig, wrapper);
    dashboards.historical.chart = this.mortgageChart.chart;

    this.initYearsChips();

    const interestChangeRadio = document.querySelectorAll('.change-interest-radio');

    for (let i = 0, n = interestChangeRadio.length; i < n; i++){
      const currRadio = interestChangeRadio[i];
      if (currRadio.checked){
        dashboards.historical.currentInterest = currRadio.getAttribute('interest');
      } else {
        dashboards.historical.yearsChips[currRadio.getAttribute('interest')].filter.setAttribute('hidden', true);
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
    dashboards.historical.yearsChips[dashboards.historical.currentInterest].filter.setAttribute('hidden', true);
    dashboards.historical.yearsChips[interest].filter.removeAttribute('hidden');
    dashboards.historical.currentInterest = interest;
    dashboards.historical.currDataset = this.data[interest];

    this.updateChart();
    this.mortgageChart.chart.update();
  }

  initYearsChips(){
    // init years buttons
    const buttonListContainer = document.querySelector('.filter-button-container');
    dashboards.historical.yearsChips = {};

    for (const [key, dataset] of Object.entries(this.data)){
      const buttonList = document.createElement('ul');
      buttonList.classList.add('filter-button-list', 'list-group', 'list-group-horizontal-sm');

      const chip = {};

      dataset.forEach((points, i) => {
        chip[points.label] = true;
        const btn = createFilterBtn(points.label, i);
        buttonList.appendChild(btn);
      });

      dashboards.historical.yearsChips[key] = {'chip': chip, 'filter': buttonList};
      buttonListContainer.appendChild(buttonList);
    }
  }

  updateChart() {
    dashboards.historical.currDataset.forEach((data, i) => {
      this.mortgageChart.chart.data.dataset = [];
      const dataCopy = Object.assign({}, data);
      this.mortgageChart.chart.data.datasets[i] = dataCopy;
      if (!dashboards.historical.yearsChips[dashboards.historical.currentInterest].chip[data.label]){
        this.mortgageChart.chart.data.datasets[i].data = [];
      }
    });

    this.mortgageChart.chart.update();
  }

}
