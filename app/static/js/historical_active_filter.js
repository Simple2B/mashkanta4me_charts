function createFilterBtn(label, i) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.classList.add('badge', 'badge-secondary', 'chip', 'ml-1');
    span.innerText = label;

    span.classList.add('chip-selected');
    span.selected = true;

    span.addEventListener('click', (evt) => {
        dashboards.historical.yearsChips[dashboards.historical.currentInterest].chip[label] = !dashboards.historical.yearsChips[dashboards.historical.currentInterest].chip[label]
        span.classList.toggle('chip-selected');
        span.selected = !span.selected;

        const dataCopy = Object.assign({}, dashboards.historical.currDataset[i]);
        dashboards.historical.chart.data.datasets[i] = dataCopy;

        if (!span.selected) {
            dashboards.historical.chart.data.datasets[i].data = [];
        }

        dashboards.historical.chart.update();
    })

    li.appendChild(span);
    return li;
}

function canvasClickEvent() {}

console.log(dashboards.historical);

/*
tooltips: {
    callbacks: {
      label: (tooltipItem, data) => {
        var morgageInterest = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].y || '';
        let mortgageYears = data.datasets[tooltipItem.datasetIndex].label || '';
        let sign = morgageInterest >= 0 ? '' : '-'
        let label = 'תקופה: ' + mortgageYears + ', ריבית: ' + Math.abs(morgageInterest).toFixed(2) + sign + ' [%]';
        return label;
      },
    }
},

*/

dashboards.historical.chartConfig.options.tooltips = {
  callbacks: {
    label: (tooltipItem, data) => {
      var morgageInterest = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].y || '';
      let mortgageYears = data.datasets[tooltipItem.datasetIndex].label || '';
      let sign = morgageInterest >= 0 ? '' : '-'
      let label = 'תקופה: ' + mortgageYears + ', ריבית: ' + Math.abs(morgageInterest).toFixed(2) + sign + ' [%]';
      return label;
    },
  }
}
