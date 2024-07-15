import * as Mixpanel from 'mixpanel';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MixpanelService {
  private mixpanel: any;

  constructor(private configService: ConfigService) {
    this.mixpanel = Mixpanel.init(this.configService.get('MIXPANEL_TOKEN'), {
      debug: true,
      // geolocate: true,
    });
  }

  public peopleSet(userId: string, action: any = {}): void {
    this.mixpanel.people.set(userId, action);
  }

  public track(eventName: string, action: any = {}): void {
    this.mixpanel.track(eventName, action);
  }

  public peopleIncrement(userId: string, action: any = {}): void {
    this.mixpanel.people.increment(userId, action);
  }
}
