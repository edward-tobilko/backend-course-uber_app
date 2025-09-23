export const normalizeDriverName = (input: unknown): string => {
  if (typeof input !== 'string') {
    throw new Error('The name must be a string');
  }

  const trimmed = input.trim();

  if (trimmed.length < 2) {
    throw new Error('The name is too short');
  }

  if (trimmed.length > 18) {
    throw new Error('The name is too long');
  }

  return trimmed;
};
