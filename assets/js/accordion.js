// Accordion functionality from https://www.w3schools.com/howto/howto_js_accordion.asp
// Code modified on January 20, 2024 by Bing's Copilot drawing inspiration from https://stackoverflow.com/questions/37745154/only-open-one-accordion-tab-at-one-time

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        // Remove active class from all other accordion elements
        for (var j = 0; j < acc.length; j++) {
            if (j != i) {
                acc[j].classList.remove("active");
            }
        }
        // Toggle active class for the clicked element
        this.classList.toggle("active");
        // Hide all other panels
        for (var k = 0; k < acc.length; k++) {
            var panel = acc[k].nextElementSibling;
            if (k != i) {
                panel.style.display = "none";
            }
        }
        // Show or hide the panel for the clicked element
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
};
