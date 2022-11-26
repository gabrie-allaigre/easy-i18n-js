import { expect, test } from '@jest/globals';

test('Not init Easy I18n', function () {
  expect('welcome').not.toHaveProperty('tr');
  expect('have_money').not.toHaveProperty('plural');
});