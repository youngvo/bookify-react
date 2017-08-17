var Helper = {
  localeToHostName: {
    en_US: "http://master.eng.blurb.com",
    es_US: "http://master-la.eng.blurb.com",
    en_AU: "http://master-au.eng.blurb.com",
    pt_BR: "http://master-br.eng.blurb.com",
    it_IT: "http://master-it.eng.blurb.com",
    nl_NL: "http://master-nl.eng.blurb.com",
    en_GB: "http://master.eng.blurb.co.uk",
    fr_FR: "http://master.eng.blurb.fr",
    de_DE: "http://master.eng.blurb.de",
    es_ES: "http://master.eng.blurb.es",
    en_CA: "http://master.eng.blurb.ca",
    fr_CA: "http://master-fr.eng.blurb.ca"
  },

  user: "dev_syp",
  password: "123456",
  getLocaleBaseUrl: function(locale) {
    return Helper.localeToHostName[locale];
  },
  getAllLocaleBaseUrls: function() {
    return Object.keys(Helper.localeToHostname).map(Helper.getLocaleBaseUrl);
  }
};

module.exports = Helper;
