import { PropsWithChildren, useEffect } from 'react';
import { KontentSmartLink } from '../../es';
import { SdkConfiguration } from './config';
import React from 'react';

type SmartLinkInitializerProps = PropsWithChildren<{
  configuration: SdkConfiguration;
}>;

export const SmartLinkInitializer: React.FC<SmartLinkInitializerProps> = ({ children, configuration }) => {
  useEffect(() => {
    const plugin = KontentSmartLink.initialize(configuration);

    return () => {
      plugin.destroy();
    };
  }, []);

  return <div style={{ padding: '1rem' }}>{children}</div>;
};
