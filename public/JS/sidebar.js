document.querySelector("#more-icon").addEventListener("click", () => {
    document.querySelector(".sidebar").classList.toggle("closed");
    if(document.querySelector(".sidebar").classList.contains("closed") == false) {
        document.querySelector(".open-overlay").classList.add("active");
    } else if(document.querySelector(".sidebar").classList.contains("closed") == true) {
        document.querySelector(".open-overlay").classList.remove("active");
    }
});

if(window.location.href == "") {
    setTimeout(() => {
        document.querySelector(".sidebar").classList.add("closed");
    }, 300);
} else {
    document.querySelector(".sidebar").classList.add("closed");
}

document.onkeyup = (event) => {
    if(event.ctrlKey && event.shiftKey && event.keyCode == "S".charCodeAt(0)) {
        document.querySelector(".sidebar").classList.toggle("closed");
    }
    if(event.keyCode == 27) {
        if(document.querySelector(".sidebar").classList.contains("closed") == false) {
            document.querySelector(".sidebar").classList.add("closed");
        }
    }
};

document.querySelector(".open-overlay").addEventListener("click", () => {
    if(document.querySelector(".sidebar").classList.contains("closed") == false) {
        document.querySelector(".open-overlay").classList.remove("active");
        document.querySelector(".sidebar").classList.add("closed");
    }
});

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}
