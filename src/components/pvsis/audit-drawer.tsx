import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { AuditEntry } from "@/data/fr14";

export function AuditDrawer({
  entries,
  label = "History",
  title = "Change history",
}: {
  entries: AuditEntry[];
  label?: string | undefined;
  title?: string | undefined;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="size-4" /> {label}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">{title}</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 px-4 pb-8">
          {entries.map((e) => (
            <div key={e.id} className="rounded-md border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold">{e.what}</span>
                <span className="text-xs text-muted-foreground">{e.when}</span>
              </div>
              <div className="mt-2 grid gap-1 text-sm">
                <div>
                  <span className="text-muted-foreground">Who: </span>
                  {e.who}
                </div>
                <div>
                  <span className="text-muted-foreground">Previous: </span>
                  {e.previous}
                </div>
                <div>
                  <span className="text-muted-foreground">New: </span>
                  <span className="font-semibold">{e.next}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Reason: </span>
                  {e.reason}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
