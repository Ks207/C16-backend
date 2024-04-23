function validateUrl(url) {
    try {
        new URL(url);
        return url;
    } catch (err) {
        return false;
    }
};

module.exports = validateUrl;