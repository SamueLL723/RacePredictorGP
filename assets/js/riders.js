const API = "http://localhost:5000/riders";

// LOAD ALL RIDERS
async function loadRiders() {
    const user = await getCurrentUser();
    
    const adminControls = document.getElementById("adminControls");
    if (adminControls) {
        adminControls.style.display = user?.role === "admin" ? "block" : "none";
    }
    
    const res = await fetch(API);
    const riders = await res.json();

    const table = document.getElementById("riders-table");
    table.innerHTML = "";

    riders.forEach(r => {
        table.innerHTML += `
            <tr>
                <td>${r.id}</td>
                <td>${r.number}</td>
                <td>${r.name}</td>
                <td>
                    ${
                        user?.role === "admin"
                            ? `
                                <button class="action-btn edit" onclick="editRider(${r.id}, ${r.number}, '${r.name}')">Edit</button>
                                <button class="action-btn delete" onclick="deleteRider(${r.id})">Delete</button>
                            ` : ""
                    }
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
        credentials: "include",
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
        credentials: "include",
        body: JSON.stringify({ number, name })
    });

    loadRiders();
}

// DELETE RIDER
async function deleteRider(id) {
    await fetch(`${API}/${id}`, { method: "DELETE", credentials: "include" });
    loadRiders();
}

loadRiders();
