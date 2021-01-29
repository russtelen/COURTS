// =================================
// Toggle Form
// ==================================
toggleForm = () => {
  var x = document.getElementById("image-form");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
};

// =================================
// BOOTSTRAP CLIENT SIDE VALIDATION
// ==================================
(function () {
  "use strict";
  window.addEventListener(
    "load",
    function () {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName("validated-form");
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener(
          "submit",
          function (event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add("was-validated");
          },
          false
        );
      });
    },
    false
  );
})();

// =================================
// SPLIDE JS
// ==================================
document.addEventListener("DOMContentLoaded", function () {
  new Splide(".splide", {
    type: "loop",
    perPage: 3,
    perMove: 1,
    autplay: true,
    breakpoints: {
      600: {
        perPage: 1,
        gap: "1rem",
      },
    },
  }).mount();
});
