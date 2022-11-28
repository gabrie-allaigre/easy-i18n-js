import { beforeAll, expect, test } from '@jest/globals';
import { installEasyI18n } from '../src';
import { plural, setEasyI18nMessages, tr } from '../lib';

test('Init Easy I18n', function () {
  installEasyI18n();

  expect('welcome').toHaveProperty('tr');
  expect('have_money').toHaveProperty('plural');
});

test('Init Easy I18n without messages', function () {
  installEasyI18n();

  expect('welcome'.tr()).toEqual('welcome');
  expect('have_money'.plural(1)).toEqual('have_money');
});
