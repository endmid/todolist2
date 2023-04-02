const { Schema, model } = require("mongoose");

const todoListSchema = new Schema({
  name: String,
});

module.exports = model("TodoList", todoListSchema);
