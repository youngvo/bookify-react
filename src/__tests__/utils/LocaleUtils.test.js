import LocaleUtils from './../../utils/LocaleUtils';

describe('Locale translate', () => {
  var localeUtils = LocaleUtils.instance;
  var text = 'import.select:Select:\n import.select.all:all\n import.select.none:none\n statusView.lastSavedAt:Saved at {0}';
  var words = text.split('\n');
  localeUtils.setTexts(words);
  it ('loads plain string', () => {
    expect(localeUtils.translate('import.select')).toBe('Select:');
    expect(localeUtils.translate('import.select.all')).toBe('all');
    expect(localeUtils.translate('import.select.none')).toBe('none');
  });

  it ('can reference keys with params', () => {
    expect(localeUtils.translate('statusView.lastSavedAt', {'0': '12:58'})).toBe('Saved at 12:58');
  });

});
