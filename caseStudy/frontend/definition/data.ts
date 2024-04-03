export type SubTask = {
  id: string;
  name: string;
  description: string;
  completed: boolean;
};

export type Task = {
  id: string;
  name: string;
  description: string;
  deadline: Date;
  completed?: boolean;
  subTasks?: SubTask[];
};

export const createTask = async (data: Task) => {
  const response = await fetch("http://localhost:8080/api/task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const responseData = await response.json();
  return responseData;
};

export const getTasks = async (): Promise<Task[]> => {
  const response = await fetch("http://localhost:8080/api/tasks");

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const responseData = await response.json();
  return responseData as Task[];
};

export const deleteTask = async (id: string) => {
  const response = await fetch(`http://localhost:8080/api/task/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const responseData = await response.json();
  return responseData;
};

export const markTaskAsCompleted = async (id: string) => {
  const response = await fetch(
    `http://localhost:8080/api/task/${id}/complete`,
    {
      method: "PUT",
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const responseData = await response.json();
  return responseData;
};

export const updateTask = async (id: string, data: Task) => {
  try {
    const response = await fetch(`http://localhost:8080/api/task/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok && response.status !== 204) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};
