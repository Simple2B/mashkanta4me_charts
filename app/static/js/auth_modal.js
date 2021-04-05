let wpAuthModal;

document.addEventListener("DOMContentLoaded", function(event) {
    wpAuthModal = document.getElementById('authModal');
    const openButton = document.getElementById('openModal');
    const closeButton = document.getElementById('closeModal');
    const openLogin = document.getElementById('pro-content-login');
    const authorizationModal = document.getElementById('authorizationModal');
    const closeModalPopup = document.getElementById('closeModalPopup');
    const mailError = document.getElementById('err-email');
    const passErr = document.getElementById('err-pass');

    openButton.addEventListener('click', (evt) => {
        wpAuthModal.style.display = 'block';
    });

    closeButton.addEventListener('click', (evt) => {
        wpAuthModal.style.display = 'none';
    });

    openLogin.addEventListener('click', (evt) => {
        wpAuthModal.style.display = 'none';
        authorizationModal.style.display = 'block';
    });

    closeModalPopup.addEventListener('click', (evt) => {
        authorizationModal.style.display = 'none';
    });

    //test 
    // const btnSubmit = document.getElementById('show-register');

    // btnSubmit.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         const email = formatData(document.getElementById('login-user-email').value);
    //         const pass = document.getElementById('login-user-pass').value.trim();
    //         const remember = document.getElementById('login-user-remember').checked;

    //         const data = {
    //             action: 'flask_auth',
    //             email: email,
    //             pass: pass,
    //             remember: remember,
    //         };
    //         mailError.style.visibility = "visible";

    //         mailError.innerHTML = "emailerror emailerror email emailerror emailerror email emailerror emailerror emailemailerror emailerror email";

    //     })
    //end of test

    authorizationModal.addEventListener('sumbit', (evt) => {
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
        alert(data);
        console.log(data);
        $.ajaxSetup({
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
        });

        const ajax_url = document.location.origin.concat('/wp-admin/admin-ajax.php');
        const mailError = document.getElementById('err-email');
        const passErr = document.getElementById('err-pass');

        $.post(ajax_url, data, (res) => {
            console.log(res);
            if (res.success) {
                document.location.reload();
                return;
            }
            if (res.data.error === "email") {
                mailError.style.visibility = "visible";
                mailError.innerHTML = res.data.message;
                passErr.style.visibility = "none";
                passErr.innerHTML = " ";

            } else {
                passErr.style.visibility = "visible";
                passErr.innerHTML = res.data.message;
                mailError.style.visibility = "none";
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