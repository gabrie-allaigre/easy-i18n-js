import { beforeAll, expect, test } from '@jest/globals';
import { installEasyI18n } from '../src';

beforeAll(function () {
  installEasyI18n();
});

test('Init Easy I18n', function () {
  expect('welcome').toHaveProperty('tr');
  expect('have_money').toHaveProperty('plural');
});

test('Init Easy I18n without messages', function () {
  expect('welcome'.tr()).toEqual('welcome');
  expect('have_money'.plural(1)).toEqual('have_money');
});