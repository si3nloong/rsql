enum Operator {
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

interface IStringer {
  string(): string;
}

type BaseValue = string | boolean | number;
type CustomArray = Array<string | IStringer>;

class Expression implements IStringer {
  private field: string;
  private operator: Operator;
  private value: any;

  constructor(field: string, op: Operator, value: any) {
    this.field = field;
    this.operator = op;
    this.value = value;
  }

  public string = () => {
    let str = this.field;
    switch (this.operator) {
      case Operator.Equal:
        str += '==';
        break;
      case Operator.NotEqual:
        str += '!=';
        break;
      case Operator.LesserThan:
        str += '<';
        break;
      case Operator.LesserEqual:
        str += '<=';
        break;
      case Operator.GreaterThan:
        str += '>';
        break;
      case Operator.GreaterEqual:
        str += '>=';
        break;
      case Operator.In:
        str += '=in=';
        break;
      case Operator.NotIn:
        str += '=nin=';
        break;
      default:
        throw new Error('unsupported Operator');
    }
    str += this.value;
    return str;
  };
}

const mapExpr = <T>(optr: Operator) => (field: string, value: T) =>
  new Expression(field, optr, value);

const groupBy = (seperator: string) => (
  ...args: Array<Expression | CustomArray>
) => {
  const length = args.length - 1;
  const result = args.reduce(
    (acc: CustomArray, cur: Expression | CustomArray, i: number) => {
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
const eq = mapExpr<BaseValue>(Operator.Equal);
const ne = mapExpr<BaseValue>(Operator.NotEqual);
const gt = mapExpr<BaseValue>(Operator.GreaterThan);
const gte = mapExpr<BaseValue>(Operator.GreaterEqual);
const lt = mapExpr<BaseValue>(Operator.LesserThan);
const lte = mapExpr<BaseValue>(Operator.LesserEqual);
const like = mapExpr<BaseValue>(Operator.Like);
const notLike = mapExpr<BaseValue>(Operator.NotLike);
const includes = mapExpr<Array<BaseValue>>(Operator.In);
const notIncludes = mapExpr<Array<BaseValue>>(Operator.NotIn);

class Query {
  private projections: Array<string> = [];
  private conditions: CustomArray = [];
  private sorts: Array<string> = [];
  private max: number = 100;

  public select = (...args: Array<string>) => {
    this.projections = args;
    return this;
  };

  public filter = (...args: Array<Expression | CustomArray>) => {
    this.conditions = and(...args);
    return this;
  };

  public sort = (...args: Array<string>) => {
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
      querystr += querystr != '' ? '&' : '';
      querystr += `$select=${this.projections.join(',')}`;
    }

    if (this.conditions.length > 0) {
      querystr += querystr != '' ? '&' : '';
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

    if (this.sort.length > 0) {
      querystr += querystr != '' ? '&' : '';
      querystr += `$sort=${this.sorts.join(',')}`;
    }

    if (this.max > 0) {
      querystr += querystr != '' ? '&' : '';
      querystr += `$limit=${this.max.toFixed(0)}`;
    }

    return querystr;
  };
}

const select = (...args: Array<string>) => new Query().select(...args);
const filter = (...args: Array<Expression | CustomArray>) =>
  new Query().filter(...args);
const sort = (...args: Array<string>) => new Query().sort(...args);
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
