const statsUrl = 'https://gpswmjqsrrsnoxpjzbcj.supabase.co';
const publicKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwc3dtanFzcnJzbm94cGp6YmNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3Mzg5MTYsImV4cCI6MjEwNjMxNDkxNn0.HZBarYW20s4Thk5mP3CS6NvdNhrgS1nrb0_S_YXVYbU';

const userTotal = document.getElementById('overtime-user-count');
const userTile = document.getElementById('overtime-user-count-mobile');
const userNote = document.getElementById('overtime-traction-status');

function showUserCount(value, note, state) {
    if (userTotal) userTotal.textContent = value;
    if (userTile) userTile.textContent = value;

    if (userNote) {
        userNote.textContent = note;
        userNote.classList.remove('success', 'error');
        if (state) userNote.classList.add(state);
    }
}

async function refreshUserCount() {
    if (!userTotal && !userTile) return;

    try {
        const endpoint = `${statsUrl}/rest/v1/public_stats?key=eq.overtime_users&select=value`;
        const response = await fetch(endpoint, {
            headers: {
                apikey: publicKey,
                Authorization: `Bearer ${publicKey}`
            }
        });

        if (!response.ok) throw new Error('Stats request failed.');

        const data = await response.json();
        const total = Number(data?.[0]?.value);

        if (!Number.isFinite(total)) throw new Error('Invalid user count.');

        const label = total >= 1000 ? `${(total / 1000).toFixed(1)}k+` : `${total}+`;
        showUserCount(label, 'Live user count', 'success');
    } catch (error) {
        console.error('Over-Time stats:', error);
        showUserCount('20+', 'Last verified: 20+', 'error');
    }
}

refreshUserCount();
