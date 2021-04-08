document.addEventListener('DOMContentLoaded', (evt) => {
  const api = new Api('prime_index');
  api.getFetch((data) => {
    console.log(data);
    
    //const dashboard = new PrimeIndexDashboard(data);
  });
});
