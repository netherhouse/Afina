document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.open-modal').forEach(button => {
        button.addEventListener('click', function () {
            const url = this.getAttribute('data-url');
            fetch(url)
                .then(response => response.text())
                .then(html => {
                    document.getElementById('modal-body').innerHTML = html;
                    document.getElementById('modal').style.display = 'flex';
                })
                .catch(error => console.error('Error:', error));
        });
    });

    document.querySelector('.close-modal').addEventListener('click', function () {
        document.getElementById('modal').style.display = 'none';
    });

    document.getElementById('modal').addEventListener('click', function (event) {
        if (event.target === this) {
            this.style.display = 'none';
        }
    });
});