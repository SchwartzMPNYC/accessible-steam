const simulateStdClickListener = event => {
	const { key, target } = event;
	if (key === ' ' || key === 'Enter') {
		event.preventDefault();
		target.click();
	}
};

const applySimulatedClickListener = target => {
	target.addEventListener('keydown', simulateStdClickListener);
};

export { simulateStdClickListener, applySimulatedClickListener };
