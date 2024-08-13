export const log = (...args: unknown[]): void => {
  // eslint-disable-next-line no-console -- logger

  console.log("LOGGERcsdjk: ", ...args);
};

export * from "./lib";
export * from "./customErrors";
export * from "./zodSchemas";
