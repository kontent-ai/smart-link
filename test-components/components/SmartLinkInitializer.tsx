import { type PropsWithChildren, useEffect } from "react";
import KontentSmartLink from "../../src";
import type { SdkConfiguration } from "./config";

type SmartLinkInitializerProps = PropsWithChildren<{
  configuration: SdkConfiguration;
}>;

export const SmartLinkInitializer: React.FC<SmartLinkInitializerProps> = ({
  children,
  configuration,
}) => {
  useEffect(() => {
    const plugin = KontentSmartLink.initialize(configuration);

    return () => {
      plugin.destroy();
    };
  }, [configuration]);

  return <div style={{ padding: "1rem" }}>{children}</div>;
};
