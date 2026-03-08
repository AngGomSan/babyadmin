import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { TimelineTask, CATEGORY_LABELS } from '@/types';
import { ChevronDown, ChevronUp, Globe, Info } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const categoryBorderClass: Record<string, string> = {
  medical: 'border-l-medical',
  paperwork: 'border-l-paperwork',
  benefits: 'border-l-benefits',
  planning: 'border-l-planning',
};

const categoryBadgeClass: Record<string, string> = {
  medical: 'badge-medical',
  paperwork: 'badge-paperwork',
  benefits: 'badge-benefits',
  planning: 'badge-planning',
};

interface TaskCardProps {
  task: TimelineTask;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { isTaskComplete, isChecklistComplete, toggleTask, toggleChecklist } = useApp();
  const [expanded, setExpanded] = useState(false);
  const completed = isTaskComplete(task.id);
  const hasDetails = task.explanation || (task.checklist && task.checklist.length > 0);

  return (
    <div
      className={`rounded-xl bg-card shadow-card hover:shadow-card-hover transition-shadow ${categoryBorderClass[task.category]} ${
        completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="pt-0.5">
          <Checkbox
            checked={completed}
            onCheckedChange={() => toggleTask(task.id)}
            className="rounded-md"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${categoryBadgeClass[task.category]}`}>
              {CATEGORY_LABELS[task.category]}
            </span>
            {task.isOptional && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                Optional
              </span>
            )}
            {task.hasInternationalFlag && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <Globe className="w-3.5 h-3.5 text-primary cursor-help" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[240px] text-xs">
                  If either parent was born outside Germany, additional documents may be required.
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <p className={`text-sm font-medium leading-snug ${completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {task.title}
          </p>
        </div>

        {hasDetails && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors shrink-0"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {expanded && hasDetails && (
        <div className="px-4 pb-4 pl-11 space-y-3 slide-up">
          {task.explanation && (
            <div className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-primary/60" />
              <p>{task.explanation}</p>
            </div>
          )}

          {task.checklist && task.checklist.length > 0 && (
            <div className="space-y-2 pt-1">
              {task.checklist.map(item => {
                const checked = isChecklistComplete(item.id);
                return (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-start gap-2.5">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleChecklist(item.id)}
                        className="rounded mt-0.5"
                      />
                      <span className={`text-sm ${checked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {item.label}
                      </span>
                    </div>
                    {item.explanation && (
                      <p className="text-xs text-muted-foreground ml-7 leading-relaxed">{item.explanation}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
