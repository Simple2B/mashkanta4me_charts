function createResetBtn(){
  const container = document.createElement('div');
  const row = document.createElement('div');
  const col = document.createElement('div');
  const btn = document.createElement('button');

  container.classList.add('container', 'text-right');
  row.classList.add('row');
  col.classList.add('col', 'text-center', "my-2");
  btn.classList.add('btn', 'reload-page-btn');

  btn.setAttribute('type', 'button');
  btn.innerHTML = "איפוס פילטרים";

  col.appendChild(btn);
  row.appendChild(col);
  container.appendChild(row);
  return container;
}