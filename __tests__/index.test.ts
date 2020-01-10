import { filter, ne, or, eq, includes, notIncludes, gte, lte } from '../src';

test('Query String', () => {
  const qs = filter(
    eq('name', 1),
    ne('flag', true),
    includes('status', ['A', 'B', 'C']),
    notIncludes('status', ['A', 'B', 'C']),
  )
    .sort('a', 'b', 'c')
    .qs();
  expect(qs).toBe(
    `filter=(name==1;flag=ne=true;status=in=A,B,C;status=nin=A,B,C)&sort=a,b,c&limit=100`,
  );

  expect(filter(ne('b', 'value'), or(eq('c', 'v2'), eq('d', 'v4'))).qs()).toBe(
    `filter=(b=ne='value';(c=='v2',d=='v4'))&limit=100`,
  );

  const qs1 = filter(
    gte('submittedAt', '2019-12-22T16:00:00Z'),
    lte('submittedAt', '2019-12-31T15:59:59Z'),
    eq('status', 'APPROVED'),
  ).qs();
  expect(qs1).toBe(
    `filter=(submittedAt>='2019-12-22T16:00:00Z';submittedAt<='2019-12-31T15:59:59Z';status=='APPROVED')&limit=100`,
  );
});
