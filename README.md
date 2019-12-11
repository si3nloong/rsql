[![Build Status](https://github.com/si3nloong/rsql/workflows/build/badge.svg?branch=master)](https://github.com/si3nloong/rsql/actions)

### RESTful Query Language (RSQL) string generator

```
import { filter, ne, or, eq, includes, notIncludes } from 'rsql';

filter(
  eq('name', 'test'),
  includes('status', ['A', 'B', 'C']),
  notIncludes('status', ['A', 'B', 'C']),
).qs(); // $filter=(name==test;status=in=A,B,C;status=nin=A,B,C)&$limit=100

filter(
  ne('b', 'value'),
  or(
    eq('c', 'v2'),
    eq('d', 'v4'),
  ),
).qs(); // $filter=(b!=value;(c==v2,d==v4))&$limit=100

```
