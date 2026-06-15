const avatarColors = [
  'bg-primary/20 text-primary',
  'bg-green-100 text-green-600',
  'bg-blue-100 text-blue-600',
  'bg-purple-100 text-purple-600',
  'bg-pink-100 text-pink-600',
];

export function getInitials(name: string | null | undefined): string {
  if (!name || typeof name !== 'string') return '??';
  const trimmedName = name.trim();
  if (!trimmedName) return '??';
  const parts = trimmedName.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return trimmedName.substring(0, 2).toUpperCase();
}

export function getAvatarColor(name: string | null | undefined): string {
  if (!name || typeof name !== 'string') return avatarColors[0];
  const index =
    name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    avatarColors.length;
  return avatarColors[index];
}
