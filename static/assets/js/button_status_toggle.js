function getCsrfToken() {
    const csrfToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
    return csrfToken ? csrfToken.split('=')[1] : '';
}

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll('.status-btn');

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const circle = this.querySelector('.circle');
            const status = this.dataset.status === 'true';
            const modelName = this.dataset.model;
            const objectId = this.dataset.id;

            if (status) {
                circle.classList.remove('filled');
                this.dataset.status = 'false';
            } else {
                circle.classList.add('filled');
                this.dataset.status = 'true';
            }

            const updateStatusUrl = `/lists/${modelName}/${objectId}/update-status/`;

            fetch(updateStatusUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken()
                },
                body: JSON.stringify({
                    status: this.dataset.status
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Status updated successfully');
                    } else {
                        console.error('Error updating status:', data.error);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
    });
});
