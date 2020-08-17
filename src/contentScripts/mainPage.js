import { getBadgeText } from '../utils/badgeUtils.js';
import { setLabel } from '../utils/setLabel.js';
import { runWhenLoaded } from '../utils/runAtWhenLoaded.js';

const getTextFromSelectorIfExists = (selector, wrapper = document) =>
	wrapper.querySelector(selector)?.textContent;

const getPriceFromCapsule = capsule => {
	const finalPrice = getTextFromSelectorIfExists('.discount_final_price', capsule);
	const discountPercent = getTextFromSelectorIfExists('.discount_pct', capsule);
	const orginalPrice = getTextFromSelectorIfExists('.discount_original_price', capsule);

	const addDataAndLabelToStringIfAvail = (label, data) => (data ? `${label}: ${data}. ` : '');

	return (
		addDataAndLabelToStringIfAvail('Price', finalPrice) +
		addDataAndLabelToStringIfAvail('Discount', discountPercent) +
		addDataAndLabelToStringIfAvail('Original price', orginalPrice)
	);
};

const getTitle = async capsule => {
	const { dataset } = capsule;
	const href = capsule.href || capsule.querySelector('a').href;
	let path;

	if (dataset.dsBundleid) {
		path = `bundle/${dataset.dsBundleid}/hover_public`;
	} else if (dataset.dsPackageid) {
		path = `subhoverpublic/${dataset.dsPackageid}`;
	} else {
		path = `apphoverpublic/${dataset.dsAppid}`;
	}

	const url = `https://store.steampowered.com/${path}`;

	const fetchTitleFromUrl = async (constructedUrl, backupHref) =>
		await fetch(constructedUrl)
			// If there isn't a hover for appid, then we need to load the link and get the page title
			.then(
				async response =>
					(await response.text()) || (await fetch(backupHref).then(response => response.text()))
			)
			.then(text => document.createRange().createContextualFragment(text))
			.then(
				fragment =>
					getTextFromSelectorIfExists('.hover_title', fragment) ||
					getTextFromSelectorIfExists('title', fragment)
			);

	return fetchTitleFromUrl(url, href);
};

const labelStoreCapsules = async () => {
	document
		.querySelectorAll(
			'a:not(.gutter_item)[data-ds-appid], a:not(.gutter_item)[data-ds-packageid], a:not(.gutter_item)[data-ds-bundleid]'
		)
		.forEach(capsule => {
			getTitle(capsule)
				.then(title => {
					if (title) {
						const price = getPriceFromCapsule(capsule);
						const platforms = [...capsule.querySelectorAll('.platform_img')]
							.map(getBadgeText)
							.join(', ');
						const topTags = [...capsule.querySelectorAll('.top_tag')]
							.map(tag => tag.textContent)
							.join('');
						const vrOnly = capsule.querySelector('.vr_required');

						setLabel(
							capsule,
							`${title}${price ? ': ' + price : ''}${vrOnly ? ' VR Only.' : ''}${
								platforms.length ? ' Platforms: ' + platforms + '.' : ''
							}${topTags.length ? ' Top tags: ' + topTags + '.' : ''}`
						);
					}
				})
				.catch(console.error);
		});
};

const labelSpotLights = async () => {
	for (const spotlight of document.querySelectorAll(
		':not(a)[data-ds-appid], :not(a)[data-ds-packageid], :not(a)[data-ds-bundleid]'
	)) {
		const link = spotlight.querySelector('a');
		const price = getPriceFromCapsule(spotlight);
		const spotlightHeader = spotlight.querySelector('.spotlight_content h2');

		getTitle(spotlight)
			.then(title => {
				setLabel(link, `${title}: ${spotlightHeader.textContent}.${price ? ' ' + price : ''}`);
				// link.setAttribute('aria-label', `${title}: ${spotlightHeader.textContent}.${price ? ' ' + price : ''}`);
			})
			.catch(console.error);
	}
};

const labelweekLongDealsIdentifier = () => {
	// TODO: See if we need to aria-hide the new deals each week div to keep it from repeating within the link.
	document
		.querySelectorAll('.spotlight_weeklong_ctn')
		.forEach(weekLongDealsIdentifier =>
			setLabel(
				weekLongDealsIdentifier.parentNode,
				`Week long deals: ${
					weekLongDealsIdentifier.querySelector('.spotlight_count').textContent
				} on sale this week. ${
					weekLongDealsIdentifier.parentNode.querySelector('.spotlight_weeklong_subtitle')
						?.textContent
				}`
			)
		);
};

const applySemanticsToGutterNav = () => {
	const gutterItemsSublistSelector = '.gutter_items';
	const gutter = document.querySelector('.home_page_gutter');
	const gutterBlocks = gutter.querySelectorAll('.home_page_gutter_block');

	const createList = (elToBeListified, header) => {
		// This will filter out the header and wrap links in LI elements
		const listItemReducer = (listItems, link) => {
			if (link !== header) {
				const li = document.createElement('li');
				li.append(link);
				listItems.push(li);
			}

			return listItems;
		};

		// create & label semantic list element
		const list = document.createElement('ul');
		setLabel(list, header.textContent.trim());
		// hide the header from AT
		header.setAttribute('aria-hidden', 'true');
		// append links to list el, once they've been filtered and wrapped
		list.append(...[...elToBeListified.children].reduce(listItemReducer, []));
		// append semantic list in place
		elToBeListified.append(list);
	};

	gutter.setAttribute('role', 'navigation');
	// TODO: Come up with a name for AT that's actually descriptive of content and not placement on page.
	setLabel(gutter, 'Side navigation');

	gutterBlocks.forEach(block => {
		if (block.querySelector(gutterItemsSublistSelector)) {
			// If a gutter block as a 'gutter items' node we want to make that into a list
			block.querySelectorAll(gutterItemsSublistSelector).forEach(toListify => {
				const header = toListify.previousElementSibling;
				createList(toListify, header);
			});
		} else {
			// If there's no 'gutter items' block, then we make the entire block into a list
			const header = block.querySelector('.gutter_header');
			createList(block, header);
		}
	});
};

const accessify = async () => {
	labelweekLongDealsIdentifier();
	labelSpotLights();
	labelStoreCapsules();
	applySemanticsToGutterNav();
	console.log('Accessified Steam');
};

// Steam has some events firing during load that end up messing with data attributes we need to make this work,
// so we need to wait until the page has loaded to start
runWhenLoaded(accessify);
