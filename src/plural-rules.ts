import { PluralCase } from './easy-i18n';

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

  private fil_rule(): PluralCase {
    if (this.v == 0 && (this.i == 1 || this.i == 2 || this.i == 3) ||
      this.v == 0 && this.i % 10 != 4 && this.i % 10 != 6 && this.i % 10 != 9 ||
      this.v != 0 && this.f % 10 != 4 && this.f % 10 != 6 && this.f % 10 != 9) {
      return 'one';
    }
    return 'other';
  }

  private pt_PT_rule(): PluralCase {
    if (this.n == 1 && this.v == 0) {
      return 'one';
    }
    return 'other';
  }

  private br_rule(): PluralCase {
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

  private sr_rule(): PluralCase {
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

  private ro_rule(): PluralCase {
    if (this.i == 1 && this.v == 0) {
      return 'one';
    }
    if (this.v != 0 || this.n == 0 || this.n != 1 && this.n % 100 >= 1 && this.n % 100 <= 19) {
      return 'few';
    }
    return 'other';
  }

  private hi_rule(): PluralCase {
    if (this.i == 0 || this.n == 1) {
      return 'one';
    }
    return 'other';
  }

  private fr_rule(): PluralCase {
    if (this.i == 0 || this.i == 1) {
      return 'one';
    }
    return 'other';
  }

  private cs_rule(): PluralCase {
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

  private pl_rule(): PluralCase {
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

  private lv_rule(): PluralCase {
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

  private he_rule(): PluralCase {
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

  private mt_rule(): PluralCase {
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

  private si_rule(): PluralCase {
    if ((this.n == 0 || this.n == 1) || this.i == 0 && this.f == 1) {
      return 'one';
    }
    return 'other';
  }

  private cy_rule(): PluralCase {
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

  private da_rule(): PluralCase {
    if (this.n == 1 || this.t != 0 && (this.i == 0 || this.i == 1)) {
      return 'one';
    }
    return 'other';
  }

  private ru_rule(): PluralCase {
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

  private be_rule(): PluralCase {
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

  private mk_rule(): PluralCase {
    if (this.v == 0 && this.i % 10 == 1 || this.f % 10 == 1) {
      return 'one';
    }
    return 'other';
  }

  private ga_rule(): PluralCase {
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

  private pt_rule(): PluralCase {
    if (this.n >= 0 && this.n <= 2 && this.n != 2) {
      return 'one';
    }
    return 'other';
  }

  private es_rule(): PluralCase {
    if (this.n == 1) {
      return 'one';
    }
    return 'other';
  }

  private is_rule(): PluralCase {
    if (this.t == 0 && this.i % 10 == 1 && this.i % 100 != 11 || this.t != 0) {
      return 'one';
    }
    return 'other';
  }

  private ar_rule(): PluralCase {
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

  private sl_rule(): PluralCase {
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

  private lt_rule(): PluralCase {
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

  private en_rule(): PluralCase {
    if (this.i == 1 && this.v == 0) {
      return 'one';
    }
    return 'other';
  }

  private ak_rule(): PluralCase {
    if (this.n >= 0 && this.n <= 1) {
      return 'one';
    }
    return 'other';
  }

  private default_rule(): PluralCase {
    return 'other';
  }

  private readonly pluralRules: { [key: string]: () => PluralCase; } = {
    'af': this.es_rule,
    'am': this.hi_rule,
    'ar': this.ar_rule,
    'az': this.es_rule,
    'be': this.be_rule,
    'bg': this.es_rule,
    'bn': this.hi_rule,
    'br': this.br_rule,
    'bs': this.sr_rule,
    'ca': this.en_rule,
    'chr': this.es_rule,
    'cs': this.cs_rule,
    'cy': this.cy_rule,
    'da': this.da_rule,
    'de': this.en_rule,
    'de_AT': this.en_rule,
    'de_CH': this.en_rule,
    'el': this.es_rule,
    'en': this.en_rule,
    'en_AU': this.en_rule,
    'en_CA': this.en_rule,
    'en_GB': this.en_rule,
    'en_IE': this.en_rule,
    'en_IN': this.en_rule,
    'en_SG': this.en_rule,
    'en_US': this.en_rule,
    'en_ZA': this.en_rule,
    'es': this.es_rule,
    'es_419': this.es_rule,
    'es_ES': this.es_rule,
    'es_MX': this.es_rule,
    'es_US': this.es_rule,
    'et': this.en_rule,
    'eu': this.es_rule,
    'fa': this.hi_rule,
    'fi': this.en_rule,
    'fil': this.fil_rule,
    'fr': this.fr_rule,
    'fr_CA': this.fr_rule,
    'ga': this.ga_rule,
    'gl': this.en_rule,
    'gsw': this.es_rule,
    'gu': this.hi_rule,
    'haw': this.es_rule,
    'he': this.he_rule,
    'hi': this.hi_rule,
    'hr': this.sr_rule,
    'hu': this.es_rule,
    'hy': this.fr_rule,
    'id': this.default_rule,
    'in': this.default_rule,
    'is': this.is_rule,
    'it': this.en_rule,
    'iw': this.he_rule,
    'ja': this.default_rule,
    'ka': this.es_rule,
    'kk': this.es_rule,
    'km': this.default_rule,
    'kn': this.hi_rule,
    'ko': this.default_rule,
    'ky': this.es_rule,
    'ln': this.ak_rule,
    'lo': this.default_rule,
    'lt': this.lt_rule,
    'lv': this.lv_rule,
    'mk': this.mk_rule,
    'ml': this.es_rule,
    'mn': this.es_rule,
    'mo': this.ro_rule,
    'mr': this.hi_rule,
    'ms': this.default_rule,
    'mt': this.mt_rule,
    'my': this.default_rule,
    'nb': this.es_rule,
    'ne': this.es_rule,
    'nl': this.en_rule,
    'no': this.es_rule,
    'no_NO': this.es_rule,
    'or': this.es_rule,
    'pa': this.ak_rule,
    'pl': this.pl_rule,
    'pt': this.pt_rule,
    'pt_BR': this.pt_rule,
    'pt_PT': this.pt_PT_rule,
    'ro': this.ro_rule,
    'ru': this.ru_rule,
    'sh': this.sr_rule,
    'si': this.si_rule,
    'sk': this.cs_rule,
    'sl': this.sl_rule,
    'sq': this.es_rule,
    'sr': this.sr_rule,
    'sr_Latn': this.sr_rule,
    'sv': this.en_rule,
    'sw': this.en_rule,
    'ta': this.es_rule,
    'te': this.es_rule,
    'th': this.default_rule,
    'tl': this.fil_rule,
    'tr': this.es_rule,
    'uk': this.ru_rule,
    'ur': this.en_rule,
    'uz': this.es_rule,
    'vi': this.default_rule,
    'zh': this.default_rule,
    'zh_CN': this.default_rule,
    'zh_HK': this.default_rule,
    'zh_TW': this.default_rule,
    'zu': this.hi_rule,
    'default': this.default_rule
  };

  public getPluralCase(local: string): PluralCase {
    return this.pluralRules[local]?.bind(this)() ?? 'other';
  }
}

