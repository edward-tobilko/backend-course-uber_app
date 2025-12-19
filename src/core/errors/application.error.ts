export class ApplicationError extends Error {
  constructor(
    detail: string,
    public readonly source?: string,
    public readonly code?: string,
  ) {
    super(detail);
  }
}

// ? class ApplicationError extends Error - можно бросать: throw new ApplicationError(...); можно ловить: catch (e) { ... }; будет стандартный стек (.stack); instanceof ApplicationError будет работать и можно другим кодом отличать бизнес-ошибки от технических.
