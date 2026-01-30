export function clearSessionCache(prefix) {
    if (typeof sessionStorage === 'undefined') return;

    Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith(prefix)) {
            sessionStorage.removeItem(key);
        }
    });
}

export function clearMultipleCaches(prefixes) {
    if (typeof sessionStorage === 'undefined') return;

    Object.keys(sessionStorage).forEach((key) => {
        if (prefixes.some(prefix => key.startsWith(prefix))) {
            sessionStorage.removeItem(key);
        }
    });
}