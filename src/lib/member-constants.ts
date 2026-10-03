export const MEMBER_POSITIONS = [
  'President',
  'Secretary',
  'Vice President',
  'Joint Secretary',
  'Secretariat Member',
  'Unit Member',
] as const;

export type MemberPosition = (typeof MEMBER_POSITIONS)[number];

export const POSITION_LIMITS: Partial<Record<MemberPosition, number>> = {
  President: 1,
  Secretary: 1,
  'Vice President': 2,
  'Joint Secretary': 2,
  'Secretariat Member': 5,
};

export function normalizePosition(pos?: string): MemberPosition {
  if (!pos) return 'Unit Member';
  const clean = pos.trim();
  if (clean === 'Unit President' || clean.toLowerCase() === 'president') return 'President';
  if (clean === 'Unit Secretary' || clean.toLowerCase() === 'secretary') return 'Secretary';
  if (clean.toLowerCase() === 'vice president') return 'Vice President';
  if (clean.toLowerCase() === 'joint secretary') return 'Joint Secretary';
  if (clean.toLowerCase() === 'secretariat member' || clean.toLowerCase() === 'secretariat') return 'Secretariat Member';
  return 'Unit Member';
}

export function formatComradeName(name?: string): string {
  if (!name) return '';
  const trimmed = name.trim();
  if (!trimmed) return '';
  if (/^comrade\b/i.test(trimmed)) {
    return trimmed.replace(/^comrade\s*/i, 'Comrade ');
  }
  return `Comrade ${trimmed}`;
}

