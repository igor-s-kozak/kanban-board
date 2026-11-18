import { Pencil, Trash2 } from 'lucide-react';
import { formatTaskDate } from '../features/date';
import { isTaskOverdue } from '../features/task-utils';
import type { Task } from '../types/task';

type TaskCardProps = {
  task: Task;
  onDelete: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onDragStart: (taskId: number) => void;
};

export function TaskCard({ task, onDelete, onEdit, onDragStart }: TaskCardProps) {
  const overdue = isTaskOverdue(task);

  return (
    <article
      draggable
      onDragStart={() => onDragStart(task.id)}
      className={[
        'group relative w-full cursor-grab rounded-[4px] border p-4 text-[14px] tracking-[-0.4px] transition',
        'bg-white/10 text-white/90 hover:bg-white/[0.14] active:cursor-grabbing',
        overdue ? 'border-[#FC3639]' : 'border-transparent',
      ].join(' ')}
    >
      <div className="flex flex-col gap-2 pr-16">
        <TaskRow label="Начало:" value={formatTaskDate(task.startDay)} />
        <TaskRow
          label="Окончание:"
          value={formatTaskDate(task.endDay)}
          valueClassName={overdue ? 'text-[#FC3639]' : 'text-white/90'}
        />
        <TaskRow label="Описание:" value={task.text} />
      </div>

      <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <button
          type="button"
          aria-label="Редактировать"
          title="Редактировать"
          onClick={(event) => {
            event.stopPropagation();
            onEdit(task);
          }}
          className="rounded p-1 text-white/60 hover:bg-white/10 hover:text-white"
        >
          <Pencil size={18} strokeWidth={1.8} />
        </button>
        <button
          type="button"
          aria-label="Удалить"
          title="Удалить"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(task.id);
          }}
          className="rounded p-1 text-white/60 hover:bg-white/10 hover:text-[#FC3639]"
        >
          <Trash2 size={18} strokeWidth={1.8} />
        </button>
      </div>
    </article>
  );
}

function TaskRow({
  label,
  value,
  valueClassName = 'text-white/90',
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-4 overflow-hidden">
      <span className="shrink-0 text-white/60">{label}</span>
      <span className={`min-w-0 flex-1 truncate font-bold leading-[22px] ${valueClassName}`}>{value}</span>
    </div>
  );
}
