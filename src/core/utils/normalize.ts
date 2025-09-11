export const normalizeDriverName = (input: string) => {
  return typeof input === "string" ? input.trim() : "";
};
