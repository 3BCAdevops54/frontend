const API = 'https://job-backend-470n.onrender.com/jobs';

const jobModalEl = document.getElementById('jobModal');
const jobModal = new bootstrap.Modal(jobModalEl);
const jobForm = document.getElementById('jobForm');
const saveBtn = document.getElementById('saveBtn');
const jobsTableBody = document.querySelector('#jobsTable tbody');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');

let jobsCache = [];

async function apiFetch(url, opts = {}){
    try {
        const res = await fetch(url, opts);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.status === 204 ? null : await res.json();
    } catch (err) {
        console.error('API error', err);
        alert('API error: ' + err.message);
        throw err;
    }
}

async function loadJobs(){
    jobsCache = await apiFetch(API);
    renderJobs(jobsCache);
}

function formatDate(d){
    if(!d) return '';
    return new Date(d).toISOString().split('T')[0];
}

function statusBadge(status){
    const css = `badge-status status-${status}`;
    return `<span class="${css}">${status}</span>`;
}

function renderJobs(list){
    const filterText = searchInput.value.trim().toLowerCase();
    const status = statusFilter.value;
    const filtered = list.filter(j => {
        const matchText = [j.companyName, j.jobTitle, j.location].join(' ').toLowerCase();
        const okText = !filterText || matchText.includes(filterText);
        const okStatus = !status || j.status === status;
        return okText && okStatus;
    });

    jobsTableBody.innerHTML = '';
    filtered.forEach(job => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${job.id}</td>
            <td>${job.companyName}</td>
            <td>${job.jobTitle}</td>
            <td>${formatDate(job.applicationDate)}</td>
            <td>${statusBadge(job.status)}</td>
            <td>${job.location || ''}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-2" data-action="edit" data-id="${job.id}">Edit</button>
                <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${job.id}">Delete</button>
            </td>
        `;
        jobsTableBody.appendChild(tr);
    });
}

// Open modal for new job
document.getElementById('btnAdd').addEventListener('click', () => {
    jobForm.reset();
    document.getElementById('jobId').value = '';
    document.getElementById('applicationDate').value = '';
    document.getElementById('jobModalLabel').textContent = 'Add Job Application';
});

// Save (create or update)
saveBtn.addEventListener('click', async () => {
    const id = document.getElementById('jobId').value;
    const payload = {
        companyName: document.getElementById('companyName').value,
        jobTitle: document.getElementById('jobTitle').value,
        applicationDate: document.getElementById('applicationDate').value || null,
        status: document.getElementById('status').value,
        location: document.getElementById('location').value,
        notes: document.getElementById('notes').value
    };

    if (!payload.companyName || !payload.jobTitle) {
        alert('Company and Job Title are required');
        return;
    }

    try {
        if (id) {
            await apiFetch(`${API}/${id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
        } else {
            await apiFetch(API, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
        }
        jobModal.hide();
        await loadJobs();
    } catch (e) {
        // error handled in apiFetch
    }
});

// Table actions (edit/delete)
jobsTableBody.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === 'delete'){
        if (!confirm('Delete this job application?')) return;
        await apiFetch(`${API}/${id}`, { method: 'DELETE' });
        await loadJobs();
    }

    if (action === 'edit'){
        const job = jobsCache.find(j => String(j.id) === String(id));
        if (!job) return alert('Job not found');
        document.getElementById('jobId').value = job.id;
        document.getElementById('companyName').value = job.companyName;
        document.getElementById('jobTitle').value = job.jobTitle;
        document.getElementById('applicationDate').value = formatDate(job.applicationDate);
        document.getElementById('status').value = job.status;
        document.getElementById('location').value = job.location;
        document.getElementById('notes').value = job.notes || '';
        document.getElementById('jobModalLabel').textContent = 'Edit Job Application';
        jobModal.show();
    }
});

// Search and filter
searchInput.addEventListener('input', () => renderJobs(jobsCache));
statusFilter.addEventListener('change', () => renderJobs(jobsCache));
document.getElementById('refreshBtn').addEventListener('click', loadJobs);

// initial load
loadJobs();

