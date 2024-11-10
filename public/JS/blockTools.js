
// const createCursor = (x, y) => {
//     const cursor = document.createElement("div");
//     cursor.className = "cursor";
//     cursor.style.left = `${x}px`;
//     cursor.style.top = `${y}px`;
//     return cursor;

// };

// window.addEventListener("click", (e) => {
//     const cursor = createCursor(e.x, e.y);

//     document.body.appendChild(cursor);

//     setTimeout(() => {
//         cursor.remove();
//     }, 600);
// });

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    console.log("Mobile");
    toggleFullScreen();
} else{
    const cm = document.getElementById("custom-cm");
    
    function showContextMenu(show = true, x, y) {
        cm.style.display = show ? "block" : "none";
    }
    
    window.addEventListener("contextmenu", e => {
        e.preventDefault();
        cm.style.top = (pageYOffset + e.y) + "px";
      cm.style.left =
        (e.x + cm.offsetWidth > window.innerWidth
          ? window.innerWidth - cm.offsetWidth
          : e.x)+ "px"
        showContextMenu();
    });
    
    document.querySelector(".custom-cm__item.backward").addEventListener("click", () => {
        window.history.back();
    });
    
    document.querySelector(".custom-cm__item.forward").addEventListener("click", () => {
        window.history.forward();
    });
    
    document.querySelector(".custom-cm__item.reload").addEventListener("click", () => {
        window.location.reload();
    });

    if(location.pathname != "/") {
        document.querySelector(".custom-cm__item.toggle-sidebar").addEventListener("click", () => {
            document.querySelector(".sidebar").classList.toggle("closed");
        });
    } else {
        document.querySelector(".custom-cm__item.toggle-sidebar").remove();
        document.querySelector(".custom-cm__divider").remove();
    }
    
    window.addEventListener("click", () => {
        showContextMenu(false);
    });
}
