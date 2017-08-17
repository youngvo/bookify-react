import LocationUtils from './../../utils/LocationUtils';

describe("LocationUtils utility functions", () => {
  let locationUtils = LocationUtils.instance;
  locationUtils.hostname = 'master.eng.blurb.com';
  locationUtils.pathname = '/bookify-react/';
  locationUtils.urlparams = '?starterbook=square_elegant';
  it ('retrieves location parameters', () => {
    expect(locationUtils.subdomain()).toBe('master');
    expect(locationUtils.baseSubdomain()).toBe('master');
    expect(locationUtils.isProductionDomain()).toBe(false);
    expect(locationUtils.isEngDomain()).toBe(true);
    expect(locationUtils.isAutomation()).toBe(false);
    expect(locationUtils.subdomainSuffix()).toBe('');
    expect(locationUtils.domainSuffix()).toBe('com');
    expect(locationUtils.localeDomainPrefix()).toBe('');
    expect(locationUtils.localeDomainSuffix()).toBe('');
    expect(locationUtils.relativePath()).toBe('/bookify-react/');
    expect(locationUtils.defaultLanguage()).toBe('en_GB');
    expect(locationUtils.assetsDomain()).toBe('master-assets0.eng.blurb.com');
  });

});
