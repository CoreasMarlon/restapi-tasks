import Task from "../models/Task";
import { getPagination } from "../libs/getPagination";

export const createTask = async (req, res) => {
  if (!req.body.title || !req.body.description) {
    return res.status(400).send({
      message: "Content cannot be empty",
    });
  }

  try {
    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
      done: req.body.done ? req.body.done : false,
    });
    const taskSaved = await newTask.save();
    res.status(200).json(taskSaved);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something goes wrong creating the task",
    });
  }
};

export const findAlltasks = async (req, res) => {
  try {
    //const tasks = await Task.find();

    const { size, page, title } = req.query;

    const condition = title ? {
      title: {$regex: new RegExp(title), $options: "i" }
    } : {};

    const { limit, offset } = getPagination(page, size);
    const data = await Task.paginate(condition, { offset, limit });
    res.status(200).json({
      totalItems: data.totalDocs,
      tasks: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something goes wrong retrieving the tasks",
    });
  }
};

export const findOneTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task does not exists" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message || "Error retrieving Task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findByIdAndDelete(id);
    res.json({
      message: `'${task.title}' Task were deleted succesfull`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Cannot delete task" });
  }
};

export const findAllDoneTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ done: true });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something goes wrong retrieving the tasks",
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    await Task.findByIdAndUpdate(id, req.body);
    res.status(200).json({
      message: "Task was updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Cannot update task",
    });
  }
};
