document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const sentDialog = document.getElementById('email-modal');
    const closeDialog = document.getElementById('close-modal');

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const payload = new FormData(form);

            try {
                const request = await fetch('https://formspree.io/f/xlgvzele', {
                    method: 'POST',
                    body: payload,
                    headers: { Accept: 'application/json' }
                });

                if (!request.ok) {
                    throw new Error('Message could not be sent.');
                }

                form.reset();

                if (sentDialog) {
                    sentDialog.style.display = 'flex';
                }
            } catch (error) {
                console.error('Contact form:', error);
                alert('Unable to send your message right now. Please try again later.');
            }
        });
    }

    if (closeDialog && sentDialog) {
        closeDialog.addEventListener('click', () => {
            sentDialog.style.display = 'none';
        });
    }
});
