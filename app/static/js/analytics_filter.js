// init mortgage amount slider
var sliderMortgageAmount = document.getElementById('sliderMortgageAmount');
noUiSlider.create(sliderMortgageAmount, {
    start: [Math.floor(mortgageRanges.xMin / 200000) * 200000, Math.ceil(mortgageRanges.xMax / 200000) * 200000],
    tooltips: [true, true],
    tooltips: [wNumb({ decimals: 0, thousand: ',' }), wNumb({ decimals: 0, thousand: ',' })],
    connect: true,
    direction: 'ltr',
    step: 50000,

    range: {
        'min': [Math.floor(mortgageRanges.xMin / 200000) * 200000],
        'max': [Math.ceil(mortgageRanges.xMax / 200000) * 200000]
    },
});

// init monthly return slider
var sliderMonthlyReturn = document.getElementById('sliderMonthlyReturn');
noUiSlider.create(sliderMonthlyReturn, {
    start: [Math.floor(mortgageRanges.yMin / 1000) * 1000, Math.ceil(mortgageRanges.yMax / 10000) * 10000],
    tooltips: [true, true],
    tooltips: [wNumb({ decimals: 0, thousand: ',' }), wNumb({ decimals: 0, thousand: ',' })],
    connect: true,
    direction: 'ltr',
    step: 500,

    range: {
        'min': [Math.floor(mortgageRanges.yMin / 1000) * 1000],
        'max': [Math.ceil(mortgageRanges.yMax / 10000) * 10000]
    },

});

// handle chart switching
function mortgageSwitchChart(selectedChart) {
    dataSet = JSON.parse(JSON.stringify(window[selectedChart.id]))
    dataSetOriginal = JSON.parse(JSON.stringify(window[selectedChart.id]))
    dataSetOriginalLabels = JSON.parse(JSON.stringify(window[selectedChart.id + 'Labels']))
    dataSetOriginalHeader = JSON.parse(JSON.stringify(window[selectedChart.id + 'Header']))
    updateChartHeader()
    updateChips()
    updatePlot()
}

// init cloned datasets for filtering
var dataSetOriginal = []
var dataSetOriginalHeader = dataSet[0].header
var dataSetOriginalLabels = []
var dataSetChangeMonthlyOriginal = []
var dataSetChangeMonthlyOriginalLabels = []
var dataSetChangeMonthlyOriginalHeader = dataSetChangeMonthly[0].header
var dataSetLoanCostOriginal = []
var dataSetLoanCostOriginalLabels = []
var dataSetLoanCostOriginalHeader = dataSetLoanCost[0].header
var dataSetPrincipalHalvedOriginal = []
var dataSetPrincipalHalvedOriginalLabels = []
var dataSetPrincipalHalvedOriginalHeader = dataSetPrincipalHalved[0].header

for (var i = 0, n = dataSet.length; i < n; ++i) {
    dataSetOriginal[i] = JSON.parse(JSON.stringify(dataSet[i].data));
    dataSetOriginalLabels[i] = JSON.parse(JSON.stringify(dataSet[i].label));

    dataSetChangeMonthlyOriginal[i] = JSON.parse(JSON.stringify(dataSetChangeMonthly[i].data));
    dataSetChangeMonthlyOriginalLabels[i] = JSON.parse(JSON.stringify(dataSetChangeMonthly[i].label));
    dataSetLoanCostOriginal[i] = JSON.parse(JSON.stringify(dataSetLoanCost[i].data));
    dataSetLoanCostOriginalLabels[i] = JSON.parse(JSON.stringify(dataSetLoanCost[i].label));
    dataSetPrincipalHalvedOriginal[i] = JSON.parse(JSON.stringify(dataSetPrincipalHalved[i].data));
    dataSetPrincipalHalvedOriginalLabels[i] = JSON.parse(JSON.stringify(dataSetPrincipalHalved[i].label));
}

// init form danger header
function updateChartHeader() {
    document.getElementById('danger-level-header').innerText = dataSetOriginalHeader
}
updateChartHeader()

// init danger levels
var dangerLevel = { '1': true, '2': true, '3': true, '4': true, '5': true };

// update chips to match the dataset
function updateChips() {
    for (let key in dangerLevel) {
        document.getElementById(key).innerText = dataSetOriginalLabels[Number(key - 1)]
        if (dangerLevel[key] == true) {
            document.getElementById(key).classList.add('chip-selected');
        }
        document.getElementById(key).onclick = function (event) {
            event.target.classList.toggle('chip-selected');
            dangerLevel[event.target.id] = !dangerLevel[event.target.id];
            updatePlot()
        }
    }
}
updateChips()


// callback for plot updating
function updatePlot(values, handle, unencoded, tap, positions) {

    // filter mortgage amount, monthly return and danger level
    let xlim = sliderMortgageAmount.noUiSlider.get().map(Number)
    let ylim = sliderMonthlyReturn.noUiSlider.get().map(Number)
    for (var i = 0, n = mortgageChart.data.datasets.length; i < n; ++i) {
        mortgageChart.data.datasets[i].data = dataSetOriginal[i].filter(elem =>
            elem['x'] >= xlim[0] && elem['x'] <= xlim[1] &&
            elem['y'] >= ylim[0] && elem['y'] <= ylim[1] &&
            dangerLevel[elem['danger']] === true)
        mortgageChart.data.datasets[i].label = dataSetOriginalLabels[i]
    }


    mortgageChart.update();

}
updatePlot()


initSliderTooltipPosition('sliderMortgageAmount')
initSliderTooltipPosition('sliderMonthlyReturn')

sliderMortgageAmount.noUiSlider.on('slide', updatePlot)
sliderMonthlyReturn.noUiSlider.on('slide', updatePlot)

sliderMortgageAmount.noUiSlider.on('slide', updateSliderTooltipPosition)
sliderMonthlyReturn.noUiSlider.on('slide', updateSliderTooltipPosition)
