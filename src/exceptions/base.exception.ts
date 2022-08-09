export class BaseException extends Error {
  errors = [];
  status = 400;

  constructor(message = '', status = 400, errors = []) {
    super(message);
    this.errors = errors;
    if (message && !errors.length) {
      this.errors.push(message);
    }
    this.status = status;
  }
  getStatus(): number {
    return this.status;
  }
  setStatus(status: number): void {
    this.status = status;
  }
}
