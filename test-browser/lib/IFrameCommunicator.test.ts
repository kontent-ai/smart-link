import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IFrameCommunicator } from "../../src/lib/IFrameCommunicator";
import { IFrameMessageType } from "../../src/lib/IFrameCommunicatorTypes";
import {
  defaultConfiguration,
  getWebSpotlightOrigin,
  type KSLConfiguration,
} from "../../src/utils/configuration";

// Pretend we are always inside an iframe; see the mock module for details.
vi.mock("../../src/utils/iframe", () => import("../test-helpers/mocks/iframe"));

const trustedOrigin = "https://app.kontent.ai";

const dispatchMessage = (init: MessageEventInit) => {
  window.dispatchEvent(new MessageEvent("message", init));
};

describe("configuration.getWebSpotlightOrigin", () => {
  it("derives the origin from the default baseUrl", () => {
    expect(getWebSpotlightOrigin({ ...defaultConfiguration })).toBe("https://app.kontent.ai");
  });

  it("derives the origin from a custom baseUrl", () => {
    expect(
      getWebSpotlightOrigin({ ...defaultConfiguration, baseUrl: "devkontentmasters.com" }),
    ).toBe("https://app.devkontentmasters.com");
  });

  it("prefers an explicitly configured webSpotlightOrigin", () => {
    expect(
      getWebSpotlightOrigin({
        ...defaultConfiguration,
        webSpotlightOrigin: "https://wrapper.example.com",
      }),
    ).toBe("https://wrapper.example.com");
  });
});

describe("IFrameCommunicator", () => {
  let communicator: IFrameCommunicator;
  let configuration: KSLConfiguration;

  beforeEach(() => {
    configuration = { ...defaultConfiguration };
    communicator = new IFrameCommunicator(configuration);
    communicator.initialize();
  });

  afterEach(() => {
    communicator.destroy();
    vi.restoreAllMocks();
  });

  describe("onMessage", () => {
    it("invokes listeners for messages from the trusted origin and parent window", () => {
      const handler = vi.fn();
      communicator.addMessageListener(IFrameMessageType.UpdatePreview, handler);

      dispatchMessage({
        origin: trustedOrigin,
        source: window.parent,
        data: { type: IFrameMessageType.UpdatePreview, data: { updated: true } },
      });

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("ignores messages from an untrusted origin", () => {
      const handler = vi.fn();
      communicator.addMessageListener(IFrameMessageType.UpdatePreview, handler);

      dispatchMessage({
        origin: "https://evil.example.com",
        source: window.parent,
        data: { type: IFrameMessageType.UpdatePreview, data: { updated: true } },
      });

      expect(handler).not.toHaveBeenCalled();
    });

    it("ignores messages that do not originate from the parent window", () => {
      const handler = vi.fn();
      communicator.addMessageListener(IFrameMessageType.UpdatePreview, handler);

      dispatchMessage({
        origin: trustedOrigin,
        source: null,
        data: { type: IFrameMessageType.UpdatePreview, data: { updated: true } },
      });

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe("sendMessage", () => {
    it("targets the trusted origin", () => {
      const postMessage = vi
        .spyOn(window.parent, "postMessage")
        .mockImplementation(() => undefined);

      communicator.sendMessage(IFrameMessageType.PreviewIFrameCurrentUrlResponse, {
        previewUrl: "https://preview.example.com",
      });

      expect(postMessage).toHaveBeenCalledWith(expect.anything(), trustedOrigin);
    });

    it("targets a configured webSpotlightOrigin (nested iframe relay)", () => {
      const wrapperOrigin = "https://wrapper.example.com";
      const nested = new IFrameCommunicator({
        ...defaultConfiguration,
        webSpotlightOrigin: wrapperOrigin,
      });
      const postMessage = vi
        .spyOn(window.parent, "postMessage")
        .mockImplementation(() => undefined);

      nested.sendMessage(IFrameMessageType.PreviewIFrameCurrentUrlResponse, {
        previewUrl: "https://preview.example.com",
      });

      expect(postMessage).toHaveBeenCalledWith(expect.anything(), wrapperOrigin);
      nested.destroy();
    });
  });
});
