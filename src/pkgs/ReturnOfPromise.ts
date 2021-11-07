export type ReturnOfPromise<T> = T extends PromiseLike<infer U> ? U : T;
