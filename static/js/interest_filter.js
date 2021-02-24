// init years slider
var sliderYears = document.getElementById('sliderYears');
noUiSlider.create(sliderYears, {
    start: [0, 30],
    tooltips: [true, true],
    tooltips: [wNumb({ decimals: 0 }), wNumb({ decimals: 0 })],
    connect: true,
    direction: 'ltr',
    step: 1,
    range: {
        'min': [0],
        'max': [30]
    },

});

// init interest slider
var sliderInterest = document.getElementById('sliderInterest');
noUiSlider.create(sliderInterest, {
    // start: [1, 4],
    start: [Math.floor(mortgageRanges.yMin * 10) / 10, Math.ceil(mortgageRanges.yMax * 10) / 10],
    tooltips: [true, true],
    tooltips: [wNumb({ decimals: 1, suffix: '%' }), wNumb({ decimals: 1, suffix: '%' })],
    connect: true,
    direction: 'ltr',
    // step: 1,
    // range: {
    //     'min': [1],
    //     'max': [4]
    // },
    range: {
        'min': [Math.floor(mortgageRanges.yMin * 10) / 10],
        'max': [Math.ceil(mortgageRanges.yMax * 10) / 10]
    },

});

// handle chart switching
function mortgageSwitchChart(selectedChart) {
    if (selectedChart.id === 'selectedLTV') {
        dataSetOriginal = dataSetOriginalLTV
        dataSetOriginalLabels = dataSetOriginalLTV.map(data => data.label)
        mortgageShowChartBy = 'selectedLTV'
    } else {
        dataSetOriginal = dataSetOriginalBank
        dataSetOriginalLabels = dataSetOriginalBank.map(data => data.label)
        mortgageShowChartBy = 'selectedBank'
    }
    
    updateChipsLTV()
    updateChipsBank()
    updatePlot()
}

// init cloned datasets for filtering
var dataSetOriginalLTV = JSON.parse(dataSetArray[0])
var dataSetOriginalBank = JSON.parse(dataSetArray[1])
var dataSetOriginal = dataSetOriginalLTV

// init LTV
var selectedLTV = {'LTV45': true, 'LTV45-60': true, 'LTV60': true};

function updateChipsLTV() {
    for (let key in selectedLTV) {
        if (selectedLTV[key] == true) {
            document.getElementById(key).classList.add('chip-selected');
        }
        document.getElementById(key).onclick = function(event) {
            event.target.classList.toggle('chip-selected');
            selectedLTV[event.target.id] = !selectedLTV[event.target.id];
            updatePlot()
        }
    }
}
updateChipsLTV()

// init bank
var selectedBank = {'הבינלאומי': true, 'מזרחי-טפחות': true, 'דיסקונט': true, 
'לאומי': true, 'פועלים': true, 'אגוד': true};

function updateChipsBank() {
    for (let key in selectedBank) {
        if (selectedBank[key] == true) {
            document.getElementById(key).classList.add('chip-selected');
        }
        document.getElementById(key).onclick = function(event) {
            event.target.classList.toggle('chip-selected');
            selectedBank[event.target.id] = !selectedBank[event.target.id];
            updatePlot()
        }
    }
}
updateChipsBank()


var mortgageShowChartBy = 'selectedLTV'

// callback for plot updating
function updatePlot(values, handle, unencoded, tap, positions) {

    // filter years, interest and bank
    let xlim = sliderYears.noUiSlider.get().map(Number)
    let ylim = sliderInterest.noUiSlider.get().map(Number)

    mortgageChart.data.datasets = []
    for (var i = 0, n = dataSetOriginal.length; i < n; ++i) {
        mortgageChart.data.datasets[i] = JSON.parse(JSON.stringify(dataSetOriginal[i]))
    }
    for (var i = 0, n = dataSetOriginal.length; i < n; ++i) {
        
        mortgageChart.data.datasets[i].data = dataSetOriginal[i].data.filter(elem => {
            let chosen
            if (mortgageShowChartBy === 'selectedLTV') {
                chosen = selectedBank[elem['bank']] === true
            } else {
                chosen = selectedLTV[elem['ltv']] === true
            }
            return elem['x'] >= xlim[0] && elem['x'] <= xlim[1] &&
            elem['y'] >= ylim[0] && elem['y'] <= ylim[1] &&
            chosen
        })
    }

    // filter LTV (important to be after years, interest and bank)
    for (var i = 0, n = mortgageChart.data.datasets.length; i < n; ++i) {
        if (mortgageShowChartBy === 'selectedLTV') {
            if (selectedLTV[mortgageChart.data.datasets[i].jsId] === false) {
                mortgageChart.data.datasets[i].data = []
            }
        } else {
            if (selectedBank[mortgageChart.data.datasets[i].jsId] === false) {
                mortgageChart.data.datasets[i].data = []
            }
        }
    }
    mortgageChart.update();

}
updatePlot()

initSliderTooltipPosition('sliderYears')
initSliderTooltipPosition('sliderInterest')

sliderYears.noUiSlider.on('slide', updatePlot)
sliderInterest.noUiSlider.on('slide', updatePlot)

sliderYears.noUiSlider.on('slide', updateSliderTooltipPosition)
sliderInterest.noUiSlider.on('slide', updateSliderTooltipPosition)
