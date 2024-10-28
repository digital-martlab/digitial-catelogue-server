/**
 * Response creator for API responses.
 *
 * @param {Object} res - The Express response object.
 * @param {number} statusCode - The HTTP status code.
 * @param {string} message - A message describing the result.
 * @param {Object} [data=null] - Optional data to send in the response.
 * @returns {Object} - The JSON response.
 */
const createResponse = (res, statusCode, message, data = null) => {
    const response = {
        status_code: statusCode,
        message,
    };

    if (data) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

module.exports = createResponse;