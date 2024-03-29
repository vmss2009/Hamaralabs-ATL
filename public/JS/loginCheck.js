
async function fetchLogin() {
    await fetch("/auth")
    .then((res) => res.json())
    .then((res) => {
        console.log(res);
        if(res.loginStatus != "authenticated") {
            alert("You are not logged in");
            window.location.href = "/";
        }
    });
}

fetchLogin();
