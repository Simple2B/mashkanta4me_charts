let wpAuthModal;

document.addEventListener("DOMContentLoaded", function(event) {
    wpAuthModal = document.getElementById('authModal');

    const closeButton = document.getElementById('closeModal');
    closeButton.addEventListener('click', (evt) => {
        wpAuthModal.style.display = 'none';
    });

    const openLogin = document.getElementById('pro-content-login');
    const authorizationModal = document.getElementById('authorizationModal');
    openLogin.addEventListener('click', (evt) => {
        wpAuthModal.style.display = 'none';
        authorizationModal.style.display = 'block';
    });

    const closeModalPopup = document.getElementById('closeModalPopup');
    closeModalPopup.addEventListener('click', (evt) => {
        authorizationModal.style.display = 'none';
    });


    authorizationModal.addEventListener('submit', (evt) => {
      evt.preventDefault();
      const email = formatData(document.getElementById('login-user-email').value);
      const pass = document.getElementById('login-user-pass').value.trim();
      const remember = document.getElementById('login-user-remember').checked;
      const data = {
          action: 'flask_auth',
          email: email,
          pass: pass,
          remember: remember,
      };

      $.ajaxSetup({
          crossDomain: true,
          xhrFields: {
              withCredentials: true
          },
      });

      const ajax_url = document.location.origin.concat('/wp-admin/admin-ajax.php');
      // const ajax_url = 'https:///www.mashkanta4.me/wp-admin/admin-ajax.php';
      const mailError = document.getElementById('err-email');
      const passErr = document.getElementById('err-pass');

      $.post(ajax_url, data, (res) => {
          console.log(res);
          if (res.success) {
              document.cookie = encodeURIComponent('wp_auth') + '=' + encodeURIComponent(JSON.stringify(res.data))
              document.location.reload();
              return;
          }
          if (res.data.error === "email") {

              mailError.innerHTML = res.data.message;
              passErr.innerHTML = " ";

          } else {

              passErr.innerHTML = res.data.message;
              mailError.innerHTML = " ";
          }
      })

      return false;
  });

  function formatData(strData) {
    return strData.toLowerCase().trim();
}
});


const filterButtons = document.querySelectorAll('.filter-button');
for (let i = 0, n = filterButtons.length; i < n; i++) {
    filterButtons[i].disabled = true;
}

const greyOn = document.querySelectorAll('.grey-on-disabled');
for (let i = 0, n = greyOn.length; i < n; i++) {
    greyOn[i].style.color = 'grey';
};

const allFilters = document.querySelectorAll('.open-modal');
allFilters.forEach((filter) => {
  filter.addEventListener('click', (e) => {
    authorizationModal.style.display = 'block';
  });
});