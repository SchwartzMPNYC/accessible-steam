import { simulateMouseOver, simulateMouseOut, simulateMouseOverAndOut } from '../../utils/simulateHover.js';
import { changeElementIntoMenuToggle } from '../../utils/turnIntoMenuButton.js';

const superNavContainer = document.querySelector('.supernav_container');
const observerConfig = { childList: true };

const getSubMenuToggle = subMenu => {
	// Move submenus to logical place in dom
	const subMenuType = subMenu.firstElementChild.dataset.submenuid;
	const subMenuToggleSelector = `[data-tooltip-content=".submenu_${subMenuType}"]`;
	const subMenuToggle = superNavContainer.querySelector(subMenuToggleSelector);

	return subMenuToggle;
};

const moveSubmenus = (subMenu, subMenuToggle) =>
	superNavContainer.insertBefore(subMenu, subMenuToggle.nextElementSibling);

// We can do this because the first item in the menu area has the same destination as what we're turning into a toggle
const changeIntoMenu = (subMenu, subMenuToggle) => {
	// give button role, button functionality, expanded attrs, etc
	changeElementIntoMenuToggle(subMenuToggle, subMenu, {
		ifExpanded: () => simulateMouseOut(subMenuToggle),
		ifCollapsed: () => simulateMouseOver(subMenuToggle),
	});
};

const observerCallback = function (mutationsList, observer) {
	const moveSubmenusAndAddListeners = subMenu => {
		const subMenuToggle = getSubMenuToggle(subMenu);

		moveSubmenus(subMenu, subMenuToggle);
		changeIntoMenu(subMenu, subMenuToggle);
	};

	// we're gonna cause some mutations, so lets disconnect first
	observer.disconnect();
	mutationsList.forEach(({ addedNodes }) => addedNodes.forEach(moveSubmenusAndAddListeners));
};

const observer = new MutationObserver(observerCallback);

const superNav = () => {
	observer.observe(superNavContainer, observerConfig);
	document.querySelectorAll('.menuitem.supernav').forEach(item => {
		simulateMouseOverAndOut(item);
		item.classList.add('pulldown');
	});
};

export { superNav };
