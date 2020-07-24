const labelPlatformBadges = () => {
    document.querySelectorAll('.platform_img').forEach(badge => {
        // If we make these into a list in some places, these are the wrapper classes for the parents.
        // Unfortunately, not everywhere has one:
        // game_area_purchase_platform
        // platform

        const platform = getBadgeText(badge);
        if (platform) setLabel(badge, platform);
    });
};

const getBadgeText = badge => {
    let platform = badge.getAttribute('title');

    if (!platform)
        switch (badge.classList[1]) {
            case 'win':
                platform = 'Windows';
                break;
            case 'linux':
                platform = 'Linux';
                break;
            case 'mac':
                platform = 'Mac';
                break;
            case 'valveindex':
                platform = 'Valve Index';
                break;
            case 'htcvive':
                platform = 'HTC Vive';
                break;
            case 'oculusrift':
                platform = 'Oculus Rift';
                break;
            case 'windowsmr':
                platform = 'Windows Mixed Reality';
                break;
        }

    return platform;
};

export {
    labelPlatformBadges,
    getBadgeText
};
