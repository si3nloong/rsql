enum operator {
  equal,
  notEqual,
  greaterThan,
  greaterEqual,
  lesserThan,
  lesserEqual,
  like,
  notLike,
  in,
  notIn,
}

interface IStringer {
  string(): string;
}

type CustomArray = Array<string | IStringer>;

class Expression implements IStringer {
  private field: string;
  private operator: operator;
  private value: any;

  constructor(field: string, op: operator, value: any) {
    this.field = field;
    this.operator = op;
    this.value = value;
  }

  public string = () => {
    let str = this.field;
    switch (this.operator) {
      case operator.equal:
        str += '==';
        break;
      case operator.notEqual:
        str += '!=';
        break;
      case operator.lesserThan:
        str += '<';
        break;
      case operator.lesserEqual:
        str += '<=';
        break;
      case operator.greaterThan:
        str += '>';
        break;
      case operator.greaterEqual:
        str += '>=';
        break;
      case operator.in:
        str += '=in=';
        break;
      case operator.notIn:
        str += '=nin=';
        break;
      default:
        throw new Error('unsupported operator');
    }
    str += this.value;
    return str;
  };
}

const mapExpr = (optr: operator) => (field: string, value: any) =>
  new Expression(field, optr, value);

const groupBy = (seperator: string) => (...args: any[]) => {
  const length = args.length - 1;
  const result = args.reduce(
    (acc: CustomArray, cur: any, i: number) => {
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
const eq = mapExpr(operator.equal);
const ne = mapExpr(operator.notEqual);
const gt = mapExpr(operator.greaterThan);
const gte = mapExpr(operator.greaterEqual);
const lt = mapExpr(operator.lesserThan);
const lte = mapExpr(operator.lesserEqual);
const like = mapExpr(operator.like);
const notLike = mapExpr(operator.notLike);
const includes = mapExpr(operator.in);
const notIncludes = mapExpr(operator.notIn);

class Query {
  private projections: Array<string> = [];
  private conditions: CustomArray = [];
  private sorts: Array<string> = [];
  private max: number = 100;

  public select = (...args: Array<string>) => {
    this.projections = args;
    return this;
  };

  public filter = (...args: CustomArray) => {
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
const filter = (...args: CustomArray) => new Query().filter(...args);
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
