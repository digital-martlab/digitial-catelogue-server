const catchAsyncHandler = (fn) => (req, res, next) => {
    // Ensures that any errors occurring in the async function are caught and passed to the next middleware
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsyncHandler;