function caseOne() {
  var loader = document.getElementById('loaderId')
  loader.classList.add('loader--active')

  window.setTimeout(function() {
    loader.classList.remove('loader--active')
    window.location.href = "case1.html";
  }, 1800)
}

function caseTwo() {
  var loader = document.getElementById('loaderId')
  loader.classList.add('loader--active')

  window.setTimeout(function() {
    loader.classList.remove('loader--active')
    window.location.href = "case2.html";
  }, 1800)
}
