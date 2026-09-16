const getCurrentUser = async () => {
    try {
        const response = await fetch("http://localhost:5000/me", {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        return data.user;

    } catch (error) {
        console.error("Failed to get current user:", error);
        return null;
    }
}

getCurrentUser().then(user => {
   console.log("Current user:", user);
});