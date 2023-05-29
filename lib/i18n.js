const i18n = require("../i18n");
const config = require("../config");

class I18n {
  constructor() {
    this.lang = config.DEFAULT_LANG;
  }

  textTranslate(text, lang) {
    let arr = text.split(".");
    let val = i18n[lang][arr[0]];

    for (let i = 1; i < arr.length; i++) {
      val = val[arr[i]];
    }

    val = val + "";
    return val;
  }
  paramsTranslate(param, lang) {
    let arr2 = param.split(".");
    let val2 = i18n[lang][arr2[0]];

    for (let i = 1; i < arr2.length; i++) {
      val2 = val2[arr2[i]];
    }
    val2 = val2 + "";
    return val2;
  }

  translate(text, lang = this.lang, params = []) {
    
    let val = this.textTranslate(text, lang);

    for (let i = 0; i < params.length; i++) {
      val = val.replace("{}", this.paramsTranslate(params[i], lang));
    }

    return val || "";
  }
}

module.exports = I18n;
