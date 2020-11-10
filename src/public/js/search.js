document.addEventListener("DOMContentLoaded", function () {
	document.getElementById("search__field")?.addEventListener("input", (event) => {
		const query = event.target.value.toLowerCase().trim();
		const dishes = document.querySelectorAll(".dish__cards .dish__cards-item");
		dishes.forEach((card) => {
			if (
				card.querySelector(".dish__cards-content")?.textContent.toLowerCase().trim().includes(query)
			) {
				card.style.display = "block";
			} else card.style.display = "none";
		});
	});
});
