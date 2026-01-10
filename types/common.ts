export type ServerActionReturnValue<T> = {
  error: Error | null;
  data: T | null;
};
