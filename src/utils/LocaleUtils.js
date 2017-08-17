import T from 'i18n-react';
import LocationUtils from './LocationUtils';

class LocalUtils {
    static instance = new LocalUtils();

    constructor() {
        if (LocalUtils.instance) {
            return LocalUtils.instance;
        }
        var language = LocationUtils.instance.defaultLanguage();
        var supportedLang = 'de_DE,en_US,es_ES,fr_FR,it_IT,nl_NL,pt_BR';
        if (supportedLang.indexOf(language) < 0) {
            language = 'en_US';
        }
        this._setLocale(language);
        return this;
    }

    setTexts(words) {
      var json = { };
      if (words) {
        this._paserText2Json(json, words);
      }
      T.setTexts(json);
    }

    _setLocale(locale) {
        var json = { };
        var words;
        try {
          let text = require(`!raw!./../assets/locale/${locale}/text.properties`);
          let formatedValue = text.replace(/<b>/g, '*');
          formatedValue = formatedValue.replace(/<\/b>/g, '*');
          formatedValue = formatedValue.replace(/<i>/g, '_');
          formatedValue = formatedValue.replace(/<\/i>/g, '_');
          formatedValue = formatedValue.replace(/<u>/g, '~');
          formatedValue = formatedValue.replace(/<\/u>/g, '~');
          words = formatedValue.split('\n');
          for (var i = 0; i < words.length; i++) {
            words[i] = words[i].replace(/\\n/g, '\r\n');
            words[i] = words[i].replace(/<br[^>]*>/gi, '\r\n');
          }
        } catch (error) {
          throw error;
        }
        if (words) {
          this._paserText2Json(json, words);
        }
        json.urls = { };
        var urls;
        try {
          urls = require(`!raw!./../assets/locale/${locale}/urls.properties`).split('\n');
        } catch (error) {
          throw error;
        }
        if (urls) {
          this._paserText2Json(json.urls, urls);
        }
        if (json) {
          T.setTexts(json);
        }
    }

    _paserText2Json(outputJson, words) {
        var arr = null;
        var key = null;
        var value = null;
        for (var i = 0; i < words.length; i++) {
            arr = words[i].split(':');
            if (arr.length >= 2 && arr[0].indexOf('#') !== 0) {
                key = arr[0].trim();
                arr.shift();
                value = arr.join(':').trim();
                this._decodeNamesToObj(outputJson, key, value);
            }
        }
    }

    _decodeNamesToObj(parentObj, names, value) {
        var arr = names.split('.');
        var name = arr[0];
        if (arr.length === 1) {
            parentObj[name] = { __: value };
            return;
        }
        if (parentObj[name] == null) {
            parentObj[name] = { };
        }
        arr.shift();
        this._decodeNamesToObj(parentObj[name], arr.join('.'), value);
    }

    translate(key, options) {
        if (key == null) {
            return null;
        }
        var result = T.translate(key + '.__' , options);
        if (result === key + '.__') {
          result = key;
        }
        return result;
    }
}

export default LocalUtils;
