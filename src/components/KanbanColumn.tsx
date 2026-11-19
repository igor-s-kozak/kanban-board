import { Plus } from "lucide-react";
import { TaskCard } from "./TaskCard";
import type { Task, TaskStatus } from "../types/task";
import { FC } from "react";


type KanbanColumnProps = {
  status: TaskStatus;
  title: string;
  icon: FC;
  tasks: Task[];
  onAdd: (status: Extract<TaskStatus, 'todo'>) => void;
  onDelete: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onDragStart: (taskId: number) => void;
  onDrop: (status: TaskStatus) => void;
};

export function KanbanColumn({
  status,
  title,
  icon: Icon,
  tasks,
  onAdd,
  onDelete,
  onEdit,
  onDragStart,
  onDrop,
}: KanbanColumnProps) {
  return (
    <section
      className="min-w-80 max-w-sm rounded-[4px] bg-black/70 px-4 py-8 shadow-panel"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onDrop(status);
      }}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Icon/>
          <h2 className="text-2xl font-bold leading-7 tracking-[0.0864px] text-white/90">
            {title}
          </h2>
        </div>
        {status === "todo" && (
          <button
            type="button"
            className="inline-flex h-[29px] items-center justify-center rounded px-0 py-1 text-sm tracking-[-0.4px] text-white/60 hover:text-white"
            onClick={() => onAdd(status)}
          >
            <Plus size={16} className="mr-1" />
            Добавить
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
              onEdit={onEdit}
              onDragStart={onDragStart}
            />
          ))
        ) : (
          <div className="rounded border border-dashed border-white/10 px-4 py-10 text-center text-sm text-white/30">
            Нет задач
          </div>
        )}
      </div>
    </section>
  );
}
