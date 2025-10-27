const placeholderLinks = document.querySelectorAll('.journal-article .inline-link[href="#"]');

function handlePlaceholderClick(event) {
  event.preventDefault();
  document.dispatchEvent(
    new CustomEvent('cart:feedback', {
      detail: 'Journal downloads are part of the full Nebula platform experience.'
    })
  );
}

function initJournal() {
  placeholderLinks.forEach((link) => {
    link.addEventListener('click', handlePlaceholderClick);
  });
}

initJournal();
