export const PROJECT_TITLE = "Task manager next";

export enum ErrorCode {
  USER_NOT_FOUND = "USER_NOT_FOUND",
  INVALID_EMAIL = "INVALID_EMAIL",
  DATABASE_ERROR = 'DATABASE_ERROR',
  
  CREATE_TASK_ERROR = "CREATE_TASK_ERROR",
  UPDATE_TASK_ERROR = "UPDATE_TASK_ERROR",
  TASK_NOT_FOUND_ERROR = 'TASK_NOT_FOUND_ERROR',
  TASK_ALREADY_ASSIGNED='TASK_ALREADY_ASSIGNED',

  CREATE_PROJECT_ERROR = "CREATE_PROJECT_ERROR",
  UPDATE_PROJECT_ERROR = "UPDATE_PROJECT_ERROR",
  USER_ALREADY_IN_PROJECT="USER_ALREADY_IN_PROJECT",
  CANNOT_REMOVE_OWNER = 'CANNOT_REMOVE_OWNER',
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.USER_NOT_FOUND]: "Пользователь с таким email не найден",
  [ErrorCode.INVALID_EMAIL]: "Неправильный email",
  [ErrorCode.DATABASE_ERROR]: "Ошибка базы данных",

  [ErrorCode.CREATE_TASK_ERROR]: "Ошибка создания задачи",
  [ErrorCode.UPDATE_TASK_ERROR]: "Ошибка обновления задачи",
  [ErrorCode.TASK_NOT_FOUND_ERROR]: 'Задача не найдена',
  [ErrorCode.TASK_ALREADY_ASSIGNED]: 'Задача уже назначена на пользователя',
  
  [ErrorCode.CREATE_PROJECT_ERROR]: "Ошибка создания проекта",
  [ErrorCode.UPDATE_PROJECT_ERROR]: "Ошибка обновления проекта",
  [ErrorCode.USER_ALREADY_IN_PROJECT]: 'Пользователь уже добавлен в проект',
  [ErrorCode.CANNOT_REMOVE_OWNER]: 'Нельзя удалять владельца проекта',
};

export const SUCCESS_MESSAGE = {
  CREATE_TASK: "Задача создана",
  UPDATE_TASK: "Задача обновлена",
  CREATE_PROJECT: "Проект создан",
  UPDATE_PROJECT: "Проект обновлен",
};
