const mongoose = require("mongoose");

module.exports = () => {
    mongoose.set("strictQuery", false);
    return mongoose
        .connect(process.env.MONGO_URL)
        .then(() => {
            console.log("Mongodb Connected");
        })
        .catch((err) => {
            console.log(err);
            throw new Error("Error occcured while connecting to database");
        });
};
