export class RequestError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = "RequestError";
  }
}

export class ValidationError extends RequestError {
  constructor(fieldErrors: Record<string, string[]>) {
    const message = ValidationError.formatFieldErrors(fieldErrors);
    super(message, 400, fieldErrors);

    this.name = "ValidationError";
    this.errors = fieldErrors;
  }

  private static formatFieldErrors(fieldErrors: Record<string, string[]>) {
    return Object.entries(fieldErrors)
      .map(([field, messages]) => {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);

        if (messages[0] === "Required") {
          return `${fieldName} is required`;
        }

        return messages.join(" and ");
      })
      .join(", ");
  }
}

export class NotFoundError extends RequestError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends RequestError {
  constructor(message: string = "Access to this resource is forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class UnauthorizedError extends RequestError {
  constructor(
    message: string = "You are not authorized to access this resource",
  ) {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}
