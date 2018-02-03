export class UserSettings {
  public language: string;
  public currency: string;
  public darkMode: boolean;
  public notification: boolean;

  constructor() {}

  public static defaults(): UserSettings {
    const settings = new UserSettings();
    settings.language = 'en';
    settings.currency = 'usd';
    settings.darkMode = false;
    settings.notification = false;

    return settings;
  }

}
