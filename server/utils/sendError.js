module.exports = (status, message, res) => {
    res.status(status).json({
        message: message,
    });
};
