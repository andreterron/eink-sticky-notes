import { useBasic, useQuery } from "@basictech/react";
import { Button } from "../components/ui/button";
import { CardPlaceholder } from "../components/ui/card-placeholder";
import { Task } from "../lib/task";
import { bucketBy } from "../lib/utils";
import { useMemo } from "react";
import { Card } from "../components/ui/card";
import { TaskListSection } from "../components/task-list-section";
import { v4 as uuid } from "uuid";

export default function TaskBoard() {
  const { db } = useBasic();

  const tasks: Task[] | undefined = useQuery(() =>
    db.collection("tasks").getAll(),
  );

  const { active, backlog, ready, waiting } = useMemo(() => {
    if (!tasks) return {};
    // Sort tasks before bucketing
    const sortedTasks = [...tasks].sort((a, b) => b.createdAt - a.createdAt);
    return bucketBy(sortedTasks, "status");
  }, [tasks]);

  console.log(tasks?.length, active, backlog, ready, waiting);

  return (
    <div className="min-h-screen bg-background p-4 w-full pt-16">
      <div className="mr-auto max-w-md space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const name = formData.get("name") as string;
            if (!name) return;

            db.collection("tasks").add({
              id: uuid(),
              name,
              status: "ready",
              createdAt: Date.now(),
            } satisfies Task);
            e.currentTarget.reset();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            name="name"
            placeholder="Task name"
            className="flex-1 rounded-md border px-3 py-2"
            required
          />
          <Button type="submit">Create task</Button>
        </form>

        <TaskListSection tasks={active} title="Active" />
        <TaskListSection tasks={ready} title="Ready" />
        <TaskListSection tasks={waiting} title="Waiting" />
        <TaskListSection tasks={backlog} title="Inbox" />

        <Button
          variant="ghost"
          onClick={() => {
            if (!tasks?.length) return;
            tasks.forEach((task) => {
              db.collection("tasks").delete(task.id);
            });
          }}
          // className="w-full"
        >
          Delete all tasks
        </Button>

        {/* <nav className="space-y-4 pt-4">
          <Link
            to="/backlog"
            className="flex items-center justify-between rounded-lg border bg-card p-4 text-card-foreground shadow-sm hover:bg-accent transition-colors"
          >
            <span className="text-xl font-semibold">Backlog</span>
            <ChevronRight className="h-5 w-5" />
          </Link>

          <Link
            to="/done"
            className="flex items-center justify-between rounded-lg border bg-card p-4 text-card-foreground shadow-sm hover:bg-accent transition-colors"
          >
            <span className="text-xl font-semibold">Done</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </nav> */}
      </div>
    </div>
  );
}
