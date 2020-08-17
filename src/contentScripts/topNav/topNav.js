import { superNav } from './_superNav.js';
import { languageDropdown } from './_languageDropdown.js';
import { setLabel } from '../../utils/setLabel.js';

const globalHeader = document.querySelector('#global_header');
globalHeader.setAttribute('role', 'navigation');
// TODO: Come up with a better name for AT
setLabel(globalHeader, 'Top level navigation');

superNav();
languageDropdown();
