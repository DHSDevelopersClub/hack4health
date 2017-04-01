const sideNav = document.getElementById('sidebar');
const navButton = document.getElementById('nav-button');


navButton.addEventListener('click', evt => {
  console.log('click');
  let delta = sideNav.style.width;
  sideNav.style.transform = 'translateX(-100px)';
});
