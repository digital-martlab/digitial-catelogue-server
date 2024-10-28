class ErrorCreator extends Error {
    /**
     * Creates an instance of ErrorCreator.
     *
     * @param {number} statusCode - The HTTP status code associated with the error.
     * @param {string} message - The error message.
     */
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode; // HTTP status code for the error
    }
}

module.exports = ErrorCreator;