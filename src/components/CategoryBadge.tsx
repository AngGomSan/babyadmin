import { TaskCategory, CATEGORY_LABELS } from '@/types';

const badgeClass: Record<TaskCategory, string> = {
  medical_care: 'badge-medical',
  paperwork: 'badge-paperwork',
  benefits_and_finances: 'badge-benefits',
  planning_and_preparation: 'badge-planning',
};

export default function CategoryBadge({ category }: { category: TaskCategory }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${badgeClass[category]}`}>
      {CATEGORY_LABELS[category]}
    </span>
  );
}
