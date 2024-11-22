module.exports.routeErrorHandling = (res, filePath) => {
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(`Error sending file: ${filePath}`, err);
            res.status(err.status || 500).send('An error occurred while loading the page.');
        }
    });
};
