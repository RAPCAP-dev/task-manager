export const PROJECT_TITLE = "Task manager next";

export enum ErrorCode {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_EMAIL='INVALID_EMAIL'
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.USER_NOT_FOUND]: 'Пользователь с таким email не найден',
  [ErrorCode.INVALID_EMAIL]: 'Неправильный email',
};
