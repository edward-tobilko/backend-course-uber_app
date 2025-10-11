export class DomainError extends Error {
  constructor(
    detail: string,
    public readonly source?: string,
    public readonly code?: string,
  ) {
    super(detail);
  }
}
