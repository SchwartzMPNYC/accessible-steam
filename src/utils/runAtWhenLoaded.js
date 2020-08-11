const runWhenLoaded = functionToRun =>
	document.readyState === 'complete' ? functionToRun() : window.addEventListener('load', functionToRun);

export { runWhenLoaded };
