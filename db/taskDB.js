const { ObjectID, ObjectId } = require('mongodb');
const { getDb } = require("./conn");


const getTasks = async () => {

    let client = await getDb();
    try {
        await client.connect();
        let result = await client.db("practice-demos").collection("tasks").find().toArray();
        // console.log("Result: ", result)
        return result
    } catch (error) {
        console.log("get tasks error: ", error)
        throw { status: 500, message: error?.message || error };
    } finally {
        // await client.close();
    }
}


const getTask = async (taskId) => {

    let client = await getDb();
    try {
        await client.connect();
        const query = { _id: new ObjectId(taskId)  };

        let result = await client.db("practice-demos").collection("tasks").findOne(query);
        // console.log("Result: ", result)
        if(!result){
            throw { status: 400, message: "taskID is invalid " };
        }
        return result
    } catch (error) {
        console.log("select task error: ", error)
        throw { status: 500, message: error?.message || error };
    } finally {
        // await client.close();
    }
}


const createTask = async (newTask) => {

    let client = await getDb();
    try {
        await client.connect();
        let result = await client.db("practice-demos").collection("tasks").insertOne(newTask);
        console.log("Result: ", result)
        return newTask
    } catch (error) {
        console.log("create taskdb error: ", error)
        throw { status: 500, message: error?.message || error };
    } finally {
        // await client.close();
    }
}


const updateTask = async (taskId, changes) => {

    let client = await getDb();
    try {
        await client.connect();

        const filter = { _id: new ObjectId(taskId) };
        // this option instructs the method to create a document if no documents match the filter
        const options = { upsert: false };
        // create a document that sets the plot of the movie
        const updateDoc = {
            $set: {
                text: changes.text,
                day: changes.day,
                reminder: changes.reminder
            },
        };

        let result = await client.db("practice-demos").collection("tasks").updateOne(filter, updateDoc, options);
        console.log("Update Result: ", result)
        if (result.matchedCount < 1) {
            throw { status: 400, message: "taskID is invalid " };
        }
        return changes
    } catch (error) {
        console.log("update taskdb error: ", error)
        throw { status: 500, message: error?.message || error };
    } finally {
        // await client.close();
    }
}



const deleteTask = async (taskId) => {

    let client = await getDb();
    try {
        await client.connect();    

        const query = { _id: new ObjectId(taskId)  };

        let result = await client.db("practice-demos").collection("tasks").deleteOne(query);
       
        if (result.deletedCount === 1) {
            console.log("Successfully deleted one document.");
        } else {
            throw { status: 400, message: "No documents matched the query. Deleted 0 documents." };
        }
        
    } catch (error) {
        console.log("delete taskdb error: ", error)
        throw { status: 500, message: error?.message || error };
    } finally {
        await client.close();
    }
}
  

module.exports = {
    getTasks: getTasks,
    createTask: createTask,
    updateTask: updateTask,
    deleteTask: deleteTask,
    getTask: getTask
}