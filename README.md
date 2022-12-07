# Easy I18n JS

Simplify translate and plural message. Library is small and easy.

Inspired by https://github.com/aissat/easy_localization for Flutter

## Install

```shell
npm install easy-i18n-js
```

## Usage

### Import

```typescript
import { installEasyI18n, setEasyI18nMessages, tr, plural } from 'easy-i18n-js';
```

### Static installEasyI18n

Initialize EasyI18n and install `tr` and `plural` function in [String]

```typescript
installEasyI18n(); // Default
```

```typescript
installEasyI18n({ ... }); // With options
```

#### Options arguments

| Name              | type                                                                                   | example                         | description              |
|-------------------|----------------------------------------------------------------------------------------|---------------------------------|--------------------------|
| logging           | `boolean`                                                                              | `true`                          | Show logging             |
| pluralRuleFn      | <code>'zero' &#124; 'one' &#124; 'two' &#124; 'few' &#124; 'many' &#124; 'other'</code> | `(value) => 'other'`            | Custom plural            |
| numberFormatterFn | `(value: number) => string`                                                            | `(value) => value.Precision(3)` | Global formatter         |
| modifiers         | <code>{ [key: string]: (val: string &#124; undefined) => string &#124; undefined } }   |                                 | Custom modifier for link |

### Static setEasyI18nMessages

Set messages for Easy 18n and set current locale

#### Arguments

| Name   | type                                                 | example   | description                   |
|--------|------------------------------------------------------|-----------|-------------------------------|
| msg    | <code>{ [key: string]: string &#124; msg; } }</code> | See below | Messages                      |
| locale | `string`                                             | `'fr_FR'` | Current locale use for plural |

```typescript
setEasyI18nMessages({
  'welcome': 'Hello world'
}); // Without locale
```

```typescript
setEasyI18nMessages({
  'welcome': 'Hello world'
}, 'en_US'); // With locale
```

### Translate tr()

Main function for translate your language keys

You can use extension methods of [String], you can also use tr() as a static function.

```typescript
installEasyI18n();

setEasyI18nMessages({
  'welcome': 'Hello world'
});

'welcome'.tr() // Hello world
tr('welcome') // Hello world
```

#### Arguments

| Name      | type                                               | example                            |
|-----------|----------------------------------------------------|------------------------------------|
| args      | `string[]`                                         | `['Gabriel', '20']`                |
| namedArgs | `{ [key: string]: string; } }`                     | `{ name : 'Gabriel', age : '20' }` |
| key       | `string`                                           | `'welcome'`                        |
| namespace | `string`                                           | `'common'`                         |
| gender    | <code>'male' &#124; 'female' &#124; 'other'</code> | `gender: 'other'`                  |

#### Examples

```typescript
installEasyI18n();

setEasyI18nMessages({
  'welcome': 'Welcome',
  'Complexe Key': 'Key is complexe',
  'common': {
    'welcome': 'Welcome everyone'
  },
  'msg_args': '{} are written in the {} language',
  'msg_named': 'Easy I18n is written in the {lang} language',
  'msg_mixed': 'Hi {name}, you are {} old and rename {name}',
  'welcome_gender': {
    'male': 'Hi, boy {name}',
    'female': 'Hello girl {name}',
    'other': 'Welcome {name}'
  },
});
```

```typescript
'welcome'.tr() // Welcome
```

```typescript
// Key not found, use key
'Hello world'.tr() // Hello world
```

```typescript
// Use namespace or nested key
'welcome'.tr({ namespace: 'common' }) // Welcome everyone
'common.welcome'.tr() // Welcome everyone
```

```typescript
// Args and NamedArgs
'msg_args'.tr({ args: ['Easy I18n', 'french'] }); // Easy I18n is written in the french language
'msg_named'.tr({ namedArgs: { lang: 'french' } }); // Easy I18n is written in the french language
'msg_mixed'.tr({ args: ['30'], namedArgs: { name: 'Gabriel' } }); // Hi Gabriel, you are 30 old and rename Gabriel
```

```typescript
// Key not exists, use key
'Hi {}, do you want delete {nb} files?'.tr({
  args: ['Gabriel'],
  namedArgs: { nb: '30' }
}); // Hi Gabriel, do you want delete 30 files?
```

```typescript
// Gender
'welcome_gender'.tr({ namedArgs: { name: 'Gabriel' }, gender: 'male' }); // Hi, boy Gabriel
'welcome_gender'.tr({ namedArgs: { name: 'Sandra' }, gender: 'female' }); // Hello girl Sandra
'welcome_gender'.tr({ namedArgs: { name: 'Sandra and Gabriel' }, gender: 'other' }); // Welcome Sandra and Gabriel
```

### Translate plural()

You can translate with pluralization. To insert a number in the translated string, use {}.

You can use extension methods of [String], you can also use plural() as a static function.

#### Arguments

| Name              | type                                               | example                            |
|-------------------|----------------------------------------------------|------------------------------------|
| args              | `string[]`                                         | `['Gabriel', '20']`                |
| namedArgs         | `{ [key: string]: string; } }`                     | `{ name : 'Gabriel', age : '20' }` |
| key               | `string`                                           | `'welcome'`                        |
| namespace         | `string`                                           | `'common'`                         |
| name              | `string`                                           | `money`                            |
| numberFormatterFn | `(value: number) => string`                        | `(value) => value.Precision(3)`    |
| gender            | <code>'male' &#124; 'female' &#124; 'other'</code> | `gender: 'other'`                  |

```typescript
installEasyI18n();

setEasyI18nMessages({
  'money': {
    'zero': 'You not have money',
    'one': 'You have {} dollar',
    'many': 'You have many {} dollars',
    'other': 'You have other {} dollars'
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
  }
});
```

```typescript
'money'.plural(10) // You have other 10 dollars
```

```typescript
'money_args'.plural(0, { args: ['Gabriel'] }) // Gabriel has no money
'money_args'.plural(1.5, { args: ['Gabriel'] }) // Gabriel has 1.5 dollars
```

```typescript
'money_named_args'.plural(1, { namedArgs: { name: 'Gabriel' }, name: 'money' }) // Gabriel has 1 dollar
'money_named_args'.plural(1.5, { namedArgs: { name: 'Gabriel' }, name: 'money' }) // Gabriel has 1.5 dollars
```

#### Gender

```typescript
installEasyI18n();

setEasyI18nMessages({
  'money': {
    'zero': { male: 'He not have money', female: 'She not have money', other: 'You not have money' },
    'one': { male: 'He have {} dollar', female: 'She have {} dollar', other: 'You have {} dollar' },
    'two': 'You have few {} dollars',
    'other': { male: 'He have other {} dollars', female: 'She have other {} dollars', other: 'You have other {} dollars' },
  }
});
```

```typescript
'money'.plural(0, { gender: 'female' }) // She not have money
'money'.plural(1, { gender: 'other' }) // You have 1 dollar
'money'.plural(2, { gender: 'male' }) // You have few 2 dollars
'money'.plural(1.5, { gender: 'male' }) // He have other 1.5 dollars
```

#### Formatter

With install for default

```typescript
installEasyI18n({
  numberFormatterFn: (value) => value.toString().replaceAll('.', ',')
});
```

or for particular

```typescript
'money'.plural(10.24, { numberFormatterFn: (value) => value.toString().replaceAll('.', ',') }) // You have other 10,24 dollars
```

### Locale and PluralCase

With specific locale

```typescript
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
```

```typescript
'money'.plural(0) // You not have money
'money'.plural(1.5) // You have other 1.5 dollars
'money'.plural(3) // You have few 3 dollars
'money'.plural(4000000) // You have many 4000000 dollars
'money'.plural(5) // You have other 5 dollars
```

Or custom PluralCase

```typescript
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
```

```typescript
'money'.plural(0) // You not have money
'money'.plural(0.5) // You not have money
'money'.plural(1) // You have 1 dollar
'money'.plural(1.5) // You have 1.5 dollar
'money'.plural(5) // You have few 5 dollars
'money'.plural(10.24) // You have other 10.24 dollars
'money'.plural(31024) // You have many 31024 dollars
```

### Link and modifiers

If there's a translation key that will always have the same concrete text as another one you can just link to it. To link to another
translation key, all you have to do is to prefix its contents with an @: sign followed by the full name of the translation key including the
namespace you want to link to.

You can also do nested anonymous and named arguments inside the linked messages.

Formatting linked locale messages If the language distinguishes cases of character, you may need to control the case of the linked locale
messages. Linked messages can be formatted with modifier @.modifier:key

The below modifiers are available currently.

| modifier    | description                                           | example           |
|-------------|-------------------------------------------------------|-------------------|
| lower       | Lowercase all characters in the linked message.       | @:.lower:key      |
| upper       | Uppercase all characters in the linked message        | @:.upper:key      |
| capitalize  | Capitalize the first character in the linked message. | @:.capitalize:key |

```typescript
installEasyI18n({
  modifiers: {
    camel: lodash.camelCase
  }
});

setEasyI18nMessages({
  'common': {
    'yes': 'Yes',
    'no': 'No',
    'other': 'Other value',
    'full_name': '{first} {last}'
  },
  'love': 'I love link @:common.yes or @:common.no',
  'love2': 'I love link @.lower:common.yes or @.upper:common.no',
  'love3': 'I love link @.camel:common.other',
  'love4': 'I love link @:common.full_name'
});
```

```typescript
'love'.tr() // I love link Yes or No
'love2'.tr() // I love link yes or YES
'love3'.tr() // I love link otherValue
'love4'.tr({ namedArgs: { first: 'Gabriel', last: 'Allaigre' } }) // I love link Gabriel Allaigre
```