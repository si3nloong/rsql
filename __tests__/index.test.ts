import { filter, ne, or, eq, includes, notIncludes } from '../src';

test('Query String', () => {
  const qs = filter(
    eq('name', 'test'),
    includes('status', ['A', 'B', 'C']),
    notIncludes('status', ['A', 'B', 'C']),
  ).qs();
  expect(qs).toBe(
    `$filter=(name==test;status=in=A,B,C;status=nin=A,B,C)&$limit=100`,
  );

  expect(filter(ne('b', 'value'), or(eq('c', 'v2'), eq('d', 'v4'))).qs()).toBe(
    `$filter=(b!=value;(c==v2,d==v4))&$limit=100`,
  );
});
