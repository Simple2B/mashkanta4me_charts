class AnalyticsDashboard {
  constructor(data){
    dashboards.analytics.data = data;
    dashboards.analytics.dashboard = this;
    dashboards.analytics.currDataset = dashboards.analytics.data.change_monthly;
    dashboards.analytics.currentInterest = 'change_monthly';

    const wrapper = document.querySelector('.analytics-wrapper');
    this.mortgageChart = new MortgageChart(dashboards.analytics.chartConfig, wrapper);
    dashboards.analytics.chart = this.mortgageChart.chart;

    this.initSliders();
    this.updateSliders();
    this.initForecastsChips();

    dashboards.analytics.forecastsChips[dashboards.analytics.currentInterest].filter.removeAttribute('hidden');
    dashboards.analytics.updateChart = this.updateChart;
    this.updateChart();

    dashboards.analytics.sliders.HTML.mortgageAmount.noUiSlider.on('update', sliderMoveHandler);
    dashboards.analytics.sliders.HTML.monthlyReturn.noUiSlider.on('update', sliderMoveHandler);
    function sliderMoveHandler(values, handle, unencoded, tap, positions, noUiSlider){
      dashboards.analytics.updateChart();
    }

    dashboards.analytics.changeChip = this.changeChip;
  }

  changeChip(chip){
    dashboards.analytics.currentInterest = chip;
    dashboards.analytics.currDataset = dashboards.analytics.data[dashboards.analytics.currentInterest];
    dashboards.analytics.dashboard.updateSliders();
  }

  initSliders(){
    Object.values(dashboards.analytics.sliders.HTML).forEach((slider) => {
      noUiSlider.create(slider, dashboards.analytics.sliders.options);
    });
  }


  updateSliders(){
    const mortgageRanges = calculateChartRanges(dashboards.analytics.data[dashboards.analytics.currentInterest]);

    const options = dashboards.analytics.sliders.options;
    dashboards.analytics.sliders.ranges = {
      mortgage: {
        'min': [Math.floor(mortgageRanges.xMin / 200000) * 200000],
        'max': [Math.ceil(mortgageRanges.xMax / 200000) * 200000],
      },

      monthly: {
        'min': [Math.floor(mortgageRanges.yMin / 1000) * 1000],
        'max': [Math.ceil(mortgageRanges.yMax / 10000) * 10000],
      },
    }

    console.log(dashboards.analytics.sliders)
    options.step = 50000;
    options.start = [Math.floor(mortgageRanges.xMin / 200000) * 200000, Math.ceil(mortgageRanges.xMax / 200000) * 200000];
    options.range = dashboards.analytics.sliders.ranges.mortgage;

    dashboards.analytics.sliders.HTML.mortgageAmount.noUiSlider.updateOptions(options);

    options.step = 500;
    options.start = [Math.floor(mortgageRanges.yMin / 1000) * 1000, Math.ceil(mortgageRanges.yMax / 10000) * 10000];
    options.range = dashboards.analytics.sliders.ranges.monthly;

    dashboards.analytics.sliders.HTML.monthlyReturn.noUiSlider.updateOptions(options);
  }

  initForecastsChips(){
    // init years buttons
    const buttonListContainer = document.querySelector('.filter-button-container');
    dashboards.analytics.forecastsChips = {};

    for (const [key, dataset] of Object.entries(dashboards.analytics.data)){
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

      dashboards.analytics.forecastsChips[key] = {'chip': chip, 'filter': buttonList};
      buttonListContainer.appendChild(buttonList);
    }
  }

  updateChart() {
    const xlim = sliderMortgageAmount.noUiSlider.get().map(Number);
    const ylim = sliderMonthlyReturn.noUiSlider.get().map(Number);

    dashboards.analytics.currDataset.forEach((data, i) => {
      dashboards.analytics.chart.data.dataset = [];
      const dataCopy = Object.assign({}, data);
      dashboards.analytics.chart.data.datasets[i] = dataCopy;

      dataCopy.data = dataCopy.data.filter(elem => {
        return elem['x'] >= xlim[0] && elem['x'] <= xlim[1] && elem['y'] >= ylim[0] && elem['y'] <= ylim[1];
      });

      if (!dashboards.analytics.forecastsChips[dashboards.analytics.currentInterest].chip[data.label]){
        dashboards.analytics.chart.data.datasets[i].data = [];
      }
    });

    dashboards.analytics.chart.update();
  }
}