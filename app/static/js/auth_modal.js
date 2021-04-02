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


document.addEventListener("DOMContentLoaded", function(event) {
    form.addEventListener('submit', (evt) => {
        evt.preventDefault();
        const data = {
            action: 'flask_auth',
            whatever: 1234
        };
        $.post('http://127.0.0.1:8080/wp-admin/admin-ajax.php', data, (res) => {
            console.log(res);
        })


        return false;
    });
});