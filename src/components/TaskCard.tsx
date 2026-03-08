import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { TimelineTask, CATEGORY_LABELS, TaskCategory } from '@/types';
import { ChevronDown, ChevronUp, Globe, Info, Unlock, Stethoscope, FileText, Wallet, Compass, ClipboardList, Heart } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { documentMap } from '@/data/documents';

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

const categoryGlobeClass: Record<string, string> = {
  medical_care: 'text-category-medical',
  paperwork: 'text-category-paperwork',
  benefits_and_finances: 'text-category-benefits',
  planning_and_preparation: 'text-category-planning',
};

const categoryCheckboxClass: Record<string, string> = {
  medical_care: 'border-category-medical',
  paperwork: 'border-category-paperwork',
  benefits_and_finances: 'border-category-benefits',
  planning_and_preparation: 'border-category-planning',
};

const CATEGORY_ICON_MAP: Record<TaskCategory, React.ComponentType<{ className?: string }>> = {
  medical_care: Stethoscope,
  paperwork: FileText,
  benefits_and_finances: Wallet,
  planning_and_preparation: Compass,
};

interface TaskCardProps {
  task: TimelineTask;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { isTaskComplete, isChecklistComplete, isDocumentComplete, toggleTask, toggleChecklist, toggleDocument } = useApp();
  const [expanded, setExpanded] = useState(false);
  const completed = isTaskComplete(task.id);
  const resolvedDocs = (task.requiredDocuments || []).map(id => documentMap.get(id)).filter(Boolean);
  const hasDetails = task.description || task.whyItMatters || resolvedDocs.length || task.unlocks || (task.checklist && task.checklist.length > 0);

  const completedChecklistCount = (task.checklist || []).filter(i => isChecklistComplete(i.id)).length
    + resolvedDocs.filter(d => d && isDocumentComplete(d.id)).length;
  const totalChecklistCount = (task.checklist?.length || 0) + resolvedDocs.length;

  const CategoryIcon = CATEGORY_ICON_MAP[task.category];

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
        <div className="pt-[3px]" onClick={e => e.stopPropagation()}>
          <Checkbox
            checked={completed}
            onCheckedChange={() => toggleTask(task.id)}
            className={`rounded-md h-5 w-5 ${!completed ? categoryCheckboxClass[task.category] : ''}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium leading-snug ${completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {task.title}
          </p>
          <div className="flex items-center gap-2 flex-wrap mt-1.5">
            <span className={`text-[12px] font-semibold tracking-wider px-2 py-[2px] rounded-[6px] inline-flex items-center gap-1 ${categoryBadgeClass[task.category]}`}>
              <CategoryIcon className="w-3 h-3" />
              {CATEGORY_LABELS[task.category]}
            </span>
            {task.optional && (
              <span className="text-[12px] font-semibold tracking-wider px-2 py-[2px] rounded-[6px] border border-[hsl(214,32%,91%)] text-[hsl(215,16%,47%)] bg-transparent">
                Optional
              </span>
            )}
            {task.international && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center">
                    <Globe className={`w-3.5 h-3.5 cursor-help ${categoryGlobeClass[task.category]}`} />
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
        <div className="px-4 pb-4 pl-12 slide-up">
          {task.description && (
            <div className="flex gap-2.5 items-start -mt-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-[hsl(213,27%,68%)]" />
              <p className="text-[13px] text-muted-foreground leading-relaxed">{task.description}</p>
            </div>
          )}

          {task.whyItMatters && (
            <div className="flex gap-2.5 items-start mt-3">
              <Heart className="w-4 h-4 shrink-0 mt-0.5 text-[hsl(213,27%,68%)]" />
              <div>
                <p className="text-[12px] font-medium text-muted-foreground mb-1">Why this matters</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{task.whyItMatters}</p>
              </div>
            </div>
          )}

          {resolvedDocs.length > 0 && (
            <div className="flex gap-2.5 items-start mt-3">
              <ClipboardList className="w-4 h-4 shrink-0 mt-0.5 text-[hsl(213,27%,68%)]" />
              <div className="flex-1">
                <p className="text-[12px] font-medium text-muted-foreground mb-1.5">Documents you will need</p>
                {resolvedDocs.map((doc) => {
                  if (!doc) return null;
                  const checked = isDocumentComplete(doc.id);
                  return (
                    <div key={doc.id} className="mt-1.5 first:mt-0">
                      <label className="flex items-baseline gap-3 cursor-pointer min-h-[1.75rem]">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleDocument(doc.id)}
                          className={`rounded relative top-[3px] h-[18px] w-[18px] shrink-0 ${!checked ? categoryCheckboxClass[task.category] : ''}`}
                        />
                        <span className={`text-[13px] leading-snug ${checked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {doc.label} ({doc.germanName})
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {task.unlocks && task.unlocks.length > 0 && (
            <div className="flex gap-2.5 items-start mt-3">
              <Unlock className="w-4 h-4 shrink-0 mt-0.5 text-[hsl(213,27%,68%)]" />
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
            <div className="mt-3.5">
              {task.checklist.map((item, idx) => {
                const checked = isChecklistComplete(item.id);
                return (
                  <div key={item.id} className={`-mx-1 px-1 rounded-lg py-1 ${idx > 0 ? 'mt-2' : ''}`}>
                    <label className="grid cursor-pointer min-h-[1.75rem]" style={{ gridTemplateColumns: '24px 1fr' }}>
                      <span className="flex items-start justify-center pt-[3px]">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleChecklist(item.id)}
                          className={`rounded h-[18px] w-[18px] shrink-0 ${!checked ? categoryCheckboxClass[task.category] : ''}`}
                        />
                      </span>
                      <span className={`text-[13px] leading-snug ${checked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {item.label}
                      </span>
                    </label>
                    {item.description && !checked && (
                      <p className="text-xs text-muted-foreground/70 mt-px leading-relaxed" style={{ paddingLeft: '24px' }}>{item.description}</p>
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
