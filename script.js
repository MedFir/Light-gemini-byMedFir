function handleBrokenImage(img) {
    if (img.classList.contains('opt-img-broken')) return;

    img.classList.add('opt-img-broken');
    img.removeAttribute('src');
    img.removeAttribute('alt');
}

document.addEventListener('error', function(event) {
    if (event.target && event.target.tagName === 'IMG') {
        handleBrokenImage(event.target);
    }
}, true);
