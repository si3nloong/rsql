import { IStringer, Operator } from './types';

export class Expression implements IStringer {
  constructor(
    private field: string,
    private operator: Operator,
    private value: any,
  ) {}

  public string = () => {
    let str = this.field;
    switch (this.operator) {
      case Operator.Equal:
        str += '==';
        break;
      case Operator.NotEqual:
        str += '=ne=';
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
      case Operator.Like:
        str += '=like=';
        break;
      case Operator.NotLike:
        str += '=nlike=';
        break;
      default:
        throw new Error('unsupported Operator');
    }
    switch (typeof this.value) {
      case 'string':
        str += `'${this.value}'`;
        break;
      default:
        str += this.value;
    }
    return str;
  };
}
