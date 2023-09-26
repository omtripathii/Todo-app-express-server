const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const data_todo = [];
let idCount = 0;

app.use(express.json());
app.use(bodyParser.json());

// Define your custom middleware to increase the ID count
app.use("/todos", (req, res, next) => {
  if (req.method === "POST") {
    idCount++; // Increment the ID count for POST requests to /todos
  }
  next(); // Move to the next middleware or route handler
});

function todo_fn(req, res) {
  res.json(data_todo);
}

app.get("/todos", todo_fn);

function new_todo(req, res) {
  const todo = {
    id: idCount,
    title: req.body.title,
    description: req.body.description,
    completed: req.body.completed
  }
  data_todo.push(todo);
  res.status(201).json({ id: todo.id });
}

app.post("/todos", new_todo);

function specificfn(req, res) {
  const todoid = parseInt(req.params.id);
  const find = data_todo.find((item) => item.id === todoid);
  if (find) {
    res.status(200).json(find);
  } else {
    res.status(404).json({ error: "Todo not found" });
  }
}

app.get("/todos/:id", specificfn);

function updatefn(req, res) {
  const todoid = parseInt(req.params.id);
  const findIndex = data_todo.findIndex((item) => item.id === todoid);
  if (findIndex !== -1) {
    // Update the existing todo item
    data_todo[findIndex] = {
      id: todoid,
      title: req.body.title,
      description: req.body.description,
      completed: req.body.completed
    };
    res.status(200).json(data_todo[findIndex]);
  } else {
    res.status(404).json({ error: "Todo not found" });
  }
}

app.put("/todos/:id", updatefn);

function deletefn(req, res) {
  const todoid = parseInt(req.params.id);
  const findIndex = data_todo.findIndex((item) => item.id === todoid);
  if (findIndex !== -1) {
    // Remove the todo item from the array
    data_todo.splice(findIndex, 1);
    res.status(200).json({ message: "Todo deleted successfully" });
  } else {
    res.status(404).json({ error: "Todo not found" });
  }
}

app.delete("/todos/:id", deletefn);

// Middleware for handling unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
