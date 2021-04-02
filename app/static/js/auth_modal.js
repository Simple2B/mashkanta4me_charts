var wpAuthModal = new bootstrap.Modal(document.getElementById('auth-modal'));

const closeButtons = document.querySelectorAll('.close-modal');
for (let i = 0, n = closeButtons.length; i < n; i++) {
    closeButtons[i].addEventListener('click', (evt) => {
        wpAuthModal.hide();
    });
}

const openButtons = document.querySelectorAll('.open-modal');
for (let i = 0, n = openButtons.length; i < n; i++) {
    openButtons[i].addEventListener('click', (evt) => {
        wpAuthModal.show();

    });
}

const filterButtons = document.querySelectorAll('.filter-button');
for (let i = 0, n = filterButtons.length; i < n; i++) {
    filterButtons[i].disabled = true;
}

const greyOn = document.querySelectorAll('.grey-on-disabled');
for (let i = 0, n = greyOn.length; i < n; i++) {
    greyOn[i].style.color = 'grey';
};

const form = document.getElementById('modal-auth-form');
const mailError = document.getElementById('err-email');
const passErr = document.getElementById('err-pass');


document.addEventListener("DOMContentLoaded", function(event) {
    form.addEventListener('submit', (evt) => {
        evt.preventDefault();
        const email = formatData(document.getElementById('auth-user-email').value);
        const pass = document.getElementById('auth-user-pass').value.trim();
        const data = {
            action: 'flask_auth',
            email: email,
            pass: pass,
        };

        mailError.innerHTML = " ";
        mailError.innerHTML = " ";
        $.ajaxSetup({
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
        });

        const ajax_url = document.location.origin.concat('/wp-admin/admin-ajax.php');
        console.log(ajax_url);
        $.post(ajax_url, data, (res) => {
            console.log(res);
            if (res.success) {
                document.location.reload();
            }
            if (res.data.error === "email") {

                mailError.innerHTML = res.data.message

            } else {

                passErr.innerHTML = res.data.message
            }
        })


        return false;
    });
});


function formatData(strData) {
    return strData.toLowerCase().trim();
}

function renderError(err) {

}