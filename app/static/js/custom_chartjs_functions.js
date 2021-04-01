var mortgageOptions = {
    scales: {
        xAxes: {
            gridLines: {
                zeroLineColor: 'rgb(255, 255, 255)',
                color: 'rgba(255, 255, 255, 0.15)'
            },
        },
        yAxes: {
            gridLines: {
                zeroLineColor: 'rgb(255, 255, 255)',
                color: 'rgba(255, 255, 255, 0.15)'
            },
        }
    }
}

var mortgageAddComma = (value, index, values) => {
    if(Math.abs(parseInt(value)) >= 1000){
        value = parseInt(value)
       return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
       return parseInt(value);
    }
}


var mortgageInterestTooltip = (tooltipItem, data) => {
    let ltv = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].ltv_tooltip || '';
    let bank = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].bank || '';
    let label = ['בנק: ' + bank + ', יחס הלוואה: ' + ltv,
        'ריבית: ' + parseFloat(tooltipItem.yLabel).toFixed(2) + '%' +
        ', משך ההלוואה: ' + tooltipItem.xLabel + ' שנים'];
    return label;
}

var mortgageAnalyticsTooltip = (tooltipItem, data) => {
    var monthlyReturn = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].y || '';
    let mortgageAmount = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].x || '';
    let label = 'משכנתה בגובה: ' + mortgageAddComma(mortgageAmount) + ' ש״ח, תשלום חודשי ראשוני: ' + monthlyReturn + ' ש״ח';
    return label;
}

var mortgageExpectationBarTooltip = (tooltipItem, data) => {
    var morgageInterest = tooltipItem.yLabel || '';
    let mortgageYears = tooltipItem.xLabel || '';
    let label = 'זמן: ' + mortgageYears + ' שנים, ריבית: ' + morgageInterest.toFixed(2) + '%';
    return label;
}

var mortgageExpectationLineTooltip = (tooltipItem, data) => {
    var morgageInterest = tooltipItem.yLabel || '';
    let mortgageYears = tooltipItem.xLabel || '';
    let yText = mortgageChartOptions.yLabel === 'אינפלציה [%]' ? 'אינפלציה חזויה' : 'ריבית בנק ישראל'
    let label = 'זמן: ' + mortgageYears.toFixed(2) + ' שנים, ' + yText + ': ' + morgageInterest.toFixed(2) + '%';
    return label;
}


function calculateChartRanges() {
    var mortgageRanges = {
        'xMin': Infinity,
        'xMax': -Infinity,
        'yMin': Infinity,
        'yMax': -Infinity
    }
    for (const dataset of dataSet) {
        let xMin = Math.min.apply(Math, dataset.data.map(function (o) { return o.x; }))
        let xMax = Math.max.apply(Math, dataset.data.map(function (o) { return o.x; }))
        let yMin = Math.min.apply(Math, dataset.data.map(function (o) { return o.y; }))
        let yMax = Math.max.apply(Math, dataset.data.map(function (o) { return o.y; }))
        if (xMin < mortgageRanges.xMin) { mortgageRanges.xMin = xMin }
        if (xMax > mortgageRanges.xMax) { mortgageRanges.xMax = xMax }
        if (yMin < mortgageRanges.yMin) { mortgageRanges.yMin = yMin }
        if (yMax > mortgageRanges.yMax) { mortgageRanges.yMax = yMax }
    }
    return mortgageRanges
}