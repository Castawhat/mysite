// Dropdown click for mobile
document.addEventListener('DOMContentLoaded', function() {
	var dropdown = document.querySelector('.dropdown');
	var dropbtn = document.querySelector('.dropbtn');
	if (dropdown && dropbtn) {
		dropbtn.addEventListener('click', function(e) {
			// Only toggle on touch/click devices
			if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
				e.preventDefault();
				dropdown.classList.toggle('active');
			}
		});
		// Optional: close dropdown when clicking outside
		document.addEventListener('click', function(e) {
			if (!dropdown.contains(e.target)) {
				dropdown.classList.remove('active');
			}
		});
	}
});
