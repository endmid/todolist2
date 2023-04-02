const express = require("express");
const bodyParser = require("body-parser");
const app = express();
//Herramienta bastante usada, en este caso lo usare en capitalizar las letras
const _ = require("lodash");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Conexion de la base de datos
require("./conexion");
//Requerimos el modelo creado y creamos el objeto
const TodoList = require("./models/TodoList");
const NewTodoList = require("./models/NewLists");
//TODO: Crear 3 tareas nuevas
const tarea1 = new TodoList({
  name: "Terminar el curso",
});

const tarea2 = new TodoList({
  name: "Tarea 2",
});

const defaultItems = [tarea1, tarea2];

// Esta funcion nos ayuda a guardar los datos y ademas crear default data
app.get("/", function (req, res) {
  TodoList.find({})
    .then(function (foundItems) {
      // Creación de datos por defecto
      if (foundItems.length === 0) {
        return TodoList.insertMany(defaultItems)
          .then(function () {
            console.log("Successfully saved defult items to DB");
          })
          .catch(function (err) {
            console.log(err);
          });
        //La lista normal del principio
      } else {
        res.render("list", { listTitle: "Today", newListItem: foundItems });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/", function (req, res) {
  //
  const itemName = req.body.newItem;
  // Variable de el nombre de la lista escrita
  const listName = req.body.list;

  console.log("item name: " + itemName);
  console.log("list name: " + listName);

  const item = new TodoList({
    name: itemName,
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    NewTodoList.findOne({ name: listName }).then(function (foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function (req, res) {
  const checkeItemId = req.body.checkbox.trim();
  const listNamed = req.body.listNamed;

  if (listNamed === "Today") {
    TodoList.findByIdAndRemove(checkeItemId)
      .then(function () {
        console.log("Se elimino exitosamente la tarea");
        res.redirect("/");
      })
      .catch(function (err) {
        console.log(err);
      });
  } else {
    NewTodoList.findOneAndUpdate(
      { name: listNamed },
      { $pull: { items: { _id: checkeItemId } } }
    ).then(function () {
      console.log("Tarea añadida a la lista: " + listNamed);
      res.redirect("/" + listNamed);
    });
  }
});
// Una forma dinámica de creación de parametros de plantillas
app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  NewTodoList.findOne({ name: customListName })
    .then(function (foundList) {
      //  Si el nombre de la lista no existe creamos default data
      if (!foundList) {
        const list = new NewTodoList({
          name: customListName,
          items: defaultItems,
        });

        list.save();
        console.log("saved");
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItem: foundList.items,
        });
      }
    })
    .catch(function (err) {});
});

app.listen(3000, function () {
  console.log("Server started");
});
