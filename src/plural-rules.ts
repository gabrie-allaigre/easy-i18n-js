import { PluralCase } from './easy-i18n';
import lodash from 'lodash';

export const cultureRegex = new RegExp('^([a-z]{2,3})(?:-([A-Z]{2,3})(?:-([a-zA-Z]{4}))?)?$');

export function getPluralRules(local: string, howMany: number): PluralCase {
  return new PluralRules(howMany).getPluralCase(local);
}

class PluralRules {

  n: number;
  precision: number;
  // The integer part of [this.n]
  i: number;
  // Number of visible fraction digits.
  v: number = 0;
  // The visible fraction digits in n, with trailing zeros.
  f: number = 0;
  // The visible fraction digits in n, without trailing zeros.
  t: number = 0;

  constructor(howMany: number, precision = 0) {
    this.n = howMany;
    this.precision = precision;
    this.i = Math.round(this.n);

    this.updateVF(this.n);
    this.updateWT(this.f);
  }

  private decimals(n: number): number {
    const str = this.precision == null ? '$n' : n.toPrecision(this.precision);
    const result = str.indexOf('.');
    return (result == -1) ? 0 : str.length - result - 1;
  }

  private updateVF(n: number): void {
    const defaultDigits = 3;

    this.v = this.precision ? Math.min(this.decimals(n), defaultDigits) : this.precision;

    const base = Math.pow(10, this.v);
    this.f = Math.floor(n * base) % base;
  }

  private updateWT(f: number): void {
    if (f === 0) {
      this.t = 0;
      return;
    }

    while ((f % 10) === 0) {
      f = Math.floor(f / 10);
      this.v--;
    }

    this.t = f;
  }

  private filRule(): PluralCase {
    if (this.v == 0 && (this.i == 1 || this.i == 2 || this.i == 3) ||
      this.v == 0 && this.i % 10 != 4 && this.i % 10 != 6 && this.i % 10 != 9 ||
      this.v != 0 && this.f % 10 != 4 && this.f % 10 != 6 && this.f % 10 != 9) {
      return 'one';
    }
    return 'other';
  }

  private ptPTRule(): PluralCase {
    if (this.n == 1 && this.v == 0) {
      return 'one';
    }
    return 'other';
  }

  private brRule(): PluralCase {
    if (this.n % 10 == 1 && this.n % 100 != 11 && this.n % 100 != 71 && this.n % 100 != 91) {
      return 'one';
    }
    if (this.n % 10 == 2 && this.n % 100 != 12 && this.n % 100 != 72 && this.n % 100 != 92) {
      return 'two';
    }
    if ((this.n % 10 >= 3 && this.n % 10 <= 4 || this.n % 10 == 9) &&
      (this.n % 100 < 10 || this.n % 100 > 19) &&
      (this.n % 100 < 70 || this.n % 100 > 79) &&
      (this.n % 100 < 90 || this.n % 100 > 99)) {
      return 'few';
    }
    if (this.n != 0 && this.n % 1000000 == 0) {
      return 'many';
    }
    return 'other';
  }

  private srRule(): PluralCase {
    if (this.v == 0 && this.i % 10 == 1 && this.i % 100 != 11 ||
      this.f % 10 == 1 && this.f % 100 != 11) {
      return 'one';
    }
    if (this.v == 0 &&
      this.i % 10 >= 2 &&
      this.i % 10 <= 4 &&
      (this.i % 100 < 12 || this.i % 100 > 14) ||
      this.f % 10 >= 2 && this.f % 10 <= 4 && (this.f % 100 < 12 || this.f % 100 > 14)) {
      return 'few';
    }
    return 'other';
  }

  private roRule(): PluralCase {
    if (this.i == 1 && this.v == 0) {
      return 'one';
    }
    if (this.v != 0 || this.n == 0 || this.n != 1 && this.n % 100 >= 1 && this.n % 100 <= 19) {
      return 'few';
    }
    return 'other';
  }

  private hiRule(): PluralCase {
    if (this.i == 0 || this.n == 1) {
      return 'one';
    }
    return 'other';
  }

  private frRule(): PluralCase {
    if (this.i == 0 || this.i == 1) {
      return 'one';
    }
    return 'other';
  }

  private csRule(): PluralCase {
    if (this.i == 1 && this.v == 0) {
      return 'one';
    }
    if (this.i >= 2 && this.i <= 4 && this.v == 0) {
      return 'few';
    }
    if (this.v != 0) {
      return 'many';
    }
    return 'other';
  }

  private plRule(): PluralCase {
    if (this.i == 1 && this.v == 0) {
      return 'one';
    }
    if (this.v == 0 &&
      this.i % 10 >= 2 &&
      this.i % 10 <= 4 &&
      (this.i % 100 < 12 || this.i % 100 > 14)) {
      return 'few';
    }
    if (this.v == 0 && this.i != 1 && this.i % 10 >= 0 && this.i % 10 <= 1 ||
      this.v == 0 && this.i % 10 >= 5 && this.i % 10 <= 9 ||
      this.v == 0 && this.i % 100 >= 12 && this.i % 100 <= 14) {
      return 'many';
    }
    return 'other';
  }

  private lvRule(): PluralCase {
    if (this.n % 10 == 0 ||
      this.n % 100 >= 11 && this.n % 100 <= 19 ||
      this.v == 2 && this.f % 100 >= 11 && this.f % 100 <= 19) {
      return 'zero';
    }
    if (this.n % 10 == 1 && this.n % 100 != 11 ||
      this.v == 2 && this.f % 10 == 1 && this.f % 100 != 11 ||
      this.v != 2 && this.f % 10 == 1) {
      return 'one';
    }
    return 'other';
  }

  private heRule(): PluralCase {
    if (this.i == 1 && this.v == 0) {
      return 'one';
    }
    if (this.i == 2 && this.v == 0) {
      return 'two';
    }
    if (this.v == 0 && (this.n < 0 || this.n > 10) && this.n % 10 == 0) {
      return 'many';
    }
    return 'other';
  }

  private mtRule(): PluralCase {
    if (this.n == 1) {
      return 'one';
    }
    if (this.n == 0 || this.n % 100 >= 2 && this.n % 100 <= 10) {
      return 'few';
    }
    if (this.n % 100 >= 11 && this.n % 100 <= 19) {
      return 'many';
    }
    return 'other';
  }

  private siRule(): PluralCase {
    if ((this.n == 0 || this.n == 1) || this.i == 0 && this.f == 1) {
      return 'one';
    }
    return 'other';
  }

  private cyRule(): PluralCase {
    if (this.n == 0) {
      return 'zero';
    }
    if (this.n == 1) {
      return 'one';
    }
    if (this.n == 2) {
      return 'two';
    }
    if (this.n == 3) {
      return 'few';
    }
    if (this.n == 6) {
      return 'many';
    }
    return 'other';
  }

  private daRule(): PluralCase {
    if (this.n == 1 || this.t != 0 && (this.i == 0 || this.i == 1)) {
      return 'one';
    }
    return 'other';
  }

  private ruRule(): PluralCase {
    if (this.v == 0 && this.i % 10 == 1 && this.i % 100 != 11) {
      return 'one';
    }
    if (this.v == 0 &&
      this.i % 10 >= 2 &&
      this.i % 10 <= 4 &&
      (this.i % 100 < 12 || this.i % 100 > 14)) {
      return 'few';
    }
    if (this.v == 0 && this.i % 10 == 0 ||
      this.v == 0 && this.i % 10 >= 5 && this.i % 10 <= 9 ||
      this.v == 0 && this.i % 100 >= 11 && this.i % 100 <= 14) {
      return 'many';
    }
    return 'other';
  }

  private beRule(): PluralCase {
    if (this.n % 10 == 1 && this.n % 100 != 11) {
      return 'one';
    }
    if (this.n % 10 >= 2 && this.n % 10 <= 4 && (this.n % 100 < 12 || this.n % 100 > 14)) {
      return 'few';
    }
    if (this.n % 10 == 0 ||
      this.n % 10 >= 5 && this.n % 10 <= 9 ||
      this.n % 100 >= 11 && this.n % 100 <= 14) {
      return 'many';
    }
    return 'other';
  }

  private mkRule(): PluralCase {
    if (this.v == 0 && this.i % 10 == 1 || this.f % 10 == 1) {
      return 'one';
    }
    return 'other';
  }

  private gaRule(): PluralCase {
    if (this.n == 1) {
      return 'one';
    }
    if (this.n == 2) {
      return 'two';
    }
    if (this.n >= 3 && this.n <= 6) {
      return 'few';
    }
    if (this.n >= 7 && this.n <= 10) {
      return 'many';
    }
    return 'other';
  }

  private ptRule(): PluralCase {
    if (this.n >= 0 && this.n <= 2 && this.n != 2) {
      return 'one';
    }
    return 'other';
  }

  private esRule(): PluralCase {
    if (this.n == 1) {
      return 'one';
    }
    return 'other';
  }

  private isRule(): PluralCase {
    if (this.t == 0 && this.i % 10 == 1 && this.i % 100 != 11 || this.t != 0) {
      return 'one';
    }
    return 'other';
  }

  private arRule(): PluralCase {
    if (this.n == 0) {
      return 'zero';
    }
    if (this.n == 1) {
      return 'one';
    }
    if (this.n == 2) {
      return 'two';
    }
    if (this.n % 100 >= 3 && this.n % 100 <= 10) {
      return 'few';
    }
    if (this.n % 100 >= 11 && this.n % 100 <= 99) {
      return 'many';
    }
    return 'other';
  }

  private slRule(): PluralCase {
    if (this.v == 0 && this.i % 100 == 1) {
      return 'one';
    }
    if (this.v == 0 && this.i % 100 == 2) {
      return 'two';
    }
    if (this.v == 0 && this.i % 100 >= 3 && this.i % 100 <= 4 || this.v != 0) {
      return 'few';
    }
    return 'other';
  }

  private ltRule(): PluralCase {
    if (this.n % 10 == 1 && (this.n % 100 < 11 || this.n % 100 > 19)) {
      return 'one';
    }
    if (this.n % 10 >= 2 && this.n % 10 <= 9 && (this.n % 100 < 11 || this.n % 100 > 19)) {
      return 'few';
    }
    if (this.f != 0) {
      return 'many';
    }
    return 'other';
  }

  private enRule(): PluralCase {
    if (this.i == 1 && this.v == 0) {
      return 'one';
    }
    return 'other';
  }

  private akRule(): PluralCase {
    if (this.n >= 0 && this.n <= 1) {
      return 'one';
    }
    return 'other';
  }

  private defaultRule(): PluralCase {
    return 'other';
  }

  private readonly pluralRules: { [key: string]: () => PluralCase; } = {
    'af': this.esRule,
    'am': this.hiRule,
    'ar': this.arRule,
    'az': this.esRule,
    'be': this.beRule,
    'bg': this.esRule,
    'bn': this.hiRule,
    'br': this.brRule,
    'bs': this.srRule,
    'ca': this.enRule,
    'chr': this.esRule,
    'cs': this.csRule,
    'cy': this.cyRule,
    'da': this.daRule,
    'de': this.enRule,
    'de-AT': this.enRule,
    'de-CH': this.enRule,
    'el': this.esRule,
    'en': this.enRule,
    'en-AU': this.enRule,
    'en-CA': this.enRule,
    'en-GB': this.enRule,
    'en-IE': this.enRule,
    'en-IN': this.enRule,
    'en-SG': this.enRule,
    'en-US': this.enRule,
    'en-ZA': this.enRule,
    'es': this.esRule,
    'es-ES': this.esRule,
    'es-MX': this.esRule,
    'es-US': this.esRule,
    'et': this.enRule,
    'eu': this.esRule,
    'fa': this.hiRule,
    'fi': this.enRule,
    'fil': this.filRule,
    'fr': this.frRule,
    'fr-CA': this.frRule,
    'ga': this.gaRule,
    'gl': this.enRule,
    'gsw': this.esRule,
    'gu': this.hiRule,
    'haw': this.esRule,
    'he': this.heRule,
    'hi': this.hiRule,
    'hr': this.srRule,
    'hu': this.esRule,
    'hy': this.frRule,
    'id': this.defaultRule,
    'in': this.defaultRule,
    'is': this.isRule,
    'it': this.enRule,
    'iw': this.heRule,
    'ja': this.defaultRule,
    'ka': this.esRule,
    'kk': this.esRule,
    'km': this.defaultRule,
    'kn': this.hiRule,
    'ko': this.defaultRule,
    'ky': this.esRule,
    'ln': this.akRule,
    'lo': this.defaultRule,
    'lt': this.ltRule,
    'lv': this.lvRule,
    'mk': this.mkRule,
    'ml': this.esRule,
    'mn': this.esRule,
    'mo': this.roRule,
    'mr': this.hiRule,
    'ms': this.defaultRule,
    'mt': this.mtRule,
    'my': this.defaultRule,
    'nb': this.esRule,
    'ne': this.esRule,
    'nl': this.enRule,
    'no': this.esRule,
    'no-NO': this.esRule,
    'or': this.esRule,
    'pa': this.akRule,
    'pl': this.plRule,
    'pt': this.ptRule,
    'pt-BR': this.ptRule,
    'pt-PT': this.ptPTRule,
    'ro': this.roRule,
    'ru': this.ruRule,
    'sh': this.srRule,
    'si': this.siRule,
    'sk': this.csRule,
    'sl': this.slRule,
    'sq': this.esRule,
    'sr': this.srRule,
    'sv': this.enRule,
    'sw': this.enRule,
    'ta': this.esRule,
    'te': this.esRule,
    'th': this.defaultRule,
    'tl': this.filRule,
    'tr': this.esRule,
    'uk': this.ruRule,
    'ur': this.enRule,
    'uz': this.esRule,
    'vi': this.defaultRule,
    'zh': this.defaultRule,
    'zh-CN': this.defaultRule,
    'zh-HK': this.defaultRule,
    'zh-TW': this.defaultRule,
    'zu': this.hiRule
  };

  public getPluralCase(locale: string): PluralCase {
    const match = locale != null ? cultureRegex.exec(locale) : null;
    if (match != null) {
      const fn = this.pluralRules[match.input] ?? this.pluralRules[lodash.compact([match[1], match[2]]).join('-')] ?? this.pluralRules[match[1]];
      if (fn != null) {
        return fn.bind(this)() ?? this.defaultRule() ?? 'other';
      }
    }

    return this.defaultRule() ?? 'other';
  }
}

