window.onload = function() {
  var loader = document.getElementById('loaderId')
  var close = document.getElementsByClassName('close-presentation')

  loader.classList.remove('loader--active')

  const Boxlayout = (() => {
    const wrapper = document.body,
      sections = [...document.querySelectorAll(".section")],
      closeButtons = [...document.querySelectorAll(".close-section")],
      expandedClass = "is-expanded",
      hasExpandedClass = "has-expanded-item";

    const initEvents = () => {
      sections.forEach((element) => {
        element.addEventListener("click", () => openSection(element));
      });
      closeButtons.forEach((element) => {
        element.addEventListener("click", (event) => {
          event.stopPropagation();
          closeSection(element.parentElement);
        });
      });
    };

    const openSection = (element) => {
      if (!element.classList.contains(expandedClass)) {
        element.classList.add(expandedClass);
        wrapper.classList.add(hasExpandedClass);
        element.querySelector(".demo-box").style.display = "none";
        element.querySelector(".demo-box-1").style.display = "block";
        close[0].style.display = "none";
      }
    };

    const closeSection = (element) => {
      if (element.classList.contains(expandedClass)) {
        element.classList.remove(expandedClass);
        wrapper.classList.remove(hasExpandedClass);
        element.querySelector(".demo-box").style.display = "flex";
        element.querySelector(".demo-box-1").style.display = "none";
        close[0].style.display = "block";
      }
    };

    return { init: initEvents };
  })();

  Boxlayout.init();
};
