import { HttpError } from '@refinedev/core';

export * from "./currency-number";
export * from "./date";
export * from "./get-name-initials";
export * from "./get-random-color";

export const handleApiError = (error: HttpError, form: any) => {
  let errorMessage = "An error occurred while processing your request.";
  const fieldErrors: { [key: string]: string } = {};

  if (error.statusCode === 400) {
    errorMessage = error.message || "Bad Request";
    if (error.errorCode === "invalid_body") {
      const fieldName = error.message.split(' ')[0];
      fieldErrors[fieldName] = error.message;
    }
  } else if (error.statusCode === 409) {
    errorMessage = "Resource already exists.";
  }

  // Set form field errors
  const formErrors = Object.entries(fieldErrors).map(([field, error]) => ({
    name: field,
    errors: [error],
  }));
  form.setFields(formErrors);

  return {
    message: `Error ${error.statusCode}!`,
    description: errorMessage,
    type: "error",
  };
};

export const phoneNumberValidator = (rule: any, value: string) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (!value || phoneRegex.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject('Please enter a valid phone number');
};
