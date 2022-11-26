import { PluralOptions, TrOptions, EasyI18nOptions, EasyI18n, EasyI18nMessages } from './easy-i18n';

export { PluralCase, EasyI18nOptions, TrOptions, PluralOptions } from './easy-i18n';

declare global {
  interface String {
    tr(options?: TrOptions): string;

    plural(value: number, options?: PluralOptions): string;
  }

  interface Window {
    easyI18n: {
      tr(key: string, options?: TrOptions): string;

      plural(key: string, value: number, options?: PluralOptions): string;
    };
  }
}

export function installEasyI18n(options?: EasyI18nOptions): void {
  if (typeof window !== 'undefined') {
    window.easyI18n = new EasyI18n(options);

    String.prototype.tr = function (options?: TrOptions): string {
      return window.easyI18n?.tr(this as string, options) ?? this;
    };

    String.prototype.plural = function (value: number, options?: PluralOptions): string {
      return window.easyI18n?.plural(this as string, value, options) ?? this;
    };
  }
}

export function setEasyI18nMessages(messages: EasyI18nMessages, locale?: string): void {
  if (typeof window !== 'undefined') {
    if (!(window.easyI18n instanceof EasyI18n)) {
      console.warn('You must call installEasyI18n before');

      window.easyI18n = new EasyI18n();
    }
    (window.easyI18n as EasyI18n).setMessages(messages, locale);
  }
}

export function tr(text: string, options?: TrOptions): string {
  return window.easyI18n?.tr(text, options) ?? text;
}

export function plural(text: string, value: number, options?: PluralOptions): string {
  return window.easyI18n?.plural(text, value, options) ?? text;
}




