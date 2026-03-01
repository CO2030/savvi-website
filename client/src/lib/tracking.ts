export interface TrackingData {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrerUrl?: string;
  landingPage?: string;
  deviceType?: string;
  browserName?: string;
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

function getBrowserName(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Browser';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Other';
}

export function getTrackingData(): TrackingData {
  const params = new URLSearchParams(window.location.search);

  return {
    utmSource: params.get('utm_source') || params.get('source') || params.get('ref') || undefined,
    utmMedium: params.get('utm_medium') || params.get('medium') || undefined,
    utmCampaign: params.get('utm_campaign') || params.get('campaign') || undefined,
    utmContent: params.get('utm_content') || undefined,
    utmTerm: params.get('utm_term') || undefined,
    referrerUrl: document.referrer || undefined,
    landingPage: window.location.pathname,
    deviceType: getDeviceType(),
    browserName: getBrowserName(),
  };
}
