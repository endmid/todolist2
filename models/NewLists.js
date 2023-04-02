const todoList = {
  name: String,
};

const { Schema, model } = require("mongoose");

const newListSchema = new Schema({
  name: String,
  items: [todoList],
});

module.exports = model("NewList", newListSchema);
