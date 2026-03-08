import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { TimelineTask, CATEGORY_LABELS, TaskCategory } from '@/types';
import { ChevronDown, ChevronUp, Globe, Info, Unlock, Stethoscope, FileText, Wallet, Compass } from 'lucide-react';
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
  const hasDetails = task.description || task.unlocks || (task.checklist && task.checklist.length > 0);

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
        className="flex items-start gap-3 p-4 cursor-pointer select-none active:bg-muted/30 transition-colors rounded-xl"
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
          <p className={`text-sm font-medium leading-snug ${completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {task.title}
          </p>
          <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${categoryBadgeClass[task.category]}`}>
              <span className="text-[9px] leading-none">{CATEGORY_ICONS[task.category]}</span>
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
          {/* Checklist progress hint when collapsed */}
          {!expanded && totalChecklistCount > 0 && completedChecklistCount > 0 && (
            <p className="text-[11px] text-muted-foreground mt-1.5">
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
        <div className="px-4 pb-5 pl-12 space-y-4 slide-up">
          {task.description && (
            <div className="flex gap-2.5 items-start">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-primary/40" />
              <p className="text-[13px] text-muted-foreground leading-relaxed">{task.description}</p>
            </div>
          )}

          {task.unlocks && task.unlocks.length > 0 && (
            <div className="flex gap-2.5 items-start">
              <Unlock className="w-4 h-4 shrink-0 mt-0.5 text-primary/40" />
              <div>
                <p className="text-[12px] font-medium text-muted-foreground mb-1">What this unlocks</p>
                <ul className="space-y-0.5">
                  {task.unlocks.map((item, i) => (
                    <li key={i} className="text-[13px] text-muted-foreground leading-relaxed">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {task.checklist && task.checklist.length > 0 && (
            <div className="space-y-1 pt-0.5">
              {task.checklist.map(item => {
                const checked = isChecklistComplete(item.id);
                return (
                  <div key={item.id} className="py-2 -mx-1 px-1 rounded-lg">
                    <label className="flex items-start gap-3 cursor-pointer min-h-[2.25rem]">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleChecklist(item.id)}
                        className="rounded mt-0.5 h-[18px] w-[18px]"
                      />
                      <span className={`text-[13px] leading-snug ${checked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {item.label}
                      </span>
                    </label>
                    {item.description && !checked && (
                      <p className="text-xs text-muted-foreground/70 ml-[30px] mt-1 leading-relaxed">{item.description}</p>
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
