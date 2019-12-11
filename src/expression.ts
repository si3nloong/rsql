import { IStringer, Operator } from './types';

export class Expression implements IStringer {
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
