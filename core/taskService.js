const { getTasks, createTask, updateTask, deleteTask, getTask } = require("../db/taskDB")

const getAllTasks = async () => {
    try {
        const articles = await getTasks();
        return articles;
    } catch (error) {
        console.log("get tasks service error: ", error)
        throw error;
    }
};

const getOneTask = async (taskId) => {
    try {
        const articles = await getTask(taskId);
        return articles;
    } catch (error) {
        console.log("get one task service error: ", error)
        throw error;
    }
};

const createNewTask = async (newTask) => {
    try {
        const createdTask = await createTask(newTask)
        // console.log("Ctask: ", createdTask)
        return createdTask;
    } catch (error) {
        console.log("create task service error: ", error)
        throw (error)
    }
}

const updateOneTask = async (taskId, changes) => {
    try {
        const updatedTask = updateTask(taskId, changes);
        return updatedTask;
    } catch (error) {
        throw error;
    }
};

const deleteOneTask = async (taskId) => {
    try {
        await deleteTask(taskId);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllTasks: getAllTasks,
    createNewTask: createNewTask,
    updateOneTask: updateOneTask,
    deleteOneTask: deleteOneTask,
    getOneTask: getOneTask
}