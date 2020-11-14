const mongoose = require("mongoose");

module.exports = function(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("Invalid ID.");
  next();
};

module.exports.validateObjectId = function(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("Invalid ID.");
  next();
};

module.exports.validateCustomObjectId = id => {
  return function(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.body[id]))
      return res.status(404).send(`Invalid ${id} ID.`);
    next();
  };
};
