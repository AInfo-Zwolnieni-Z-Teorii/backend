const bcrypt = require("bcrypt");

const saltRounds = 10;

/**
 * Generates a hash for a given password.
 *
 * @param {string} password - password to hash
 * @returns {string} - hashed password
 */
const hashPassword = (password) => {
	const salt = bcrypt.genSaltSync(saltRounds);
	return bcrypt.hashSync(password, salt);
};

/**
 * Compares a given password with its hashed version.
 *
 * @param {string} password - password to compare
 * @param {string} hash - hashed password
 * @returns {boolean} - true if the password matches the hash, false otherwise
 */
const comparePassword = (password, hash) => {
	return bcrypt.compareSync(password, hash);
};

// Replace polish chars with their english equivalent
const polishCharsMap = {
	ą: "a",
	ć: "c",
	ę: "e",
	ł: "l",
	ń: "n",
	ó: "o",
	ś: "s",
	ź: "z",
	ż: "z",
};

/**
 * Replaces polish characters with their english equivalent.
 *
 * @param {string} str - input string
 * @returns {string} - string with polish characters replaced
 */
const replacePolishChars = (str) => {
	return str.replace(/[ąćęłńóśźż]/g, (char) => polishCharsMap[char] || char);
};

/**
 * Generates an anchor from a given string. Polish characters are replaced with their
 * english equivalent, string is lowercased and all non-alphanumeric characters are
 * replaced with a single dash. The anchor is then trimmed of any leading/trailing
 * dashes.
 *
 * @param {string} str - input string
 * @returns {string} - generated anchor
 */
const generateAnchorSlug = (str) => {
	return replacePolishChars(str)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
};

module.exports = {
	hashPassword,
	comparePassword,
	replacePolishChars,
	generateAnchorSlug,
};
