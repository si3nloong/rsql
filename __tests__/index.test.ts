import { filter, eq, equal, includes, notIncludes } from '../src';

test('Query String', () => {
  const qs = filter(
    eq('name', 'test'),
    includes('status', ['A', 'B', 'C']),
    notIncludes('status', ['A', 'B', 'C']),
  ).qs();
  expect(qs).toBe(
    `$filter=(name==test;status=in=A,B,C;status=nin=A,B,C)&$limit=100`,
  );
});
