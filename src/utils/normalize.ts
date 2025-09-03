export const normalizeCourseName = (input: string) => {
  return typeof input === "string" ? input.trim() : "";
};
