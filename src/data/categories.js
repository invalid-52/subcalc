export const CATEGORIES = [
  { id: 'streaming', label: 'Streaming', color: '#E50914', icon: 'film' },
  { id: 'music', label: 'Music', color: '#1DB954', icon: 'music' },
  { id: 'software', label: 'Software', color: '#3B82F6', icon: 'code' },
  { id: 'ai', label: 'AI Tools', color: '#10A37F', icon: 'sparkles' },
  { id: 'cloud', label: 'Cloud Storage', color: '#0061FF', icon: 'cloud' },
  { id: 'gaming', label: 'Gaming', color: '#107C10', icon: 'gamepad' },
  { id: 'productivity', label: 'Productivity', color: '#8B5CF6', icon: 'check-square' },
  { id: 'education', label: 'Education', color: '#F59E0B', icon: 'book' },
  { id: 'fitness', label: 'Fitness & Health', color: '#EC4899', icon: 'activity' },
  { id: 'news', label: 'News & Media', color: '#64748B', icon: 'newspaper' },
  { id: 'finance', label: 'Finance', color: '#14B8A6', icon: 'dollar-sign' },
  { id: 'utilities', label: 'Utilities', color: '#F97316', icon: 'zap' },
  { id: 'other', label: 'Other', color: '#94A3B8', icon: 'layers' },
];

export const CATEGORY_MAP = CATEGORIES.reduce((acc, cat) => {
  acc[cat.id] = cat;
  return acc;
}, {});

export function getCategory(id) {
  return CATEGORY_MAP[id] || CATEGORY_MAP.other;
}
