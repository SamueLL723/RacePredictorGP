const API = "http://localhost:5000/riders";

// LOAD ALL RIDERS
async function loadRiders() {
    const res = await fetch(API);
    const riders = await res.json();

    const table = document.getElementById("riders-table");
    table.innerHTML = "";

    riders.forEach(r => {
        table.innerHTML += `
            <tr>
                <td>${r.rider_id}</td>
                <td>${r.number}</td>
                <td>${r.name}</td>
                <td>
                    <button class="action-btn edit" onclick="editRider(${r.rider_id}, ${r.number}, '${r.name}')">Edit</button>
                    <button class="action-btn delete" onclick="deleteRider(${r.rider_id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

// ADD RIDER
async function addRider() {
    const number = document.getElementById("rider-number").value;
    const name = document.getElementById("rider-name").value;

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number, name })
    });

    loadRiders();
}

// EDIT RIDER
async function editRider(id, oldNumber, oldName) {
    const number = prompt("New rider number:", oldNumber);
    const name = prompt("New rider name:", oldName);

    if (!number || !name) return;

    await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number, name })
    });

    loadRiders();
}

// DELETE RIDER
async function deleteRider(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadRiders();
}

loadRiders();
