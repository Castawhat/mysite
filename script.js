
// Dropdown click for mobile (supports multiple dropdowns)
document.addEventListener('DOMContentLoaded', function() {
	var dropdowns = document.querySelectorAll('.dropdown');
	dropdowns.forEach(function(dropdown) {
		var dropbtn = dropdown.querySelector('.dropbtn');
		if (dropbtn) {
			dropbtn.addEventListener('click', function(e) {
				// Only toggle on touch/click devices
				if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
					e.preventDefault();
					// Close other dropdowns
					dropdowns.forEach(function(other) {
						if (other !== dropdown) other.classList.remove('active');
					});
					dropdown.classList.toggle('active');
				}
			});
		}
	});
	// Optional: close dropdowns when clicking outside
	document.addEventListener('click', function(e) {
		dropdowns.forEach(function(dropdown) {
			if (!dropdown.contains(e.target)) {
				dropdown.classList.remove('active');
			}
		});
	});
});
