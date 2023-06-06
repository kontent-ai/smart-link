import { IConfigurationService } from './IConfigurationService';
import { defaultConfiguration, KSLConfiguration } from '../models/configuration/KSLConfiguration';

export class ConfigurationService implements IConfigurationService {
  private configuration: KSLConfiguration = defaultConfiguration;

  public get(): KSLConfiguration {
    return this.configuration;
  }

  public update(configuration: Partial<KSLConfiguration>): void {
    this.configuration = { ...this.configuration, ...configuration };
  }
}
