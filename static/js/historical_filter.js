// handle chart switching
function mortgageSwitchChart(selectedChart) {
    if (selectedChart.id === 'mortgageNominal') {
        dataSet = JSON.parse(JSON.stringify(dataSetOriginalNominal))
        dataSetOriginal = JSON.parse(JSON.stringify(dataSetOriginalNominal))
        dataSetOriginalLabels = JSON.parse(JSON.stringify(dataSetOriginalNominalLabels))
    } else {
        dataSet = JSON.parse(JSON.stringify(dataSetOriginalReal))
        dataSetOriginal = JSON.parse(JSON.stringify(dataSetOriginalReal))
        dataSetOriginalLabels = JSON.parse(JSON.stringify(dataSetOriginalRealLabels))
    }
    updateChips()
    updatePlot()
}

// init cloned datasets for filtering
var dataSetOriginal = []
var dataSetOriginalLabels = []
var dataSetOriginalReal = []
var dataSetOriginalRealLabels = []
var dataSetOriginalNominal = []
var dataSetOriginalNominalLabels = []

for (var i = 0, n = dataSet.length; i < n; ++i) {
    dataSetOriginal[i] = JSON.parse(JSON.stringify(dataSet[i].data));
    dataSetOriginalLabels[i] = JSON.parse(JSON.stringify(dataSet[i].label));
    dataSetOriginalReal[i] = JSON.parse(JSON.stringify(dataSetReal[i].data));
    dataSetOriginalRealLabels[i] = JSON.parse(JSON.stringify(dataSetReal[i].label));
    dataSetOriginalNominal[i] = JSON.parse(JSON.stringify(dataSetNominal[i].data));
    dataSetOriginalNominalLabels[i] = JSON.parse(JSON.stringify(dataSetNominal[i].label));
}


// init chips
var yearsChips = {
    '1': false, '2': false, '3': false, '4': false, '5': true,
    '6': false, '7': false, '8': false,
};

// update chips to match the dataset
function updateChips() {
    for (let key in yearsChips) {
        document.getElementById(key).innerText = dataSetOriginalLabels[Number(key - 1)]
        if (yearsChips[key] == true) {
            document.getElementById(key).classList.add('chip-selected');
        }
        document.getElementById(key).onclick = function (event) {
            event.target.classList.toggle('chip-selected');
            yearsChips[event.target.id] = !yearsChips[event.target.id];
            updatePlot()
        }
    }
}
updateChips()

// callback for plot updating
function updatePlot(values, handle, unencoded, tap, positions) {

    for (var i = 0, n = mortgageChart.data.datasets.length; i < n; ++i) {
        if (yearsChips[i + 1] === false) {
            mortgageChart.data.datasets[i].data = []
        } else {
            mortgageChart.data.datasets[i].data = dataSetOriginal[i]
        }
        mortgageChart.data.datasets[i].label = dataSetOriginalLabels[i]
    }

    mortgageChart.update();

}
updatePlot()
