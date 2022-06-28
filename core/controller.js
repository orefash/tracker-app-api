const { getAllTasks, createNewTask, updateOneTask, deleteOneTask, getOneTask } = require("./taskService");

const getTasks = async (req, res) => {

  try {
    const tasks = await getAllTasks();
    console.log("get tasks /")
    res.send({ status: "OK", data: { tasks: tasks } });
  } catch (error) {
    console.error('error: ',  error)
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};


const getTask = async (req, res) => {

  const {
    params: { taskId },
  } = req;

  console.log("Taskid: ", taskId)
  if (!taskId) {
    res
      .status(400)
      .send({
        status: "FAILED",
        data: { error: "Parameter ':taskId' can not be empty" },
      });
  }
  try {
    const task = await getOneTask(taskId);
    res.send({ status: "OK", data: { task: task } });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const createTask = async (req, res) => {
  const { body } = req;

  console.log("in body: ", body)

  // *** ADD ***
  if (
    !body.text ||
    !body.day ||
    body.reminder === null
  ) {

    console.log(`In request text: ${body.text}; day: ${body.day}; reminder: ${body.reminder}`)
    res
      .status(400)
      .send({
        status: "FAILED",
        data: {
          error:
            "One of the following keys is missing or is empty in request body: 'text', 'day', 'reminder'",
        },
      });
    return;
  }

  const newTask = {
    text: body.text,
    day: body.day,
    reminder: body.reminder
  }

  try {
    const createdTask = await createNewTask(newTask)
    res.status(201).send({ status: "OK", data: createdTask });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const updateTask = async (req, res) => {
  const {
    body,
    params: { taskId },
  } = req;
  console.log("id: ", taskId)
  console.log("body: ", body)
  if (!taskId) {
    res
      .status(400)
      .send({
        status: "FAILED",
        data: { error: "Parameter ':taskId' can not be empty" },
      });
  }
  try {
    const updatedTask = await updateOneTask(taskId, body);
    res.send({ status: "OK", data: updatedTask });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};


const deleteTask = async (req, res) => {
  const {
    params: { taskId },
  } = req;

  console.log("Taskid: ", taskId)
  if (!taskId) {
    res
      .status(400)
      .send({
        status: "FAILED",
        data: { error: "Parameter ':taskId' can not be empty" },
      });
  }
  try {
    await deleteOneTask(taskId  );
    res.send({ status: "OK" });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};


module.exports = {
  getTasks: getTasks,
  getTask: getTask,
  createTask: createTask,
  updateTask: updateTask,
  deleteTask: deleteTask
}