class PrimeDashboard {
  constructor(data, containerSelector){
    this.data = data;
    const wrapper = document.querySelector(containerSelector);
    this.banks = data.Bank_name.filter(onlyUnique);
    this.setFilter(wrapper);
    this.chart = new MortgageChart(primeChartConfig, wrapper);

    //dashboards.prime.dashboard = this;
    //dashboards.prime.currDataset = dashboards.analytics.data.change_monthly;
    //dashboards.prime.currentInterest = 'change_monthly';

    //const wrapper = document.querySelector('.prime-wrapper');
    //this.mortgageChart = new MortgageChart(dashboards.prime.chartConfig, wrapper);
    //dashboards.prime.chart = this.mortgageChart.chart;

    //this.initSliders();
    //this.updateSliders();
    //this.initForecastsChips();

    // dashboards.prime.forecastsChips[dashboards.analytics.currentInterest].filter.removeAttribute('hidden');
    //dashboards.prime.updateChart = this.updateChart;
    //this.updateChart();

    //dashboards.prime.sliders.HTML.mortgageAmount.noUiSlider.on('update', sliderMoveHandler);
    //dashboards.prime.sliders.HTML.monthlyReturn.noUiSlider.on('update', sliderMoveHandler);
    //function sliderMoveHandler(values, handle, unencoded, tap, positions, noUiSlider){
    //  dashboards.prime.updateChart();
    //}

    //dashboards.prime.changeChip = this.changeChip;
  }

  setFilter(wrapper){
    const container = document.createElement('div');
    container.classList.add('container', 'text-right');
    const filterArea = document.createElement('div');
    filterArea.classList.add('row', 'filter-area');

    // view by column
    const viewByColumn = document.createElement('div');
    viewByColumn.classList.add('col-12', 'col-md-4', 'col-lg-2', 'filter-block-interest');
    const viewByHeader = document.createElement('p');
    viewByHeader.innerHTML = 'תצוגה לפי';
    viewByColumn.appendChild(viewByHeader);
    const viewByRadioUL = document.createElement('ul');
    viewByRadioUL.classList.add('type-select', 'type-select-col');

    [['selectedLTV', 'יחס הלוואה'], ['selectedBank', 'בנק']].forEach((radioData) => {
      const [inputId, labelText] = radioData;
      const inputHTML = document.createElement('input');
      inputHTML.setAttribute('type', 'radio');
      inputHTML.setAttribute('id', inputId);
      inputHTML.setAttribute('name', 'mortgageSwitchChart');

      const checkDiv = document.createElement('div');
      checkDiv.classList.add('check');

      const label = document.createElement('label');
      label.setAttribute('for', inputId);
      label.innerHTML = labelText;

      const listElement = document.createElement('li');

      listElement.appendChild(inputHTML);
      listElement.appendChild(checkDiv);
      listElement.appendChild(label);

      viewByRadioUL.appendChild(listElement);
    });

    viewByColumn.appendChild(viewByRadioUL);
    filterArea.appendChild(viewByColumn);

    // years slider
    const yearsSliderContainer = document.createElement('div');
    yearsSliderContainer.classList.add('col-12', 'col-md-4', 'col-lg-2', 'filter-block-interest');
    const yearsSliderHeader = document.createElement('p');
    yearsSliderHeader.innerHTML = 'משך השנים';
    const yearsSlider = document.createElement('div');
    yearsSlider.setAttribute('id', 'sliderYears');
    yearsSliderContainer.appendChild(yearsSliderHeader);
    yearsSliderContainer.appendChild(yearsSlider);
    filterArea.appendChild(yearsSliderContainer);

    // loan filter
    const loanFilterContainer = document.createElement('div');
    loanFilterContainer.classList.add('col-12', 'col-md-4', 'col-lg-3', 'filter-block-interest');
    const loanFilterHeader = document.createElement('p');
    loanFilterHeader.innerHTML = 'יחס הלוואה';
    loanFilterContainer.appendChild(loanFilterHeader);

    const loanButtonsUL = document.createElement('ul');
    loanButtonsUL.classList.add('p-0', 'mb-0');


    [['LTV45', 'עד 45%'], ['LTV45-60', '45% - 60%'], ['LTV60', 'מעל 60%']].forEach((buttonData) => {
      const [spanId, spanText] = buttonData;
      const buttonLI = document.createElement('li');
      buttonLI.setAttribute('d-inline-block', 'mb-1');

      const span = document.createElement('span');
      span.setAttribute('id', spanId);
      span.classList.add('badge', 'badge-secondary', 'chip', 'ml-1');

      buttonLI.appendChild(span);
      loanButtonsUL.appendChild(buttonLI);
    });
    loanFilterContainer.appendChild(loanButtonsUL);
    filterArea.appendChild(loanFilterContainer);

    // Interest slider
    const sliderInterestContainer = document.createElement('div');
    sliderInterestContainer.classList.add('col-12', 'col-md-6', 'col-lg-2', 'filter-block-interest');
    const sliderInterestHeader = document.createElement('p');
    sliderInterestHeader.innerHTML = 'ריבית שנתית';
    const sliderInterest = document.createElement('div');
    sliderInterest.setAttribute('id', 'sliderInterest');

    sliderInterestContainer.appendChild(sliderInterestHeader);
    sliderInterestContainer.appendChild(sliderInterest);
    filterArea.appendChild(sliderInterestContainer);

    // banks list
    const bankListContainer = document.createElement('div');
    bankListContainer.classList.add('col-12', 'col-md-6', 'col-lg-3', 'filter-block-interest');
    const bankListHeader = document.createElement('p');
    bankListHeader.innerHTML = 'הבנק';
    const bankListUL = document.createElement('ul');
    bankListUL.classList.add('p-0', 'mb-0');

    this.banks.forEach((bank) => {
      const buttonLI = document.createElement('li');
      buttonLI.classList.add('d-inline-block', 'mb-1');
      const span = document.createElement('span');
      span.setAttribute('id', bank);
      span.classList.add('badge', 'badge-secondary', 'chip', 'ml-1');
      span.innerHTML = bank;
      buttonLI.appendChild(span);
      bankListUL.appendChild(buttonLI);
    });
    bankListContainer.appendChild(bankListUL);
    filterArea.appendChild(bankListContainer);
    container.appendChild(filterArea);
    wrapper.appendChild(container);
  }

  changeChip(chip){
    /*
    dashboards.prime.currentInterest = chip;
    dashboards.prime.currDataset = dashboards.analytics.data[dashboards.analytics.currentInterest];
    dashboards.prime.dashboard.updateSliders();
    */
  }

  initSliders(){
    /*
    Object.values(dashboards.prime.sliders.HTML).forEach((slider) => {
      noUiSlider.create(slider, dashboards.prime.sliders.options);
    });
    */
  }


  updateSliders(){
    /*
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
    */
  }

  initForecastsChips(){
    /*
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
    */
  }

  updateChart() {
    /*
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
    */
  }
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
