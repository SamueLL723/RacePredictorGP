const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include", //Work with cookies
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.error;
            return;
        }

        message.textContent = `Welcome, ${data.user.username}!`;
    } catch (error) {
        console.error(error);
        message.textContent = "Something went wrong."
    }
});

const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", async () => {
    try {
        const response = await fetch("http://localhost:5000/logout", {
            method: "POST",
            credentials: "include"
        });

        const data = await response.json();

        message.textContent = data.message;
    } catch (error) {
        console.error(error);
        message.textContent = "Logout failed.";
    }
});