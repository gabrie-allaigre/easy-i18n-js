import { expect, test } from '@jest/globals';
import { plural, setEasyI18nMessages, tr } from '../lib';

test('Not init Easy I18n', function () {
  expect('welcome').not.toHaveProperty('tr');
  expect('have_money').not.toHaveProperty('plural');
});

test('Not install', function () {
  setEasyI18nMessages({});

  expect(tr('welcome')).toEqual('welcome');
  expect(plural('have_money', 1)).toEqual('have_money');
});
