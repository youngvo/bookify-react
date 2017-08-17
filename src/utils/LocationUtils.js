const COUNTRY_CODES = ['au','br','ca','de','es','fr','it','la','nl','uk'];
const LANGUAGE_BY_COUNTRY_CODE = {
  'au': 'en_US', // Australia => English
  'br': 'pt_BR', // Brazil => Portuguese
  'ca': 'en_US', // Canada => English
  'de': 'de_DE', // Germany
  'es': 'es_ES', // Spain
  'fr': 'fr_FR', // France
  'it': 'it_IT', // Italy
  'la': 'es_ES', // Latin America => Spanish
  'nl': 'nl_NL', // Netherlands (Dutch)
  'uk': 'en_GB'  // United Kingdom => English
};
const PRODUCTION_BASE_SUBDOMAINS = ['www', 'au', 'br', 'fr', 'it', 'nl', 'la'];
const BLURB_STRING = '.blurb.';

class LocationUtils {
    static instance = new LocationUtils();

    constructor() {
        if (LocationUtils.instance) {
            return LocationUtils.instance;
        }
        this.hostname = window.location.hostname;
      	this.pathname = window.location.pathname;
      	this.urlparams = window.location.search;
      	this.port = window.location.port;
        if (process.env.PUBLIC_URL.indexOf('http') === 0) {
          this.homepage = process.env.PUBLIC_URL;
          return this;
        }
        if (process.env.PUBLIC_URL.indexOf('/') === 0) {
          this.homepage = window.location.protocol + "//" + window.location.host + process.env.PUBLIC_URL;
          return this;
        }
        this.homepage = window.location.protocol + "//" + window.location.host + '/bookify-react'
        return this;
    }

    getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

    domain() {
        let dotIndex = this.hostname.indexOf('.');
        return this.hostname.substring(dotIndex + 1);
	}

    subdomain() {
        var dotIndex = this.hostname.indexOf('.');
		return this.hostname.substring(0, dotIndex);
    }

    baseSubdomain() {
        var subdomain = this.subdomain();
        var matches = subdomain.match(/^oak-([^\-]+)-/); // special case for 'oak-ct-web01', etc
    		var	dashIndex;
    		if (matches) {
    			return matches[1];
    		}
    		dashIndex = subdomain.indexOf('-');
    		if (dashIndex >= 0) {
    			subdomain = subdomain.substring(0, dashIndex);
    		}
    		return subdomain;
    }

    isProductionDomain() {
        return PRODUCTION_BASE_SUBDOMAINS.indexOf(this.baseSubdomain()) >= 0;
    }

    isEngDomain() {
        return this.hostname.indexOf('eng.blurb') >= 0;
    }

    isAutomation() {
        return !!this.urlparams.match('automation=true');
    }

    subdomainSuffix() {
        var suffix = this.subdomain();
    		var secureIndex = suffix.indexOf('-secure');
    		var dashIndex;
    		if (secureIndex >= 0) { // assume this is always the last part of the subdomain and strip it off
    			   suffix = suffix.substr(0, secureIndex);
    		}
    		dashIndex = suffix.indexOf('-');
    		if (dashIndex >= 0) {
    			   return suffix.substring(dashIndex + 1);
    		}
  			return '';
    }

    domainSuffix() {
    		var blurbIndex = this.hostname.indexOf(BLURB_STRING);
    		if (blurbIndex >= 0) {
    			   return this.hostname.substr(blurbIndex + BLURB_STRING.length);
    		}
  			return '';
    }

    localeDomainPrefix() {
        var localeDomainPrefix = this.subdomain();
    		var secureIndex = localeDomainPrefix.indexOf('-secure');
    		if (secureIndex >= 0) { // assume this is always the last part of the subdomain and strip it off
    			   localeDomainPrefix = localeDomainPrefix.substr(0, secureIndex);
    		}
    		if (localeDomainPrefix.indexOf('-') >= 0) {
    			   localeDomainPrefix = this.subdomainSuffix();
    		}
    		if (COUNTRY_CODES.indexOf(localeDomainPrefix) >= 0) {
    			   return localeDomainPrefix;
    		}
  			return '';
    }

    localeDomainSuffix() {
        var localeDomainSuffix = this.hostname.substr(this.hostname.lastIndexOf('.') + 1);
    		if (COUNTRY_CODES.indexOf(localeDomainSuffix) >= 0) {
    			   return localeDomainSuffix;
    		}
  			return '';
    }

    relativePath() {
        var slashIndex = this.pathname.lastIndexOf('/');
    		if(slashIndex >= 0) {
    			   return this.pathname.substr(0, slashIndex + 1);
    		}
    		return '/';
    }

    defaultLanguage() {
      if (this.localeDomainPrefix()) {
  			   return LANGUAGE_BY_COUNTRY_CODE[this.localeDomainPrefix()];
  		}
  		if(this.localeDomainSuffix()) {
  			   return LANGUAGE_BY_COUNTRY_CODE[this.localeDomainSuffix()];
  		}
  		return LANGUAGE_BY_COUNTRY_CODE['uk']; // default to English
    }

    assetsDomain() {
      var assetsDomain = [];
  		if (!this.isAutomation()) {
  			   assetsDomain.push(this.isProductionDomain() || this.baseSubdomain().match('assets[0-9]') ? 'assets0' : this.baseSubdomain() + '-assets0');
  		}
  		else {
  			   assetsDomain.push(this.baseSubdomain());
  		}

  		if (this.isEngDomain()) {
  			   assetsDomain.push('eng');
  		}
  		assetsDomain.push('blurb.com');
  		return assetsDomain.join('.');
    }

    gotoMyBookPage() {
      return window.open(window.location.protocol + "//" + window.location.hostname + '/my/store', '_self');
    }
}

export default LocationUtils;
