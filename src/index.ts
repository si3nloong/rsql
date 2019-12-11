import { Expression } from './expression';
import Query from './query';
import { IArray, IBase, Operator } from './types';

const mapExpr = <T>(optr: Operator) => (field: string, value: T) =>
  new Expression(field, optr, value);

const groupBy = (seperator: string) => (
  ...args: Array<Expression | IArray>
) => {
  const length = args.length - 1;
  const result = args.reduce(
    (acc: IArray, cur: Expression | IArray, i: number) => {
      if (cur instanceof Expression) {
        acc.push(cur);
      } else {
        acc = acc.concat(cur);
      }
      if (i < length) {
        acc.push(seperator);
      }
      return acc;
    },
    ['('],
  );
  result.push(')');
  return result;
};

const or = groupBy(',');
const and = groupBy(';');
const eq = mapExpr<IBase>(Operator.Equal);
const ne = mapExpr<IBase>(Operator.NotEqual);
const gt = mapExpr<IBase>(Operator.GreaterThan);
const gte = mapExpr<IBase>(Operator.GreaterEqual);
const lt = mapExpr<IBase>(Operator.LesserThan);
const lte = mapExpr<IBase>(Operator.LesserEqual);
const like = mapExpr<IBase>(Operator.Like);
const notLike = mapExpr<IBase>(Operator.NotLike);
const includes = mapExpr<IBase[]>(Operator.In);
const notIncludes = mapExpr<IBase[]>(Operator.NotIn);

const select = (...args: string[]) => new Query().select(...args);
const filter = (...args: Array<Expression | IArray>) =>
  new Query().filter(...args);
const sort = (...args: string[]) => new Query().sort(...args);
const limit = (num: number) => new Query().limit(num);

export {
  filter,
  select,
  sort,
  limit,
  or,
  and,
  eq,
  eq as equal,
  ne,
  ne as notEqual,
  gt,
  gte,
  lt,
  lte,
  like,
  notLike,
  includes,
  notIncludes,
};
