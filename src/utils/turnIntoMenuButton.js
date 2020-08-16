import { applySimulatedClickListener } from './simulateStandardClickListener.js';

const focusFirstMenuItem = menu => {
	menu.querySelector(`a,button`).focus();
};
const focusLastMenuItem = menu => {
	// Not using :last-child because not being in control of the markup means that this may not actually be the last child
	// Not using :last-of-type because I think this is gonna get updated to [role="menu-item"]
	const allItems = menu.querySelectorAll(`a,button`);
	allItems[allItems.length - 1].focus();
};
const changeElementIntoMenuToggle = (toggle, menu, actionsBasedOnExpandedState = false) => {
	// Toggle aria state and run any custom functions we need
	const expandOrCollapse = event => {
		event.preventDefault();
		const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
		toggle.setAttribute('aria-expanded', !isExpanded);

		if (actionsBasedOnExpandedState) {
			const { ifExpanded, ifCollapsed } = actionsBasedOnExpandedState;
			isExpanded ? ifExpanded() : ifCollapsed();
		}

		// if (isExpanded) menu.querySelector('a,button').focus();
	};

	// set an aria role if required... it probably is
	if (toggle.tagName !== 'button') toggle.setAttribute('role', 'button');

	// set a tabindex if our element isn't something naturally in the tab order
	if (!/(button|a)/.test(toggle.tagName)) toggle.setAttribute('tabindex', '0');

	// set our default aria-expanded attr
	toggle.setAttribute('aria-expanded', 'false');

	// expand/collapse on click
	toggle.addEventListener('click', expandOrCollapse);

	// by default a link won't listen for the spacebar, so we're adding that listener here
	applySimulatedClickListener(toggle);
};

export { changeElementIntoMenuToggle };
