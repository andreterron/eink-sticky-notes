import { Task } from "../lib/task";
import { Card } from "./ui/card";
import { CardPlaceholder } from "./ui/card-placeholder";

interface TaskListSectionProps {
  tasks: Task[] | undefined;
  title: string;
}

export function TaskListSection({ tasks, title }: TaskListSectionProps) {
  return (
    <section className="space-y-2">
      {title && <h2 className="text-xl font-semibold">{title}</h2>}
      {!tasks?.length ? (
        <CardPlaceholder className="p-4 bg-muted/30 flex items-center justify-center text-lg italic text-muted-foreground/50">
          {title}
        </CardPlaceholder>
      ) : (
        tasks.map((task) => (
          <Card className="p-4" key={task.id}>
            {task.name}
          </Card>
        ))
      )}
    </section>
  );
}
