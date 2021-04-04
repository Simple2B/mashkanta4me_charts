function createFilterBtn(label, i){
  const li = document.createElement('li');
  li.classList.add('d-inline-block', 'mb-1', 'disabled');

  const span = document.createElement('span');
  span.style.color = "rgb(180, 180, 180, .8)";
  span.classList.add('badge', 'badge-secondary', 'chip', 'ml-1');
  span.innerText = label;

  span.selected = false;

  li.appendChild(span);
  return li;
}

function canvasClickEvent(){
  wpAuthModal.style.display = 'block';
}

const filterArea = document.querySelector(".filter-area");
filterArea.style.backgroundColor = "rgb(170, 170, 170, .4)";
filterArea.style.color = "rgb(180, 180, 180, .8)";