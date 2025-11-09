export class ApplicationError extends Error {
  constructor(
    detail: string,
    public readonly source?: string,
    public readonly code?: string,
  ) {
    super(detail);
  }
}
