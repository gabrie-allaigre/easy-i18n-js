import { expect, test } from '@jest/globals';
import { installEasyI18n } from '../src';
import { cultureRegex } from '../src/plural-rules';

test('Test culture', function () {
  expect(cultureRegex.test('fr')).toBeTruthy();
  expect(cultureRegex.test('fr-FR')).toBeTruthy();
  expect(cultureRegex.test('en-US')).toBeTruthy();
  expect(cultureRegex.test('chr')).toBeTruthy();
  expect(cultureRegex.test('en_US')).toBeFalsy();
  expect(cultureRegex.test('england')).toBeFalsy();
});

test('Match culture', function () {
  console.log(cultureRegex.exec('fr-FR'));

  expect(cultureRegex.exec('fr')).toEqual(expect.arrayContaining(['fr', undefined, undefined]));
  expect(cultureRegex.exec('fr-FR')).toEqual(expect.arrayContaining(['fr', 'FR', undefined]));
  expect(cultureRegex.exec('en-US')).toEqual(expect.arrayContaining(['en', 'US', undefined]));
  expect(cultureRegex.exec('fr-FR-Toto')).toEqual(expect.arrayContaining(['fr', 'FR', 'Toto']));
});