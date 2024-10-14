function hideClick(c) {
    var els = document.getElementsByClassName(c);
    for (i = 0; i < els.length; i++) {

        console.log(els[i].style.display);

        if (els[i].style.display == "none" || els[i].style.display == "") {
            els[i].style.display = "block";
        } else {
            els[i].style.display = "none";
        }

    }
    window.dispatchEvent(new Event('resize'));
}