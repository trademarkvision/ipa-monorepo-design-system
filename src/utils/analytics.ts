declare const ga: any;
declare const gtag: any;

export class Analytics {

  static enableAnalytics: boolean = true;
  static gaLabel = (<any>window).GA_LABEL || 'V1';

  static recordGtagEvent(page: string, event: string, value?: string, otherOptions: any = {'send_to': 'local'}) {
    if ((typeof gtag !== 'undefined') && Analytics.enableAnalytics) {
      gtag('event', event, {
        'event_category': page,
        'event_label': Analytics.gaLabel,
        'value': value,
        ...otherOptions
      });
    }
  }

  static recordEvent(page: string | null | undefined, event: string | null | undefined) {
    if ((typeof ga !== 'undefined') && Analytics.enableAnalytics) {
      ga('send', 'event', page, event, Analytics.gaLabel);
    }
  }

  static trackPageView(to: any) {
    if ((typeof ga !== 'undefined') && Analytics.enableAnalytics) {
      ga('set', 'page', to.path);
      ga('send', 'pageview');
      ga('globalTracker.set', 'page', to.path);
      ga('globalTracker.send', 'pageview');
    }
  }

  static setAnalyticsUserId(userId: any) {
    if ((typeof ga !== 'undefined') && Analytics.enableAnalytics && userId) {
      ga('set', 'userId', userId);
      ga('globalTracker.set', 'userId', userId);
    }
  }
}
