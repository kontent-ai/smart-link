import { isInsideWebSpotlightPreviewIFrame, type KSLConfiguration } from "../utils/configuration";
import { getAugmentableDescendants, isElementAugmentable } from "../utils/customElements";
import { InvalidEnvironmentError } from "../utils/errors";
import { buildKontentElementLink, buildKontentItemLink } from "../utils/link";
import {
  validateAddInitialMessageData,
  validateEditButtonMessageData,
} from "../utils/messageValidation";
import { isElementWebComponent } from "../web-components/components";
import type {
  KSLAddButtonElementActionEvent,
  KSLAddButtonElementInitialAsyncEvent,
} from "../web-components/KSLAddButtonElement";
import type { KSLHighlightElementEvent } from "../web-components/KSLHighlightElement";
import type { IFrameCommunicator } from "./IFrameCommunicator";
import {
  AddButtonElementType,
  type IAddButtonPermissionsServerModel,
  type IClickedMessageMetadata,
  IFrameMessageType,
} from "./IFrameCommunicatorTypes";
import { logError, logWarn } from "./Logger";
import { SmartLinkRenderer } from "./SmartLinkRenderer";

export class DOMSmartLinkManager {
  private readonly mutationObserver: MutationObserver;
  private readonly intersectionObserver: IntersectionObserver;
  private readonly renderer: SmartLinkRenderer;

  private enabled = false;
  private renderingTimeoutId = 0;
  private observedElements = new Set<HTMLElement>();
  private visibleElements = new Set<HTMLElement>();

  constructor(
    private readonly iframeCommunicator: IFrameCommunicator,
    private readonly configuration: KSLConfiguration,
  ) {
    if (
      // window === undefined crashes
      typeof window === "undefined" ||
      typeof MutationObserver === "undefined" ||
      typeof IntersectionObserver === "undefined"
    ) {
      throw new InvalidEnvironmentError(
        "NodeSmartLinkProvider can only be initialized in a browser environment.",
      );
    }

    this.mutationObserver = new MutationObserver(this.onDomMutation);
    this.intersectionObserver = new IntersectionObserver(this.onElementVisibilityChange);
    this.renderer = new SmartLinkRenderer(this.configuration);
  }

  public toggle = (force?: boolean): void => {
    const shouldEnable = force ?? !this.enabled;

    if (shouldEnable) {
      this.enable();
    } else {
      this.disable();
    }
  };

  public enable = (): void => {
    if (this.enabled) {
      return;
    }

    this.startRenderingInterval();

    this.listenToGlobalEvents();
    this.observeDomMutations();
    this.enabled = true;
  };

  public disable = (): void => {
    if (!this.enabled) {
      return;
    }

    this.stopRenderingInterval();

    this.unlistenToGlobalEvents();
    this.disconnectObservers();
    this.renderer.clear();
    this.enabled = false;
  };

  public destroy = (): void => {
    this.disable();
    this.renderer.destroy();
  };

  private augmentVisibleElements = (): void => {
    requestAnimationFrame(() => {
      this.renderer.render(this.visibleElements, this.observedElements);
    });
  };

  /**
   * Start an interval rendering (1s) that will re-render highlights for all visible elements using `setInterval`.
   * It helps to adjust highlights position even in situations that are currently not supported by
   * the SDK (e.g. element position change w/o animations, some infinite animations and other possible unhandled cases)
   * for better user experience.
   */
  private startRenderingInterval = (): void => {
    this.renderingTimeoutId = window.setInterval(this.augmentVisibleElements, 1000);
  };

  private stopRenderingInterval = (): void => {
    if (this.renderingTimeoutId) {
      clearInterval(this.renderingTimeoutId);
      this.renderingTimeoutId = 0;
    }
  };

  private listenToGlobalEvents = (): void => {
    window.addEventListener("ksl:add-button:initial", this.onAddInitialClick, { capture: true });
    window.addEventListener("ksl:add-button:action", this.onAddActionClick, { capture: true });
    window.addEventListener("ksl:highlight:edit", this.onEditElement, { capture: true });
  };

  private unlistenToGlobalEvents = (): void => {
    window.removeEventListener("ksl:add-button:initial", this.onAddInitialClick, { capture: true });
    window.removeEventListener("ksl:add-button:action", this.onAddActionClick, { capture: true });
    window.removeEventListener("ksl:highlight:edit", this.onEditElement, { capture: true });
  };

  private observeDomMutations = (): void => {
    if (this.enabled) {
      return;
    }

    this.mutationObserver.observe(window.document.body, {
      childList: true,
      subtree: true,
    });

    getAugmentableDescendants(document, this.configuration).forEach((element: Element) => {
      if (element instanceof HTMLElement) {
        this.observeElementVisibility(element);
      }
    });
  };

  private disconnectObservers = (): void => {
    this.mutationObserver.disconnect();
    this.intersectionObserver.disconnect();

    this.observedElements.forEach((element: HTMLElement) => {
      this.unobserveElementVisibility(element);
    });

    this.observedElements = new Set<HTMLElement>();
    this.visibleElements = new Set<HTMLElement>();
  };

  private observeElementVisibility = (element: HTMLElement): void => {
    if (this.observedElements.has(element)) {
      return;
    }

    this.intersectionObserver.observe(element);
    this.observedElements.add(element);
  };

  private unobserveElementVisibility = (element: HTMLElement): void => {
    if (!this.observedElements.has(element)) {
      return;
    }

    this.intersectionObserver.unobserve(element);
    this.observedElements.delete(element);
    this.visibleElements.delete(element);
  };

  private onDomMutation = (mutations: MutationRecord[]): void => {
    const relevantMutations = mutations.filter(isRelevantMutation);

    for (const mutation of relevantMutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) {
          continue;
        }

        if (isElementAugmentable(node, this.configuration)) {
          this.observeElementVisibility(node);
        }

        for (const element of getAugmentableDescendants(node, this.configuration)) {
          if (!(element instanceof HTMLElement)) {
            continue;
          }

          this.observeElementVisibility(element);
        }
      }

      for (const node of mutation.removedNodes) {
        if (!(node instanceof HTMLElement)) {
          continue;
        }

        if (isElementAugmentable(node, this.configuration)) {
          this.unobserveElementVisibility(node);
        }

        for (const element of getAugmentableDescendants(node, this.configuration)) {
          if (!(element instanceof HTMLElement)) {
            continue;
          }

          this.unobserveElementVisibility(element);
        }
      }
    }

    if (relevantMutations.length > 0) {
      this.augmentVisibleElements();
    }
  };

  private onElementVisibilityChange = (entries: IntersectionObserverEntry[]): void => {
    const filteredEntries = entries.filter((entry) => entry.target instanceof HTMLElement);

    for (const entry of filteredEntries) {
      const target = entry.target as HTMLElement;
      if (entry.isIntersecting) {
        this.visibleElements.add(target);
      } else {
        this.visibleElements.delete(target);
      }
    }

    if (filteredEntries.length > 0) {
      this.augmentVisibleElements();
    }
  };

  private onEditElement = (event: KSLHighlightElementEvent): void => {
    const isInsideWebSpotlight = isInsideWebSpotlightPreviewIFrame(this.configuration);
    const { data, targetNode } = event.detail;

    const messageMetadata: IClickedMessageMetadata = {
      elementRect: targetNode.getBoundingClientRect(),
    };

    const validationResult = validateEditButtonMessageData(data, this.configuration);

    if (validationResult.type === "error") {
      logError(
        `Required attribute was not found: ${validationResult.missing[0]}. Skipped parsing these attributes: ${validationResult.missing.slice(1).join(", ")}`,
      );
      logError("Debug info: ", validationResult.debug);
      logError("Skipping edit button click");
      return;
    }

    if (validationResult.type === "element") {
      if (isInsideWebSpotlight) {
        this.iframeCommunicator.sendMessage(
          IFrameMessageType.ElementClicked,
          validationResult.data,
          messageMetadata,
        );
      } else {
        const link = buildKontentElementLink({
          environmentId: validationResult.data.projectId,
          languageCodename: validationResult.data.languageCodename,
          itemId: validationResult.data.itemId,
          elementCodename: validationResult.data.elementCodename,
        });
        window.open(link, "_blank");
      }
    } else if (validationResult.type === "contentComponent") {
      if (isInsideWebSpotlight) {
        this.iframeCommunicator.sendMessage(
          IFrameMessageType.ContentComponentClicked,
          validationResult.data,
          messageMetadata,
        );
      } else {
        logWarn("Edit buttons for content components are only functional inside Web Spotlight.");
      }
    } else if (isInsideWebSpotlight) {
      this.iframeCommunicator.sendMessage(
        IFrameMessageType.ContentItemClicked,
        validationResult.data,
        messageMetadata,
      );
    } else {
      const link = buildKontentItemLink({
        environmentId: validationResult.data.projectId,
        languageCodename: validationResult.data.languageCodename,
        itemId: validationResult.data.itemId,
      });
      window.open(link, "_blank");
    }
  };

  private onAddInitialClick = (event: KSLAddButtonElementInitialAsyncEvent): void => {
    const isInsideWebSpotlight = isInsideWebSpotlightPreviewIFrame(this.configuration);
    const { eventData, onResolve, onReject } = event.detail;
    const { data, targetNode } = eventData;

    const messageMetadata: IClickedMessageMetadata = {
      elementRect: targetNode.getBoundingClientRect(),
    };

    console.log("data", data);

    const messageDataValidation = validateAddInitialMessageData(data, this.configuration);

    if (!messageDataValidation.success) {
      const [first, ...rest] = messageDataValidation.missing;
      onReject({
        message: `Could not find required data attribute: '${first}'.${
          rest.length > 0
            ? ` All attributes higher in hierarchy were never searched for: [${rest.join(", ")}]`
            : ""
        }`,
      });
      return;
    }

    if (!isInsideWebSpotlight) {
      onReject({ message: "Add buttons are only functional inside Web Spotlight" });
      return;
    }

    this.iframeCommunicator.sendMessageWithResponse(
      IFrameMessageType.AddInitial,
      messageDataValidation.data,
      (response?: IAddButtonPermissionsServerModel) => {
        if (!response || response.elementType === AddButtonElementType.Unknown) {
          console.log("response", JSON.stringify(response));
          return onReject({ message: "Something went wrong" });
        }

        return onResolve(response);
      },
      messageMetadata,
    );
  };

  private onAddActionClick = (event: KSLAddButtonElementActionEvent): void => {
    const isInsideWebSpotlight = isInsideWebSpotlightPreviewIFrame(this.configuration);
    const { data, targetNode } = event.detail;

    const messageMetadata: IClickedMessageMetadata = {
      elementRect: targetNode.getBoundingClientRect(),
    };

    const messageDataValidation = validateAddInitialMessageData(data, this.configuration);

    if (!messageDataValidation.success) {
      return;
    }

    if (!isInsideWebSpotlight) {
      logWarn("Add buttons are only functional inside Web Spotlight.");
      return;
    }

    this.iframeCommunicator.sendMessage(
      IFrameMessageType.AddAction,
      {
        ...messageDataValidation.data,
        action: data.action,
      },
      messageMetadata,
    );
  };
}

const isRelevantMutation = (mutation: MutationRecord): boolean => {
  const isTypeRelevant = mutation.type === "childList";
  const isTargetRelevant =
    mutation.target instanceof HTMLElement && !isElementWebComponent(mutation.target);

  if (!isTypeRelevant || !isTargetRelevant) {
    return false;
  }

  const hasRelevantAddedNodes = Array.from(mutation.addedNodes).some(
    (node) => node instanceof HTMLElement && !isElementWebComponent(node),
  );
  const hasRelevantRemovedNodes = Array.from(mutation.removedNodes).some(
    (node) => node instanceof HTMLElement && !isElementWebComponent(node),
  );

  return hasRelevantAddedNodes || hasRelevantRemovedNodes;
};
