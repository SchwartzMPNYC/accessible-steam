import { changeElementIntoMenuToggle } from '../utils/turnIntoMenuButton.js';

const languageToggle = document.querySelector('#language_pulldown');
const languageDropdownItems = document.querySelector('#language_dropdown');

changeElementIntoMenuToggle(languageToggle, languageDropdownItems, {
	ifExpanded: () => document.body.click(),
});
