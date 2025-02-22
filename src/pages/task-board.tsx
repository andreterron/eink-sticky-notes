import { ChevronRight } from "lucide-react";
import { Card } from "../components/ui/card";
import { Link } from "react-router";
import { CardPlaceholder } from "../components/ui/card-placeholder";

export default function TaskBoard() {
  return (
    <div className="min-h-screen bg-background p-4 w-full pt-16">
      <div className="mr-auto max-w-md space-y-6">
        <section className="space-y-2">
          {/* <h2 className="text-xl font-semibold">Active</h2> */}
          <CardPlaceholder className="h-24 bg-muted/30 flex items-center justify-center text-lg italic text-muted-foreground/50">
            Active
          </CardPlaceholder>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Ready</h2>
          <CardPlaceholder className="h-24 bg-muted/30 flex items-center justify-center text-lg italic text-muted-foreground/50">
            Ready
          </CardPlaceholder>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Waiting</h2>
          <CardPlaceholder className="h-24 bg-muted/30 flex items-center justify-center text-lg italic text-muted-foreground/50">
            Waiting
          </CardPlaceholder>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Inbox</h2>
          <CardPlaceholder className="h-24 bg-muted/30 flex items-center justify-center text-lg italic text-muted-foreground/50">
            Inbox
          </CardPlaceholder>
        </section>

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
