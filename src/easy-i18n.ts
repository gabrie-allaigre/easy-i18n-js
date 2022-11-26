import lodash from 'lodash';
import { getPluralRules } from './plural-rules';

export type PluralCase = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

export type EasyI18nOptions = {
  logging?: boolean;
  pluralRuleFn?: (value: number) => PluralCase;
  numberFormatterFn?: (value: number) => string;
  modifiers?: {
    [key: string]: (val: string | undefined) => string | undefined;
  }
};

export type EasyI18nMessages = { [key: string]: string | EasyI18nMessages; };

type Arg = string;

type OptionsBase = {
  args?: Arg[];
  namedArgs?: Record<string, Arg>;
  namespace?: string;
}

export type TrOptions = OptionsBase & {
  gender?: 'male' | 'female' | 'other';
};

export type PluralOptions = OptionsBase & {
  name?: string;
  numberFormatterFn?: (value: number) => string;
};

const replaceArgRegex = new RegExp('(?<!\\\\){}');
const replaceNoArgRegex = new RegExp('\\\\{}', 'g');
const linkKeyMatcher = new RegExp('@(?:\.[a-zA-Z0-9-_]+)?:(?:[\\w\\-_|.]+|\([\\w\\-_|.]+\))', 'g');
const linkKeyPrefixMatcher = new RegExp('^@(?:\.([a-zA-Z0-9-_]+))?:');
const bracketsMatcher = new RegExp('[()]', 'g');

export class EasyI18n {

  private messages: EasyI18nMessages = {};
  private locale?: string;

  private readonly modifiers: { [key: string]: (val: string) => string; };

  constructor(
    private readonly options?: EasyI18nOptions
  ) {
    this.modifiers = {
      'upper': (val: string) => val?.toUpperCase(),
      'lower': (val: string) => val?.toLowerCase(),
      'capitalize': (val: string) => `${lodash.capitalize(val)}`,
      ...(options?.modifiers ?? {})
    }
  }

  public setMessages(messages: EasyI18nMessages, locale?: string): void {
    this.messages = messages;
    this.locale = locale;
  }

  public tr(key: string, options?: TrOptions): string {
    let v: string | EasyI18nMessages;
    if (options?.gender) {
      v = this.gender(key, options.gender, options?.namespace);
    } else {
      v = this.resolve(key, options?.namespace) ?? key;
    }

    let res: string;
    if (!lodash.isString(v)) {
      if (this.options?.logging ?? true) {
        console.warn(`Resource is not a String ${key}`);
      }
      res = key;
    } else {
      res = v;
    }

    res = this.replaceLinks(res);

    res = this.replaceNamedArgs(res, options?.namedArgs);

    return this.replaceArgs(res, options?.args);
  }

  public plural(key: string, value: number, options?: PluralOptions): string {
    const pluralCase = this.pluralCase(value);

    const v = this.resolvePlural(key, pluralCase, options?.namespace);

    let res: string;
    if (!lodash.isString(v)) {
      if (this.options?.logging ?? true) {
        console.warn(`Resource is not a String ${key}`);
      }
      res = key;
    } else {
      res = v;
    }

    const fn = options?.numberFormatterFn ?? this.options?.numberFormatterFn;
    const formattedValue = fn != null ? fn(value) : value.toString();

    res = this.replaceLinks(res);

    if (options?.name != null) {
      res = this.replaceNamedArgs(res, { ...(options?.namedArgs ?? {}), [options.name]: formattedValue });
    } else {
      res = this.replaceNamedArgs(res, options?.namedArgs);
    }

    return this.replaceArgs(res, [...(options?.args ?? []), formattedValue]);
  }

  private gender(key: string, gender: 'male' | 'female' | 'other', namespace: string | undefined): string | EasyI18nMessages {
    return this.resolve(`${key}.${gender}`, namespace) ?? key;
  }

  private replaceLinks(res: string): string {
    const matches = res.matchAll(linkKeyMatcher);

    if (matches == null) {
      return res;
    }

    for (const match of matches) {
      const link = match[0];
      const linkPrefixMatches = link.match(linkKeyPrefixMatcher);
      if (linkPrefixMatches != null && linkPrefixMatches.length > 1) {
        const [linkPrefix, formatterName] = linkPrefixMatches;

        const linkPlaceholder = link.replaceAll(linkPrefix, '').replaceAll(bracketsMatcher, '');

        const v = this.resolve(linkPlaceholder, undefined) ?? linkPlaceholder;
        if (!lodash.isString(v)) {
          if (this.options?.logging ?? true) {
            console.warn(`Resource is not a String ${linkPlaceholder}`);
          }
        } else {
          let translated = v;

          if (formatterName != null) {
            const modifier = this.modifiers[formatterName];
            if (modifier != null) {
              translated = modifier(translated);
            } else {
              if (this.options?.logging ?? true) {
                console.warn(`Undefined modifier ${formatterName}, available modifiers: ${Object.keys(this.modifiers).join(', ')}`);
              }
            }
          }

          res = translated ? res.replaceAll(new RegExp(lodash.escapeRegExp(link), 'g'), translated) : res;
        }
      }
    }

    return res;
  }

  private replaceNamedArgs(res: string, namedArgs?: Record<string, Arg>): string {
    if (namedArgs == null || lodash.isEmpty(namedArgs)) {
      return res;
    }

    return Object.keys(namedArgs).reduce((acc, x) =>
        acc.replaceAll(new RegExp(`{${lodash.escapeRegExp(x)}}`, 'g'), namedArgs[x] ?? x),
      res);
  }

  private replaceArgs(res: string, args?: Arg[]): string {
    if (args == null || args.length === 0) {
      return res;
    }

    for (const arg of args) {
      res = res.replace(replaceArgRegex, arg?.toString() ?? '');
    }

    return res.replaceAll(replaceNoArgRegex, '{}');
  }

  private resolve(key: string, namespace: string | undefined): string | EasyI18nMessages | undefined {
    let k = key;
    if (namespace) {
      k = `${namespace}.${key}`;
    }
    const resource = lodash.get(this.messages, k);
    if (resource == null) {
      if (this.options?.logging ?? true) {
        console.warn(`Localization key ${key} not found`);
      }
      return undefined;
    }
    return resource;
  }

  private pluralCase(value: number): PluralCase {
    switch (value) {
      case 0:
        return 'zero';
      case 1:
        return 'one';
      case 2:
        return 'two';
    }

    if (this.options?.pluralRuleFn != null) {
      return this.options.pluralRuleFn(value) ?? 'other';
    }

    if (this.locale != null) {
      return getPluralRules(this.locale, value);
    }

    return 'other';
  }

  private resolvePlural(key: string, subKey: PluralCase, namespace: string | undefined): string | EasyI18nMessages {
    if (subKey === 'other') {
      return this.resolve(`${key}.other`, namespace) ?? key;
    }

    const tag = `${key}.${subKey}`;
    const res = this.resolve(tag, namespace);
    if (res === tag) {
      return this.resolve(`${key}.other`, namespace) ?? key;
    }
    return res ?? key;
  }
}
