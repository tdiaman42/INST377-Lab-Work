const first = document.querySelector('.carousel-item.visible');
const last = document.querySelector('.carousel-item:last-of-type');

let current = first;

document.querySelector('#next-button').onclick = (e) => {
  if (current.nextElementSibling) {
    current.classList.remove('visible');
    current.nextElementSibling.classList.add('visible');
    current = current.nextElementSibling;
  } else {
    current.classList.remove('visible');
    first.classList.add('visible');
    current = first;
  }
};

document.querySelector('#previous-button').onclick = (e) => {
  if (current.previousElementSibling) {
    current.classList.remove('visible');
    current.previousElementSibling.classList.add('visible');
    current = current.previousElementSibling;
  } else {
    current.classList.remove('visible');
    last.classList.add('visible');
    current = last;
  }
};
