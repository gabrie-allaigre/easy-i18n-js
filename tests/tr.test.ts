import { expect, test } from '@jest/globals';
import { installEasyI18n, setEasyI18nMessages, tr } from '../src';
import lodash from 'lodash';

test('Simple message', function () {
  installEasyI18n();

  setEasyI18nMessages({
    'welcome': 'Hello world',
    'Complexe Key': 'Key is complexe',
    'common': {
      'yes': 'Yes'
    }
  });

  expect('welcome'.tr()).toEqual('Hello world');
  expect(tr('welcome')).toEqual('Hello world');
  expect('Hello world'.tr()).toEqual('Hello world');
  expect('Complexe Key'.tr()).toEqual('Key is complexe');
  expect('common'.tr()).toEqual('common');
  expect('common.yes'.tr()).toEqual('Yes');
});

test('Gender message', function () {
  installEasyI18n();

  setEasyI18nMessages({
    'welcome': {
      'male': 'Hi, boy',
      'female': 'Hello girl',
      'other': 'Welcome'
    },
    'welcome_male': {
      'male': 'Hi, boy',
      'other': 'Welcome'
    },
    'hello': 'Hello'
  });

  expect('welcome'.tr()).toEqual('welcome');
  expect('welcome'.tr({ gender: 'male' })).toEqual('Hi, boy');
  expect('welcome'.tr({ gender: 'female' })).toEqual('Hello girl');
  expect('welcome'.tr({ gender: 'other' })).toEqual('Welcome');
  expect('hello'.tr({ gender: 'male' })).toEqual('Hello');
  expect('welcome_male'.tr({ gender: 'male' })).toEqual('Hi, boy');
  expect('welcome_male'.tr({ gender: 'female' })).toEqual('welcome_male');
  expect('welcome_male'.tr({ gender: 'other' })).toEqual('Welcome');
});

test('Args message', function () {
  installEasyI18n();

  setEasyI18nMessages({
    'welcome': 'Hi {}, you are {} old',
    'complex': 'Hello {}, ignore \\{}, ok use here {}'
  });

  expect('welcome'.tr({ args: ['Gabriel', '30'] })).toEqual('Hi Gabriel, you are 30 old');
  expect('complex'.tr({ args: ['Gabriel', '30'] })).toEqual('Hello Gabriel, ignore {}, ok use here 30');
});

test('Named args message', function () {
  installEasyI18n();

  setEasyI18nMessages({
    'welcome': 'Hi {name}, you are {age} old',
    'complex': 'Hello {name}, ignore {nothing}, ok use here {here}'
  });

  expect('welcome'.tr({ namedArgs: { name: 'Gabriel', age: '30' } })).toEqual('Hi Gabriel, you are 30 old');
  expect('complex'.tr({ namedArgs: { name: 'Gabriel', here: '30' } })).toEqual('Hello Gabriel, ignore {nothing}, ok use here 30');
});

test('Mixed args message', function () {
  installEasyI18n();

  setEasyI18nMessages({
    'welcome': 'Hi {name}, you are {} old and rename {name}',
    'complex': 'Hello {}, ignore {nothing}, ok use here {here}'
  });

  expect('welcome'.tr({ args: ['30'], namedArgs: { name: 'Gabriel' } })).toEqual('Hi Gabriel, you are 30 old and rename Gabriel');
  expect('complex'.tr({ args: ['Gabriel'], namedArgs: { here: '30' } })).toEqual('Hello Gabriel, ignore {nothing}, ok use here 30');
  expect('Hi {}, do you want delete {nb} files?'.tr({
    args: ['Gabriel'],
    namedArgs: { nb: '30' }
  })).toEqual('Hi Gabriel, do you want delete 30 files?');
});

test('Args and gender message', function () {
  installEasyI18n();

  setEasyI18nMessages({
    'welcome': {
      'male': 'Hi, boy {name}',
      'female': 'Hello girl {name}',
      'other': 'Welcome {name}'
    }
  });

  expect('welcome'.tr({ namedArgs: { name: 'Gabriel' }, gender: 'male' })).toEqual('Hi, boy Gabriel');
  expect('welcome'.tr({ namedArgs: { name: 'Sandra' }, gender: 'female' })).toEqual('Hello girl Sandra');
  expect('welcome'.tr({ namedArgs: { name: 'Sandra and Gabriel' }, gender: 'other' })).toEqual('Welcome Sandra and Gabriel');
});

test('Link and modifiers message', function () {
  installEasyI18n({
    modifiers: {
      camel: lodash.camelCase
    }
  });

  setEasyI18nMessages({
    'common': {
      'yes': 'Yes',
      'no': 'No',
      'other': 'Other value'
    },
    'love': 'I love link @:common.yes or @:common.no',
    'love2': 'I love link @.lower:common.yes or @.upper:common.yes',
    'love3': 'I love link @.camel:common.other',
    'love4': 'Have you love {}? @.upper:common.yes!!',
    'notfound': 'Have you love {}? @:common.nothing',
    'notfound2': 'Have you love {}? @.neant:common.yes',
    'notfound3': 'Have you love {}? @:common',
  });

  expect('love'.tr()).toEqual('I love link Yes or No');
  expect('love2'.tr()).toEqual('I love link yes or YES');
  expect('love3'.tr()).toEqual('I love link otherValue');
  expect('love4'.tr({ args: ['Gabriel'] })).toEqual('Have you love Gabriel? YES!!');
  expect('notfound'.tr({ args: ['Gabriel'] })).toEqual('Have you love Gabriel? common.nothing');
  expect('notfound2'.tr({ args: ['Gabriel'] })).toEqual('Have you love Gabriel? Yes');
  expect('notfound3'.tr({ args: ['Gabriel'] })).toEqual('Have you love Gabriel? @:common');
});

test('Namespace message', function () {
  installEasyI18n();

  setEasyI18nMessages({
    'common': {
      'yes': 'oui',
      'no': 'non',
      'accept': 'accepter',
      'cancel': 'annuler'
    }
  });

  expect('yes'.tr()).toEqual('yes');
  expect('yes'.tr({ namespace: 'common' })).toEqual('oui');
  expect('accept'.tr({ namespace: 'notfound' })).toEqual('accept');
  expect('accept'.tr({ namespace: 'common' })).toEqual('accepter');
});

test('Simple message with key', function () {
  installEasyI18n();

  setEasyI18nMessages({
    'welcome': 'Hello world',
    'Complexe Key': 'Key is complexe',
    'common': {
      'yes': 'Yes'
    }
  });

  expect('welcome'.tr()).toEqual('Hello world');
  expect('welcome2'.tr()).toEqual('welcome2');
  expect('welcome2'.tr({ key: 'welcome' })).toEqual('Hello world');
  expect('welcome2'.tr({ key: 'notexist' })).toEqual('welcome2');
});

test('Simple message with key not found', function () {
  installEasyI18n();

  setEasyI18nMessages({
    'welcome': 'Hello world',
    'Complexe Key': 'Key is complexe',
    'common': {
      'yes': 'Yes'
    }
  });

  expect('blablabla'.tr({
    notFound: 'Not found key blablabla'
  })).toEqual('Not found key blablabla');
  expect('blablabla'.tr({
    args: ['test'],
    notFound: 'Not found key {}'
  })).toEqual('Not found key test');
});