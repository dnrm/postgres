
/**
 * Checks if password has spaces in it and returns true or false depending on it;
 * @param {String} password 
 * @returns 
 */

module.exports = (password) => {
    if (password.indexOf(' ') == -1) {
        return true;
    } else {
        return false;
    }
}