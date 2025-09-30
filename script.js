

// Dropdown click for all devices (supports multiple dropdowns)
document.addEventListener('DOMContentLoaded', function() {
	var dropdowns = document.querySelectorAll('.dropdown');
	dropdowns.forEach(function(dropdown) {
		var dropbtn = dropdown.querySelector('.dropbtn');
		if (dropbtn) {
			dropbtn.addEventListener('click', function(e) {
				e.preventDefault();
				// Close other dropdowns
				dropdowns.forEach(function(other) {
					if (other !== dropdown) other.classList.remove('active');
				});
				dropdown.classList.toggle('active');
			});
		}
	});
	// Close dropdowns when clicking outside
	document.addEventListener('click', function(e) {
		dropdowns.forEach(function(dropdown) {
			if (!dropdown.contains(e.target)) {
				dropdown.classList.remove('active');
			}
		});
	});
	// Prevent closing when clicking button
	document.querySelectorAll('.dropbtn').forEach(function(btn) {
		btn.addEventListener('click', function(e) {
			e.stopPropagation();
		});
	});
});
