import { and } from '.';
import { Expression } from './expression';
import { IArray, IStringer } from './types';

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
      querystr += `$select=${this.projections.join(',')}`;
    }

    if (this.conditions.length > 0) {
      querystr += querystr !== '' ? '&' : '';
      querystr += `$filter=${this.conditions.reduce(
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
      querystr += `$sort=${this.sorts.join(',')}`;
    }

    if (this.max > 0) {
      querystr += querystr !== '' ? '&' : '';
      querystr += `$limit=${this.max.toFixed(0)}`;
    }

    return querystr;
  };
}
