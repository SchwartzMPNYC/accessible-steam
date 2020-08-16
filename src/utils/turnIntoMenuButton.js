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

// params: toggle button, the element containing the menu items, and an object of functions in the form of { ifExpanded, ifCollapsed }
const changeElementIntoMenuToggle = (toggle, menu, actionsBasedOnExpandedState = false) => {
	// Toggle aria state and run any custom functions we need
	const expandOrCollapse = (event = false) => {
		if (event?.type === 'click') event.preventDefault();

		const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
		toggle.setAttribute('aria-expanded', !isExpanded);

		if (actionsBasedOnExpandedState) {
			const { ifExpanded, ifCollapsed } = actionsBasedOnExpandedState;
			isExpanded ? ifExpanded && ifExpanded() : ifCollapsed && ifCollapsed();
		}

		if (!isExpanded && event?.type === 'click') menu.querySelector('a,button').focus();

		// We want shift + tab to focus the element before the toggle, so we'll make it only focusable with JS when the
		// menu is expanded, and reintroduce it to the page tab flow when collapsed.
		toggle.setAttribute('tabindex', isExpanded ? '0' : '-1');
	};

	const toggleKeyboardHandler = event => {
		const { key } = event;
		switch (key) {
			case 'Escape':
				if (toggle.getAttribute('aria-expanded') === 'true') expandOrCollapse();
				break;
			case 'ArrowDown':
				event.preventDefault();
				if (toggle.getAttribute('aria-expanded') === 'false') expandOrCollapse();
				focusFirstMenuItem(menu);
				break;
			case 'ArrowUp':
				if (toggle.getAttribute('aria-expanded') === 'false') expandOrCollapse();
				event.preventDefault();
				focusLastMenuItem(menu);
				break;
		}
	};

	// menu interaction keys
	const menuKeyboardHandler = event => {
		const { key } = event;
		switch (key) {
			case 'Escape':
				// We're handling closing the menu on focusout with menuFocusOutHandler, so we shouldn't collapse it here.
				toggle.focus();
				break;
			case 'ArrowDown':
				event.preventDefault();
				document.activeElement.nextElementSibling
					? document.activeElement.nextElementSibling.focus()
					: focusFirstMenuItem(menu);
				break;
			case 'ArrowUp':
				event.preventDefault();
				document.activeElement.previousElementSibling
					? document.activeElement.previousElementSibling.focus()
					: focusLastMenuItem(menu);
				break;
		}
	};

	//collapse menu if child is not focused
	const menuFocusOutHandler = ({ relatedTarget }) => {
		if (!menu.contains(relatedTarget)) expandOrCollapse();
	};

	// set an aria role if required... it probably is
	if (toggle.tagName !== 'button') toggle.setAttribute('role', 'button');

	// set a tabindex if our element isn't something naturally in the tab order
	if (!/(button|a)/.test(toggle.tagName)) toggle.setAttribute('tabindex', '0');

	// take links in menu out of tab order
	menu.querySelectorAll('a,button').forEach(option => option.setAttribute('tabindex', '-1'));

	// set our default aria-expanded attr
	toggle.setAttribute('aria-expanded', 'false');

	// expand/collapse on click
	toggle.addEventListener('click', expandOrCollapse);
	toggle.addEventListener('keydown', toggleKeyboardHandler);

	// by default a link won't listen for the spacebar, so we're adding that listener here
	applySimulatedClickListener(toggle);

	// add events for keyboard navigation of menu items
	menu.addEventListener('keydown', menuKeyboardHandler);
	menu.addEventListener('focusout', menuFocusOutHandler);
};

export { changeElementIntoMenuToggle };
