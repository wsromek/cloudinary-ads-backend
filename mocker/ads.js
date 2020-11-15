const attachAdMocker = (app) => {
    app.get("/mock-ad/:name", (req, res) => {
        res.send({
            ad: `https://${req.params.name}.com`
        });
    });

    return app;
};

module.exports = attachAdMocker;
