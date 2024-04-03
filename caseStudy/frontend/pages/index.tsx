import Image from "next/image";
import { Inter } from "next/font/google";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useState } from "react";
import {
  Button,
  Input,
  Label,
  Checkbox,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Textarea,
} from "@/components/ui";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  markTaskAsCompleted,
  Task,
} from "@/definition/data";
import {
  CheckCircleIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
} from "@/definition/icon";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(createTask, {
    onSuccess: (data) => {
      alert("Task created");
      setIsDialogOpen(false);
    },
    onError: () => {
      alert("there was an error");
    },
    onSettled: () => {
      queryClient.invalidateQueries("create");
    },
  });

  const handleCreateTask = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    const taskName = (document.getElementById("task") as HTMLInputElement)
      .value;
    const taskDescription = (
      document.getElementById("description") as HTMLInputElement
    ).value;
    // const taskDeadline = (
    //   document.getElementById("deadine") as HTMLInputElement
    // ).value;

    const newTask: Task = {
      id: tasks?.length.toString() as string,
      name: taskName,
      description: taskDescription,
      deadline: new Date(),
      completed: false,
      subTasks: [],
    };

    await mutate(newTask);
  };

  const handleDeleteTask = useMutation(deleteTask, {
    onSuccess: () => {
      alert("Task deleted");
    },
    onError: () => {
      alert("there was an error");
    },
    onSettled: () => {
      queryClient.invalidateQueries("delete");
    },
  });

  const handleUpdateTask = useMutation(
    (data: Task) => {
      if (selectedTask) {
        return updateTask(selectedTask.id, data);
      } else {
        throw new Error("No task selected");
      }
    },
    {
      onSuccess: () => {
        alert("Task updated");
        queryClient.invalidateQueries("tasks");
      },
      onError: () => {
        alert("There was an error updating the task");
      },
    }
  );

  const { data: tasks, isLoading: tasksLoading } = useQuery("tasks", getTasks);

  const markTaskAsComplete = useMutation(markTaskAsCompleted, {
    onSuccess: () => {
      alert("Task marked as completed");
      queryClient.invalidateQueries("tasks");
      window.location.reload();
    },
    onError: () => {
      alert("There was an error marking the task as completed");
    },
  });

  return (
    <div key="1" className="flex flex-col max-w-7xl mx-auto my-4">
      <header className="flex items-center h-14 border-b px-4">
        <h1 className="font-semibold text-lg ml-2">
          <span className="hidden md:inline">Sprint Asia</span>
        </h1>
        <div className="ml-auto">
          <Dialog>
            <DialogTrigger
              className="bg-black text-white py-2 px-2 rounded-lg"
              onClick={() => setIsDialogOpen(true)}
            >
              Add New Task
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Todo List</DialogTitle>
                <DialogDescription>
                  Please fill in the form to add a new task
                </DialogDescription>
                <div className="pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="task">Task</Label>
                      <Input id="task" placeholder="Enter your task" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Task description</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter your task description"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadine" id="deadine">
                        Due date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            className="w-full justify-start text-left font-normal"
                            variant="outline"
                          >
                            <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                            Select Date
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar initialFocus mode="single" />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <Button
                      className="w-full"
                      type="submit"
                      onClick={handleCreateTask}
                    >
                      Add Task
                    </Button>
                  </div>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <main className="flex-1 p-4 grid items-start gap-4 md:grid-cols-[300px_1fr]">
        <div className="grid items-start gap-2 text-sm">
          <div className="grid items-start gap-2">
            <h2>To do</h2>
            {tasks &&
              tasks
                .filter((task) => !task.completed)
                .map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800"
                  >
                    <div className="grid gap-1 text-xs">
                      <h3 className="font-medium leading-none">{task.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Deadline:{" "}
                        {new Date(task.deadline).toISOString().split("T")[0]}
                      </p>
                    </div>
                    <Button
                      className="ml-auto rounded-full"
                      size="icon"
                      onClick={() => setSelectedTask(task)}
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                      <span className="sr-only">View task</span>
                    </Button>
                  </div>
                ))}
          </div>
          <div className="grid items-start gap-2">
            <h2>Completed</h2>
            {tasks &&
              tasks
                .filter((task) => task.completed)
                .map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800"
                  >
                    <CheckCircleIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <div className="grid gap-1 text-xs">
                      <h3 className="font-medium leading-none">{task.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Deadline: task.deadline
                      </p>
                    </div>
                    <Button
                      className="ml-auto rounded-full"
                      size="icon"
                      onClick={() => setSelectedTask(task)}
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                      <span className="sr-only">View task</span>
                    </Button>
                  </div>
                ))}
          </div>
        </div>
        {selectedTask && (
          <div className="bg-gray-100 mt-7 py-6 px-6 rounded-lg ">
            <div className="flex justify-between">
              <div>
                <div className="text-xl font-semibold mb-4">
                  {selectedTask.name}
                </div>
                <div className="text-gray-700 mb-4">
                  {selectedTask.description}
                </div>
              </div>
              {selectedTask.completed ? (
                <CheckCircleIcon className="h-6 w-8 text-gray-500 dark:text-gray-400" />
              ) : (
                <div className="flex space-x-2 my-2">
                  <Checkbox
                    id="terms"
                    className="cursor-pointer"
                    onClick={() => markTaskAsComplete.mutate(selectedTask.id)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Mark as completed
                  </label>
                </div>
              )}
            </div>
            <Dialog>
              <DialogTrigger className="bg-black text-white py-2 px-4 rounded-lg ">
                Edit Task
              </DialogTrigger>
              <Button
                variant="destructive"
                className="ml-4"
                onClick={() => {
                  handleDeleteTask.mutate(selectedTask.id);
                  setSelectedTask(null);
                }}
              >
                Delete Task
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold mb-2">
                    Edit Task
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 mb-4">
                    Please fill in the form to edit the task
                  </DialogDescription>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="task" className="text-sm font-medium">
                        Task
                      </Label>
                      <Input
                        id="task"
                        placeholder="Enter your task"
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Task description</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter your task description"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline" id="deadline">
                        Due date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            className="w-full justify-start text-left font-normal"
                            variant="outline"
                          >
                            <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                            Select Date
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar initialFocus mode="single" />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <Button
                      onClick={() => {
                        handleUpdateTask.mutate({
                          id: selectedTask.id,
                          name: (
                            document.getElementById("task") as HTMLInputElement
                          ).value,
                          description: (
                            document.getElementById(
                              "description"
                            ) as HTMLInputElement
                          ).value,
                          deadline: new Date(),
                        });
                        setSelectedTask(null);
                      }}
                    >
                      Save Changes
                    </Button>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </main>
    </div>
  );
}
