import { FC, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { KanbanColumn } from "./components/KanbanColumn";
import { TaskModal, type TaskDraft } from "./components/TaskModal";
import { filterTasks, sortTasks, STATUS_ORDER } from "./features/task-utils";
import type { Task, TaskStatus } from "./types/task";
import {
  TodoSmileIcon,
  ReviewSmileIcon,
  InProgressSmileIcon,
  DoneSmileIcon,
} from "./components/icons";

const STORAGE_KEY = "ip-kanban.tasks.v1";

type ColumnConfig = {
  status: TaskStatus;
  title: string;
  icon: FC;
};

const COLUMNS: ColumnConfig[] = [
  { status: "todo", title: "To Do", icon: TodoSmileIcon },
  { status: "in_progress", title: "In Progress", icon: InProgressSmileIcon },
  { status: "review", title: "Review", icon: ReviewSmileIcon },
  { status: "done", title: "Done", icon: DoneSmileIcon },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [query, setQuery] = useState("");
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [newTaskStatus, setNewTaskStatus] = useState<Extract<
    TaskStatus,
    "todo"
  > | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTasks() {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        try {
          const parsed = JSON.parse(stored) as Task[];
          if (!cancelled) setTasks(parsed);
          return;
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }

      try {
        const response = await fetch("tasks.json");
        if (!response.ok) throw new Error("Failed to load tasks.json");
        const parsed = (await response.json()) as Task[];
        if (!cancelled) setTasks(parsed);
      } catch (error) {
        console.error(error);
        if (!cancelled) setTasks([]);
      }
    }

    void loadTasks();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (tasks !== null) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    if (!tasks) return [];
    return filterTasks(tasks, query);
  }, [tasks, query]);

  const groupedTasks = useMemo(() => {
    const groups = new Map<TaskStatus, Task[]>();
    STATUS_ORDER.forEach((status) => groups.set(status, []));

    visibleTasks.forEach((task) => {
      groups.get(task.type)?.push(task);
    });

    groups.forEach((group, status) => groups.set(status, sortTasks(group)));
    return groups;
  }, [visibleTasks]);

  const closeModal = () => {
    setEditingTask(undefined);
    setNewTaskStatus(null);
  };

  const handleSaveTask = (draft: TaskDraft) => {
    setTasks((current) => {
      if (!current) return current;

      if (editingTask) {
        return current.map((task) =>
          task.id === editingTask.id ? { ...task, ...draft } : task,
        );
      }

      const nextId =
        current.reduce((max, task) => Math.max(max, task.id), 0) + 1;
      return [...current, { ...draft, id: nextId }];
    });

    closeModal();
  };

  const handleDelete = (taskId: number) => {
    setTasks(
      (current) => current?.filter((task) => task.id !== taskId) ?? null,
    );
  };

  const handleDrop = (targetStatus: TaskStatus) => {
    if (draggedTaskId === null) return;
    setTasks(
      (current) =>
        current?.map((task) =>
          task.id === draggedTaskId ? { ...task, type: targetStatus } : task,
        ) ?? null,
    );
    setDraggedTaskId(null);
  };

  return (
    <div className="relative min-h-screen max-md:overflow-x-scroll md:overflow-hidden text-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0" />
      <main className="relative z-10 mx-auto min-h-screen w-full max-w-[1920px] 3xl:px-20 px-10 pb-12 pt-16">
        <header className="mb-10 flex items-center justify-between gap-8">
          <h1 className="text-[40px] font-bold leading-7 tracking-[0.144px] text-white/90">
            Your tasks
          </h1>

          <label className="relative block min-w-80 max-w-sm w-1/4 shrink-0">
            <Search
              size={24}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/70"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="поиск..."
              className="h-10 w-full min-w-80 max-w-sm rounded-full border border-white/30 bg-white/[0.07] pl-16 pr-5 text-sm tracking-[-0.4px] text-white/90 outline-none placeholder:text-white/60 focus:border-white/50"
            />
          </label>
        </header>

        {tasks === null ? (
          <div className="flex max-md:gap-4 justify-between">
            {COLUMNS.map((column) => (
              <div
                key={column.status}
                className="h-[430px] animate-pulse rounded bg-black/50"
              />
            ))}
          </div>
        ) : (
          <div className="flex max-md:gap-4 justify-between">
            {COLUMNS.map((column) => (
              <KanbanColumn
                key={column.status}
                status={column.status}
                title={column.title}
                icon={column.icon}
                tasks={groupedTasks.get(column.status) ?? []}
                onAdd={setNewTaskStatus}
                onDelete={handleDelete}
                onEdit={setEditingTask}
                onDragStart={setDraggedTaskId}
                onDrop={handleDrop}
              />
            ))}
          </div>
        )}
      </main>

      {(editingTask || newTaskStatus) && (
        <TaskModal
          task={editingTask}
          initialStatus={newTaskStatus ?? editingTask?.type ?? "todo"}
          onClose={closeModal}
          onSubmit={handleSaveTask}
        />
      )}
    </div>
  );
}
