function createFilterBtn(label, i) {
    const li = document.createElement('li');
    li.classList.add('d-inline-block', 'mb-1');

    const span = document.createElement('span');
    span.classList.add('badge', 'badge-secondary', 'chip', 'ml-1');
    span.innerText = label;

    span.classList.add('chip-selected');
    span.selected = true;

    span.addEventListener('click', (evt) => {
        yearsChips[currentInterest].chip[label] = !yearsChips[currentInterest].chip[label]
        span.classList.toggle('chip-selected');
        span.selected = !span.selected;

        const dataCopy = Object.assign({}, currDataset[i]);
        chart.data.datasets[i] = dataCopy;

        if (!span.selected) {
            chart.data.datasets[i].data = [];
        }

        chart.update();
    })

    li.appendChild(span);
    return li;
}

function canvasClickEvent() {}