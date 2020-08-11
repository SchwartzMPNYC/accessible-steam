// I can't beleive I have to do this... but the nav has some menu items that aren't added to the dom until the parent is hovered.
// So I'm faking that.

const simulateMouseOver = target => {
	const mouseOver = new Event('mouseover');
	target.dispatchEvent(mouseOver);
};

const simulateMouseOut = target => {
	const mouseOut = new Event('mouseout');
	target.dispatchEvent(mouseOut);
};

const simulateMouseOverAndOut = target => {
	simulateMouseOver(target);
	simulateMouseOut(target);
};

export { simulateMouseOver, simulateMouseOut, simulateMouseOverAndOut };
