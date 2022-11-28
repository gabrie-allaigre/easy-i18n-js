import { expect, test } from '@jest/globals';
import { installEasyI18n, plural, setEasyI18nMessages } from '../src';

test('Simple message', function () {
  installEasyI18n();

  setEasyI18nMessages({
    'welcome': 'Hello world',
    'money': {
      'zero': 'You not have money',
      'one': 'You have {} dollar',
      'many': 'You have many {} dollars',
      'other': 'You have other {} dollars'
    }
  });

  expect('welcome'.plural(0)).toEqual('welcome');
  expect('money'.plural(0)).toEqual('You not have money');
  expect('money'.plural(1)).toEqual('You have 1 dollar');
  expect('money'.plural(1.5)).toEqual('You have other 1.5 dollars');
  expect('money'.plural(2)).toEqual('You have other 2 dollars');
  expect('money'.plural(10)).toEqual('You have other 10 dollars');
  expect(plural('money', 0)).toEqual('You not have money');
});

test('Simple gender message', function () {
  installEasyI18n();

  setEasyI18nMessages({
    'welcome': 'Hello world',
    'money': {
      'zero': { male: 'He not have money', female: 'She not have money', other: 'You not have money' },
      'one': { male: 'He have {} dollar', female: 'She have {} dollar', other: 'You have {} dollar' },
      'two': 'You have few {} dollars',
      'other': { male: 'He have other {} dollars', female: 'She have other {} dollars', other: 'You have other {} dollars' },
    }
  });

  expect('welcome'.plural(0, {gender: 'male'})).toEqual('welcome');
  expect('money'.plural(0, {gender: 'female'})).toEqual('She not have money');
  expect('money'.plural(1, {gender: 'other'})).toEqual('You have 1 dollar');
  expect('money'.plural(2, {gender: 'male'})).toEqual('You have few 2 dollars');
  expect('money'.plural(1.5, {gender: 'male'})).toEqual('He have other 1.5 dollars');
  expect('money'.plural(2, {gender: 'female'})).toEqual('You have few 2 dollars');
  expect('money'.plural(10, {gender: 'male'})).toEqual('He have other 10 dollars');
  expect('money'.plural(10)).toEqual('money');
  expect(plural('money', 0, {gender: 'female'})).toEqual('She not have money');
});

test('Formatter message', function () {
  installEasyI18n({
    numberFormatterFn: (value) => value.toPrecision(3)
  });

  setEasyI18nMessages({
    'money': {
      'zero': 'You not have money',
      'one': 'You have {} dollar',
      'many': 'You have many {} dollars',
      'other': 'You have other {} dollars'
    }
  });

  expect('money'.plural(0)).toEqual('You not have money');
  expect('money'.plural(1)).toEqual('You have 1.00 dollar');
  expect('money'.plural(1.5)).toEqual('You have other 1.50 dollars');
  expect('money'.plural(10.24, { numberFormatterFn: (value) => value.toString().replaceAll('.', ',') })).toEqual('You have other 10,24 dollars');
});

test('PluralCase message', function () {
  installEasyI18n({
    pluralRuleFn: (value) => {
      if (value < 1) {
        return 'zero';
      }
      if (value < 2) {
        return 'one';
      }
      if (value < 10) {
        return 'few';
      }
      if (value > 10000) {
        return 'many';
      }
      return 'other';
    }
  });

  setEasyI18nMessages({
    'money': {
      'zero': 'You not have money',
      'one': 'You have {} dollar',
      'few': 'You have few {} dollars',
      'many': 'You have many {} dollars',
      'other': 'You have other {} dollars'
    }
  });

  expect('money'.plural(0)).toEqual('You not have money');
  expect('money'.plural(0.5)).toEqual('You not have money');
  expect('money'.plural(1)).toEqual('You have 1 dollar');
  expect('money'.plural(1.5)).toEqual('You have 1.5 dollar');
  expect('money'.plural(5)).toEqual('You have few 5 dollars');
  expect('money'.plural(10.24)).toEqual('You have other 10.24 dollars');
  expect('money'.plural(31024)).toEqual('You have many 31024 dollars');
});

test('Mixed args message', function () {
  installEasyI18n();

  setEasyI18nMessages({
    'money': {
      'zero': '{name} not have money',
      'one': '{name} have {} dollar',
      'many': '{name} have many {} dollars',
      'other': '{name} have other {} dollars'
    },
    'money_args': {
      'zero': '{} has no money',
      'one': '{} has {} dollar',
      'many': '{} has {} dollars',
      'other': '{} has {} dollars'
    },
    'money_named_args': {
      'zero': '{name} has no money',
      'one': '{name} has {money} dollar',
      'many': '{name} has {money} dollars',
      'other': '{name} has {money} dollars'
    },
  });

  expect('money'.plural(0, { namedArgs: { name: 'Gabriel' } })).toEqual('Gabriel not have money');
  expect('money'.plural(1.5, { namedArgs: { name: 'Gabriel' } })).toEqual('Gabriel have other 1.5 dollars');
  expect('money_args'.plural(0, { args: ['Gabriel'] })).toEqual('Gabriel has no money');
  expect('money_args'.plural(1.5, { args: ['Gabriel'] })).toEqual('Gabriel has 1.5 dollars');
  expect('money_named_args'.plural(1, { namedArgs: { name: 'Gabriel' }, name: 'money' })).toEqual('Gabriel has 1 dollar');
  expect('money_named_args'.plural(1.5, { namedArgs: { name: 'Gabriel' }, name: 'money' })).toEqual('Gabriel has 1.5 dollars');
});

test('Locale message', function () {
  installEasyI18n();

  setEasyI18nMessages({
    'money': {
      'zero': 'You not have money',
      'one': 'You have {} dollar',
      'few': 'You have few {} dollars',
      'many': 'You have many {} dollars',
      'other': 'You have other {} dollars'
    }
  }, 'br');

  expect('money'.plural(0)).toEqual('You not have money');
  expect('money'.plural(1.5)).toEqual('You have other 1.5 dollars');
  expect('money'.plural(3)).toEqual('You have few 3 dollars');
  expect('money'.plural(4000000)).toEqual('You have many 4000000 dollars');
  expect('money'.plural(5)).toEqual('You have other 5 dollars');
});