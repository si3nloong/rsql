import { Expression } from './expression';
import { IArray, IBase, IStringer, Operator } from './types';

export default class Query {
  private projections: string[] = [];
  private conditions: IArray = [];
  private sorts: string[] = [];
  private max: number = 100;

  public select = (...args: string[]) => {
    this.projections = args;
    return this;
  };

  public filter = (...args: Array<Expression | IArray>) => {
    this.conditions = and(...args);
    return this;
  };

  public sort = (...args: string[]) => {
    this.sorts = args;
    return this;
  };

  public limit = (num: number) => {
    this.max = num;
    return this;
  };

  public qs = () => {
    let querystr = '';

    if (this.projections.length > 0) {
      querystr += querystr !== '' ? '&' : '';
      querystr += `select=${this.projections.join(',')}`;
    }

    if (this.conditions.length > 0) {
      querystr += querystr !== '' ? '&' : '';
      querystr += `filter=${this.conditions.reduce(
        (acc: string, cur: IStringer | string) => {
          if (typeof cur === 'string') {
            acc += cur;
          } else {
            acc += cur.string();
          }
          return acc;
        },
        '',
      )}`;
    }

    if (this.sorts.length > 0) {
      querystr += querystr !== '' ? '&' : '';
      querystr += `sort=${this.sorts.join(',')}`;
    }

    if (this.max > 0) {
      querystr += querystr !== '' ? '&' : '';
      querystr += `limit=${this.max.toFixed(0)}`;
    }

    return querystr;
  };
}

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

export const or = groupBy(',');
export const and = groupBy(';');
export const eq = mapExpr<IBase>(Operator.Equal);
export const ne = mapExpr<IBase>(Operator.NotEqual);
export const gt = mapExpr<IBase>(Operator.GreaterThan);
export const gte = mapExpr<IBase>(Operator.GreaterEqual);
export const lt = mapExpr<IBase>(Operator.LesserThan);
export const lte = mapExpr<IBase>(Operator.LesserEqual);
export const like = mapExpr<IBase>(Operator.Like);
export const notLike = mapExpr<IBase>(Operator.NotLike);
export const includes = mapExpr<IBase[]>(Operator.In);
export const notIncludes = mapExpr<IBase[]>(Operator.NotIn);

export const select = (...args: string[]) => new Query().select(...args);
export const filter = (...args: Array<Expression | IArray>) =>
  new Query().filter(...args);
export const sort = (...args: string[]) => new Query().sort(...args);
export const limit = (num: number) => new Query().limit(num);
