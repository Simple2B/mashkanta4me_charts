class AnalyticsDashboard {
  constructor(data){
    console.log(data);
    dashboards.prime.data = data;
    dashboards.prime.dashboard = this;
    //dashboards.prime.currDataset = dashboards.analytics.data.change_monthly;
    //dashboards.prime.currentInterest = 'change_monthly';

    const wrapper = document.querySelector('.prime-wrapper');
    this.mortgageChart = new MortgageChart(dashboards.prime.chartConfig, wrapper);
    dashboards.prime.chart = this.mortgageChart.chart;

    this.initSliders();
    this.updateSliders();
    this.initForecastsChips();

    // dashboards.prime.forecastsChips[dashboards.analytics.currentInterest].filter.removeAttribute('hidden');
    dashboards.prime.updateChart = this.updateChart;
    this.updateChart();

    dashboards.prime.sliders.HTML.mortgageAmount.noUiSlider.on('update', sliderMoveHandler);
    dashboards.prime.sliders.HTML.monthlyReturn.noUiSlider.on('update', sliderMoveHandler);
    function sliderMoveHandler(values, handle, unencoded, tap, positions, noUiSlider){
      dashboards.prime.updateChart();
    }

    dashboards.prime.changeChip = this.changeChip;
  }

  changeChip(chip){
    dashboards.prime.currentInterest = chip;
    dashboards.prime.currDataset = dashboards.analytics.data[dashboards.analytics.currentInterest];
    dashboards.prime.dashboard.updateSliders();
  }

  initSliders(){
    Object.values(dashboards.prime.sliders.HTML).forEach((slider) => {
      noUiSlider.create(slider, dashboards.prime.sliders.options);
    });
  }


  updateSliders(){
    const mortgageRanges = calculateChartRanges(dashboards.prime.data[dashboards.prime.currentInterest]);

    const options = dashboards.prime.sliders.options;
    dashboards.prime.sliders.ranges = {
      mortgage: {
        'min': [Math.floor(mortgageRanges.xMin / 200000) * 200000],
        'max': [Math.ceil(mortgageRanges.xMax / 200000) * 200000],
      },

      monthly: {
        'min': [Math.floor(mortgageRanges.yMin / 1000) * 1000],
        'max': [Math.ceil(mortgageRanges.yMax / 10000) * 10000],
      },
    }

    options.step = 50000;
    options.start = [Math.floor(mortgageRanges.xMin / 200000) * 200000, Math.ceil(mortgageRanges.xMax / 200000) * 200000];
    options.range = dashboards.analytics.sliders.ranges.mortgage;

    dashboards.analytics.sliders.HTML.mortgageAmount.noUiSlider.updateOptions(options);

    options.step = 500;
    options.start = [Math.floor(mortgageRanges.yMin / 1000) * 1000, Math.ceil(mortgageRanges.yMax / 10000) * 10000];
    options.range = dashboards.analytics.sliders.ranges.monthly;

    dashboards.prime.sliders.HTML.monthlyReturn.noUiSlider.updateOptions(options);
  }

  initForecastsChips(){
    // init years buttons
    const buttonListContainer = document.querySelector('.filter-button-container');
    dashboards.prime.forecastsChips = {};

    for (const [key, dataset] of Object.entries(dashboards.prie.data)){
      const buttonList = document.createElement('ul');

      buttonList.classList.add('p-0', 'mb-0');
      buttonList.setAttribute('hidden', true);
      const chip = {};
      console.log(dataset);
      dataset.forEach((points, i) => {
        chip[points.label] = true;
        const btn = createFilterBtn(points.label, i);
        buttonList.appendChild(btn);
      });

      dashboards.prime.forecastsChips[key] = {'chip': chip, 'filter': buttonList};
      buttonListContainer.appendChild(buttonList);
    }
  }

  updateChart() {
    const xlim = sliderMortgageAmount.noUiSlider.get().map(Number);
    const ylim = sliderMonthlyReturn.noUiSlider.get().map(Number);

    dashboards.prime.currDataset.forEach((data, i) => {
      dashboards.prime.chart.data.dataset = [];
      const dataCopy = Object.assign({}, data);
      dashboards.prime.chart.data.datasets[i] = dataCopy;

      dataCopy.data = dataCopy.data.filter(elem => {
        return elem['x'] >= xlim[0] && elem['x'] <= xlim[1] && elem['y'] >= ylim[0] && elem['y'] <= ylim[1];
      });

      if (!dashboards.prime.forecastsChips[dashboards.prime.currentInterest].chip[data.label]){
        dashboards.prime.chart.data.datasets[i].data = [];
      }
    });

    dashboards.prime.chart.update();
  }
}