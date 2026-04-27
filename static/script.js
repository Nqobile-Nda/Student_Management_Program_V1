document.addEventListener("DOMContentLoaded", () => {
    flash_container = document.getElementById("flash-container");
    
    if (flash_container) {
        setTimeout(() => {
            flash_container.style.display = "none";
        }, 3000);
    }
});