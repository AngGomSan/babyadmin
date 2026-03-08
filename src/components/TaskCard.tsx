import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { TimelineTask, CATEGORY_LABELS } from '@/types';
import { ChevronDown, ChevronUp, Globe, Info } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const categoryBorderClass: Record<string, string> = {
  medical_care: 'border-l-medical',
  paperwork: 'border-l-paperwork',
  benefits_and_finances: 'border-l-benefits',
  planning_and_preparation: 'border-l-planning',
};

const categoryBadgeClass: Record<string, string> = {
  medical_care: 'badge-medical',
  paperwork: 'badge-paperwork',
  benefits_and_finances: 'badge-benefits',
  planning_and_preparation: 'badge-planning',
};

interface TaskCardProps {
  task: TimelineTask;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { isTaskComplete, isChecklistComplete, toggleTask, toggleChecklist } = useApp();
  const [expanded, setExpanded] = useState(false);
  const completed = isTaskComplete(task.id);
  const hasDetails = task.description || (task.checklist && task.checklist.length > 0);

  const completedChecklistCount = task.checklist
    ? task.checklist.filter(item => isChecklistComplete(item.id)).length
    : 0;
  const totalChecklistCount = task.checklist?.length || 0;

  return (
    <div
      className={`rounded-xl bg-card shadow-card hover:shadow-card-hover transition-all duration-200 ${categoryBorderClass[task.category]} ${
        completed ? 'opacity-50' : ''
      }`}
    >
      {/* Header row */}
      <div
        className="flex items-start gap-3 p-4 cursor-pointer select-none"
        onClick={() => hasDetails && setExpanded(!expanded)}
        role={hasDetails ? 'button' : undefined}
        aria-expanded={hasDetails ? expanded : undefined}
      >
        <div className="pt-0.5" onClick={e => e.stopPropagation()}>
          <Checkbox
            checked={completed}
            onCheckedChange={() => toggleTask(task.id)}
            className="rounded-md h-5 w-5"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${categoryBadgeClass[task.category]}`}>
              {CATEGORY_LABELS[task.category]}
            </span>
            {task.optional && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                Optional
              </span>
            )}
            {task.international && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center">
                    <Globe className="w-3.5 h-3.5 text-primary cursor-help" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[260px] text-xs leading-relaxed">
                  If either parent was born outside Germany, additional documents may be required.
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <p className={`text-sm font-medium leading-snug ${completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {task.title}
          </p>
          {/* Checklist progress hint when collapsed */}
          {!expanded && totalChecklistCount > 0 && completedChecklistCount > 0 && (
            <p className="text-[11px] text-muted-foreground mt-1">
              {completedChecklistCount}/{totalChecklistCount} steps done
            </p>
          )}
        </div>

        {hasDetails && (
          <div className="p-1 text-muted-foreground shrink-0 mt-0.5">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        )}
      </div>

      {/* Expanded content */}
      {expanded && hasDetails && (
        <div className="px-4 pb-4 pl-12 space-y-3 slide-up">
          {task.description && (
            <div className="flex gap-2 items-start">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-primary/50" />
              <p className="text-[13px] text-muted-foreground leading-relaxed">{task.description}</p>
            </div>
          )}

          {task.checklist && task.checklist.length > 0 && (
            <div className="space-y-2.5 pt-1">
              {task.checklist.map(item => {
                const checked = isChecklistComplete(item.id);
                return (
                  <div key={item.id} className="space-y-0.5">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleChecklist(item.id)}
                        className="rounded mt-0.5 h-4 w-4"
                      />
                      <span className={`text-[13px] leading-snug ${checked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {item.label}
                      </span>
                    </label>
                    {item.description && !checked && (
                      <p className="text-xs text-muted-foreground/80 ml-[26px] leading-relaxed">{item.description}</p>
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
