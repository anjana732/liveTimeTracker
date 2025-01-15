
function sendErrorResponse(res) {
    res.status(500).send({
        error: "Internal server error occurred. Please try again later."
    });
}

module.exports = {sendErrorResponse}