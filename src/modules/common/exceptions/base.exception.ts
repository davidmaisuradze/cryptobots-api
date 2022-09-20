export class BaseException extends Error {
  public message: string;
  public errors = [];
  public status = 400;

  constructor(message = '', status = 400, errors = []) {
    super(message);
    this.errors = errors;
    if (message && !errors.length) {
      this.errors.push(message);
    }
    this.status = status;
  }

  public getStatus(): number {
    return this.status;
  }

  public setStatus(status: number): void {
    this.status = status;
  }
}
