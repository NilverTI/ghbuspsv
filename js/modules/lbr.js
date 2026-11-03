/* 
  Libro de Reclamaciones - abre el formulario en una nueva pestaña
*/

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const lbrTooltip = document.getElementById("lbrTooltip");
    const lbrTooltipCloseBtn = document.getElementById("lbrTooltipCloseBtn");

    if (!lbrTooltip) return;

    const closeTooltip = () => {
        lbrTooltip.classList.remove("show");
        localStorage.setItem("GHbus:lbr-tooltip-seen", "true");
    };

    const hasSeenTooltip = localStorage.getItem("GHbus:lbr-tooltip-seen");
    if (!hasSeenTooltip) {
        setTimeout(() => {
            lbrTooltip.classList.add("show");
        }, 2500);
    }

    if (lbrTooltipCloseBtn) {
        lbrTooltipCloseBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            closeTooltip();
        });
    }

    lbrTooltip.addEventListener("click", closeTooltip);
});
