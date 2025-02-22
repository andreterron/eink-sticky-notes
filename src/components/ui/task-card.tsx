import { Card } from "./card";
import { Task, TaskStatus } from "../../lib/task";
import { MoreVerticalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useBasic } from "@basictech/react";

export function TaskCard({ task }: { task: Task }) {
  const { db } = useBasic();

  function updateStatus(status: TaskStatus) {
    db.collection("tasks").update(task.id, { ...task, status });
  }

  return (
    <Card className="p-4 flex items-center justify-between">
      <span>{task.name}</span>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVerticalIcon className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            value={task.status}
            // TODO: remove `as any`
            onValueChange={(v) => updateStatus(v as any)}
          >
            <DropdownMenuRadioItem value="active">Active</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="ready">Ready</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="waiting">
              Waiting
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="backlog">
              Backlog
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="done">Done</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
