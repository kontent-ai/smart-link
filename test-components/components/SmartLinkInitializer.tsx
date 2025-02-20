import { PropsWithChildren, useEffect } from 'react';
import { KontentSmartLink } from '../../es';
import { DefaultSdkConfigurationWithoutWs } from './config';
import React from 'react';

export const SmartLinkInitializer: React.FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    const plugin = KontentSmartLink.initialize(DefaultSdkConfigurationWithoutWs);

    return () => {
      plugin.destroy();
    };
  }, []);

  return <>{children}</>;
};
