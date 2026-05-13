import { Trash2, RotateCcw, Settings, Eraser } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toastConfirm } from "@/lib/confirm";

interface Props {
  picksCount: number;
  hasQuiz: boolean;
  onClearPicks: () => void;
  onResetQuiz: () => void;
  onResetAll: () => void;
}

export function SettingsMenu({ picksCount, hasQuiz, onClearPicks, onResetQuiz, onResetAll }: Props) {
  const empty = picksCount === 0 && !hasQuiz;

  return (
    <DropdownMenu modal={false}>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button
              className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--color-line)] bg-white/[0.03] hover:bg-white/[0.08] hover:border-[var(--color-line-bright)] text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
              {!empty && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                  style={{ background: "var(--color-sat)", boxShadow: "0 0 6px var(--color-sat)" }}
                />
              )}
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Settings</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Stored locally in this browser</DropdownMenuLabel>
        <DropdownMenuItem
          variant="destructive"
          disabled={picksCount === 0}
          onSelect={async () => {
            const ok = await toastConfirm(
              `Clear all ${picksCount} pick${picksCount === 1 ? "" : "s"}?`,
              "Your plan will be reset.",
              { confirmLabel: "Clear", destructive: true },
            );
            if (ok) {
              onClearPicks();
              toast.success("Picks cleared");
            }
          }}
        >
          <Eraser className="w-3.5 h-3.5" />
          <span className="flex-1">Clear my picks</span>
          {picksCount > 0 && (
            <span className="font-mono text-[10px] text-[var(--color-ink-mute)] tabular-nums">{picksCount}</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={!hasQuiz}
          onSelect={async () => {
            const ok = await toastConfirm(
              "Reset your quiz result?",
              "You'll need to retake the quiz to see personal matches.",
              { confirmLabel: "Reset", destructive: true },
            );
            if (ok) {
              onResetQuiz();
              toast.success("Quiz reset");
            }
          }}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="flex-1">Reset quiz</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={empty}
          onSelect={async () => {
            const ok = await toastConfirm(
              "Wipe everything?",
              "Clears your picks AND your quiz result. This can't be undone.",
              { confirmLabel: "Wipe", destructive: true },
            );
            if (ok) {
              onResetAll();
              toast.success("Everything wiped");
            }
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="flex-1">Wipe everything</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
