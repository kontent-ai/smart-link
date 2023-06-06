import { KSLConfiguration } from '../models/configuration/KSLConfiguration';

export interface IConfigurationService {
  readonly get: () => KSLConfiguration;
  readonly update: (configuration: Partial<KSLConfiguration>) => void;
}
