function mortgageHistoricalTooltip(tooltipItem, data) {
    var morgageInterest = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].y || '';
    let mortgageYears = data.datasets[tooltipItem.datasetIndex].label || '';
    let sign = morgageInterest >= 0 ? '' : '-'
    let label = 'תקופה: ' + mortgageYears + ', ריבית: ' + Math.abs(morgageInterest).toFixed(2) + sign + ' [%]';
    return label;
}

chartConfig.options.tooltips = {
    callbacks: {
        label: mortgageHistoricalTooltip,
    }
}