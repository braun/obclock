function showSplash(show)
{
    var el = document.querySelector(".splashscreen");
    el.style.display = show ? "flex":"none";
}

module.exports.showSplash = showSplash;