export enum Operator {
  Equal,
  NotEqual,
  GreaterThan,
  GreaterEqual,
  LesserThan,
  LesserEqual,
  Like,
  NotLike,
  In,
  NotIn,
}

export interface IStringer {
  string(): string;
}

export type IBase = string | boolean | number;
export type IArray = Array<string | IStringer>;
