const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/register", {
            method: "POST", //This is for backend POST /register
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ //Puts values into JSON for Backend
                username,
                email,
                password
            })
        });

        const data = await response.json(); //Reads response from Backend

        if (!response.ok) { //If f.e. 401 is statement = true.
            message.textContent = data.error;
            return;
        }

        message.textContent = "Registration successful!"

        registerForm.reset();
    } catch (error) {
        console.error(error);
        message.textContent = "Something went wrong"
    }
});