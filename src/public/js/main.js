function startLoad() {
	const load = document.querySelector(".preload");
	if (!load) return;
	const line = document.createElement("div");
	line.className = "preload__line";
	load.append(line);
}

function endLoad() {
	const line = document.querySelector(".preload__line");
	if (!line) return;
	line.remove();
}

function scrollUp() {
	const height = document.querySelector(".nav-wrapper").offsetHeight;
	if (document.body.scrollTop > height || document.documentElement.scrollTop > height) {
		window.scrollBy(0, -20);
		setTimeout(scrollUp, 10);
	}
}

function setList(list) {
	const dishes = list.dishes;
	const listEl = document.querySelector(".last-time__list");
	listEl.querySelectorAll(".collection-item").forEach((a) => a.remove());
	if (listEl.querySelector(".list__empty")) listEl.querySelector(".list__empty").remove();

	dishes.forEach((el, i) => {
		const li = document.createElement("li");
		li.className = "collection-item";
		li.innerHTML = `
    <div class="collection-item__insert"> ${el.name}
	<a href="/view?id=${el.id}" data-tooltip="Узнать подробнее" class="list-time__icon tooltipped secondary-content"><i class="material-icons">send</i>
	</a>

	<a href="#!"  data-id=${el.id} data-tooltip="Редактировать" class="list-time__edit list-time__icon tooltipped secondary-content">
		<i class="material-icons">edit</i>
	</a>
	<a href="#!" data-tooltip="Удалить" data-id=${el.id} class="list-time__delete list-time__icon tooltipped secondary-content">
		<i class="material-icons">delete</i>
	</a>
</div>
    `;
		listEl.append(li);
	});
}

document.addEventListener("DOMContentLoaded", function () {
	const dropdowns = document.querySelectorAll(".dropdown-trigger");
	const tooltipps = document.querySelectorAll(".tooltipped");
	const selects = document.querySelectorAll("select");
	const sidenav = document.querySelectorAll(".sidenav");
	M.Sidenav.init(sidenav, {});
	M.Dropdown.init(dropdowns, {
		coverTrigger: false,
		constrainWidth: false,
	});
	M.Tooltip.init(tooltipps, {
		enterDelay: 100,
		outDuration: 100,
		inDuration: 200,
		position: "bottom",
	});
	M.FormSelect.init(selects, {});
});

document.querySelectorAll(".refresh").forEach((a) => (a.onclick = () => location.reload()));
