const sideNav = document.getElementById('sidebar');
const navButton = document.getElementById('nav-button');

let open = true;

navButton.addEventListener('click', evt => {
  if (open) {
    sideNav.style.transform = 'translateX(-500px)';
  } else {
    sideNav.style.transform = 'translateX(0)';
  }
  open = !open;
});
