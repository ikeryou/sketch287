import { Power0,Power1,Power2,Power3,Expo,gsap } from 'gsap';

export class Tween {
  private static _instance: Tween;

  static EaseNone:any = Power0.easeNone

  static Power1EaseIn:any = Power1.easeIn
  static Power1EaseOut:any = Power1.easeOut
  static Power1EaseInOut:any = Power1.easeInOut

  static Power2EaseIn:any = Power2.easeIn
  static Power2EaseOut:any = Power2.easeOut
  static Power2EaseInOut:any = Power2.easeInOut

  static Power3EaseIn:any = Power3.easeIn
  static Power3EaseOut:any = Power3.easeOut
  static Power3EaseInOut:any = Power3.easeInOut

  static ExpoEaseIn:any = Expo.easeIn
  static ExpoEaseOut:any = Expo.easeOut
  static ExpoEaseInOut:any = Expo.easeInOut

  constructor() {}

  public static get instance(): Tween {
    if (!this._instance) {
      this._instance = new Tween();
    }
    return this._instance;
  }

  a(
    target: any,
    param: any,
    duration: number = 1,
    delay: number = 0,
    easing: any = undefined,
    onStart: any = undefined,
    onUpdate: any = undefined,
    onComplete: any = undefined
  ): void {
    gsap.killTweensOf(target);

    let from:any = {};
    let to:any = {};

    for (var key in param) {
      const val = param[key];
      if (val[0] != undefined && val[0] != null) {
        from[key] = val[0];
        to[key] = val[1];
      } else {
        to[key] = val;
      }
    }

    gsap.set(target, from);

    if (easing == undefined) {
      easing = Power0.easeNone;
    }
    to['ease'] = easing;

    to['duration'] = duration;
    to['delay'] = delay;

    if (onStart != undefined) {
      to['onStart'] = onStart;
    }

    if (onUpdate != undefined) {
      to['onUpdate'] = onUpdate;
    }

    if (onComplete != undefined) {
      to['onComplete'] = onComplete;
    }

    gsap.to(target, to);
  }

  set(target: any, to: any): void {
    gsap.set(target, to);
  }

  kill(target: any): void {
    gsap.killTweensOf(target);
  }
}
