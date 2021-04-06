dashboards.analytics.chipsIdMap = {
  'dataSetChangeMonthlyOriginal': 'change_monthly',
  'dataSetLoanCostOriginal': 'loan_cost',
  'dataSetPrincipalHalvedOriginal': 'principal_halved',
}


document.addEventListener('DOMContentLoaded', (e) => {
  const changeChipsRadio = document.querySelectorAll(".analytics-switch-chip");
  changeChipsRadio.forEach((btn) => {
    btn.removeAttribute('disabled');
    btn.addEventListener('change', (evt) => {
      const btnId = btn.getAttribute('id');
      const chipName = dashboards.analytics.chipsIdMap[btnId];
      dashboards.analytics.changeChip(chipName);
    });
  });
});



function createFilterBtn(label, i) {
  const li = document.createElement('li');
  li.classList.add('d-inline-block', 'mb-1', 'filter-button');
  const span = document.createElement('span');
  span.classList.add('badge', 'badge-secondary', 'chip', 'ml-1');
  span.innerText = label;

  span.classList.add('chip-selected');
  span.selected = true;

  span.addEventListener('click', (evt) => {
    dashboards.analytics.forecastsChips[dashboards.analytics.currentInterest].chip[label] = !dashboards.analytics.forecastsChips[dashboards.analytics.currentInterest].chip[label]
    span.classList.toggle('chip-selected');
    span.selected = !span.selected;

    const dataCopy = Object.assign({}, dashboards.analytics.currDataset[i]);
    dashboards.analytics.chart.data.datasets[i] = dataCopy;

    if (!span.selected) {
        dashboards.analytics.chart.data.datasets[i].data = [];
    }

    dashboards.analytics.updateChart();
  });

  li.appendChild(span);
  return li;
}

dashboards.analytics.chartConfig.options.tooltips.callbacks.label = (tooltipItem, data) => {
  var monthlyReturn = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].y || '';
  let mortgageAmount = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].x || '';
  let label = 'משכנתה בגובה: ' + mortgageAddComma(mortgageAmount) + ' ש״ח, תשלום חודשי ראשוני: ' + monthlyReturn + ' ש״ח';
  return label;
}
