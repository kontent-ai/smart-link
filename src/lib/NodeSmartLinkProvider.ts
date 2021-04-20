import { isElementWebComponent } from '../web-components/components';
import {
  IClickedMessageMetadata,
  IElementClickedMessageData,
  IFrameMessageType,
  IPlusActionMessageData,
  IPlusButtonPermissionsServerModel,
  IPlusRequestMessageData,
  PlusButtonElementType,
} from './IFrameCommunicatorTypes';
import { IRenderer, SmartLinkRenderer } from './SmartLinkRenderer';
import { KSLHighlightElementEvent } from '../web-components/KSLHighlightElement';
import { getAugmentableDescendants, isElementAugmentable } from '../utils/customElements';
import {
  KSLPlusButtonElementActionEvent,
  KSLPlusButtonElementRequestAsyncEvent,
} from '../web-components/KSLPlusButtonElement';
import { IFrameCommunicator } from './IFrameCommunicator';
import {
  validateContentItemClickEditMessageData,
  validateElementClickMessageData,
  validatePlusActionMessageData,
  validatePlusRequestMessageData,
} from '../utils/validation';
import { isInsideIFrame } from '../utils/iframe';
import { DeepPartial } from '../utils/dataAttributes';
import { IConfigurationManager } from './ConfigurationManager';
import { buildKontentLink } from '../utils/link';
import { Logger } from './Logger';

export class NodeSmartLinkProvider {
  private readonly mutationObserver: MutationObserver;
  private readonly intersectionObserver: IntersectionObserver;
  private readonly renderer: IRenderer;

  private enabled = false;
  private renderingTimeoutId = 0;
  private observedElements = new Set<HTMLElement>();
  private visibleElements = new Set<HTMLElement>();

  constructor(
    private readonly iframeCommunicator: IFrameCommunicator,
    private readonly configurationManager: IConfigurationManager
  ) {
    this.mutationObserver = new MutationObserver(this.onDomMutation);
    this.intersectionObserver = new IntersectionObserver(this.onElementVisibilityChange);
    this.renderer = new SmartLinkRenderer();
  }

  public toggle = (force?: boolean): void => {
    const shouldEnable = typeof force !== 'undefined' ? force : !this.enabled;

    if (shouldEnable) {
      this.enable();
    } else {
      this.disable();
    }
  };

  public enable = (): void => {
    if (this.enabled) return;

    this.startRenderingInterval();

    this.listenToGlobalEvents();
    this.observeDomMutations();
    this.enabled = true;
  };

  public disable = (): void => {
    if (!this.enabled) return;

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
   * Start an interval rendering (1s) that will re-render highlights for all visible elements using `setTimeout`.
   * It helps to adjust highlights position even in situations that are currently not supported by
   * the SDK (e.g. element position change w/o animations, some infinite animations and other possible unhandled cases)
   * for better user experience.
   */
  private startRenderingInterval = (): void => {
    this.augmentVisibleElements();
    this.renderingTimeoutId = window.setTimeout(this.startRenderingInterval, 1000);
  };

  private stopRenderingInterval = (): void => {
    if (this.renderingTimeoutId) {
      clearTimeout(this.renderingTimeoutId);
      this.renderingTimeoutId = 0;
    }
  };

  private listenToGlobalEvents = (): void => {
    window.addEventListener('scroll', this.augmentVisibleElements, { capture: true });
    window.addEventListener('resize', this.augmentVisibleElements, { passive: true });

    window.addEventListener('animationend', this.augmentVisibleElements, { passive: true, capture: true });
    window.addEventListener('transitionend', this.augmentVisibleElements, { passive: true, capture: true });

    window.addEventListener('ksl:plus-button:request', this.onPlusInitialClick, { capture: true });
    window.addEventListener('ksl:plus-button:action', this.onPlusActionClick, { capture: true });
    window.addEventListener('ksl:highlight:edit', this.onEditElement, { capture: true });
  };

  private unlistenToGlobalEvents = (): void => {
    window.removeEventListener('scroll', this.augmentVisibleElements, { capture: true });
    window.removeEventListener('resize', this.augmentVisibleElements);

    window.removeEventListener('animationend', this.augmentVisibleElements, { capture: true });
    window.removeEventListener('transitionend', this.augmentVisibleElements, { capture: true });

    window.removeEventListener('ksl:plus-button:request', this.onPlusInitialClick, { capture: true });
    window.removeEventListener('ksl:plus-button:action', this.onPlusActionClick, { capture: true });
    window.removeEventListener('ksl:highlight:edit', this.onEditElement, { capture: true });
  };

  private observeDomMutations = (): void => {
    if (this.enabled) return;

    this.mutationObserver.observe(window.document.body, {
      childList: true,
      subtree: true,
    });

    getAugmentableDescendants(document).forEach((element: Element) => {
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
    if (this.observedElements.has(element)) return;

    this.intersectionObserver.observe(element);
    this.observedElements.add(element);
  };

  private unobserveElementVisibility = (element: HTMLElement): void => {
    if (!this.observedElements.has(element)) return;

    this.intersectionObserver.unobserve(element);
    this.observedElements.delete(element);
    this.visibleElements.delete(element);
  };

  private onDomMutation = (mutations: MutationRecord[]): void => {
    const relevantMutations = mutations.filter((mutation: MutationRecord) => {
      const isTypeRelevant = mutation.type === 'childList';
      const isTargetRelevant = mutation.target instanceof HTMLElement && !isElementWebComponent(mutation.target);

      if (!isTypeRelevant || !isTargetRelevant) {
        return false;
      }

      const hasRelevantAddedNodes = Array.from(mutation.addedNodes).some(
        (node) => node instanceof HTMLElement && !isElementWebComponent(node)
      );
      const hasRelevantRemovedNodes = Array.from(mutation.removedNodes).some(
        (node) => node instanceof HTMLElement && !isElementWebComponent(node)
      );

      return hasRelevantAddedNodes || hasRelevantRemovedNodes;
    });

    for (const mutation of relevantMutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        if (isElementAugmentable(node)) {
          this.observeElementVisibility(node);
        }

        for (const element of getAugmentableDescendants(node)) {
          if (!(element instanceof HTMLElement)) continue;

          this.observeElementVisibility(element);
        }
      }

      for (const node of mutation.removedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        if (isElementAugmentable(node)) {
          this.unobserveElementVisibility(node);
        }

        for (const element of getAugmentableDescendants(node)) {
          if (!(element instanceof HTMLElement)) continue;

          this.unobserveElementVisibility(element);
        }
      }
    }

    if (relevantMutations.length > 0) {
      this.augmentVisibleElements();
    }
  };

  private onElementVisibilityChange = (entries: IntersectionObserverEntry[]): void => {
    const filteredEntries = entries.filter((entry: IntersectionObserverEntry) => entry.target instanceof HTMLElement);

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
    const { data, targetNode } = event.detail;

    const messageData: Partial<IElementClickedMessageData> = {
      ...data,
      projectId: data.projectId ?? this.configurationManager.defaultProjectId,
      languageCodename: data.languageCodename ?? this.configurationManager.defaultLanguageCodename,
    };

    const messageMetadata: IClickedMessageMetadata = {
      elementRect: targetNode.getBoundingClientRect(),
    };

    if ('elementCodename' in messageData && messageData.elementCodename) {
      if (validateElementClickMessageData(messageData)) {
        if (isInsideIFrame()) {
          this.iframeCommunicator.sendMessage(IFrameMessageType.ElementClicked, messageData, messageMetadata);
        } else {
          const link = buildKontentLink(messageData);
          window.open(link, '_blank');
        }
      }
    } else if ('contentComponentId' in messageData && messageData.contentComponentId) {
      Logger.warn('Warning: Edit button for content components is not yet supported.');
    } else if ('itemId' in messageData && messageData.itemId) {
      if (validateContentItemClickEditMessageData(messageData)) {
        if (isInsideIFrame()) {
          this.iframeCommunicator.sendMessage(IFrameMessageType.ContentItemClicked, messageData, messageMetadata);
        } else {
          Logger.warn('Plus buttons for content items are only functional inside Web Spotlight.');
        }
      }
    } else {
      Logger.warn(
        'Warning: Some required attributes are not found or the edit button for this type of element is not yet supported.'
      );
    }
  };

  private onPlusInitialClick = (event: KSLPlusButtonElementRequestAsyncEvent): void => {
    const { eventData, onResolve, onReject } = event.detail;
    const { data, targetNode } = eventData;

    const messageData: DeepPartial<IPlusRequestMessageData> = {
      ...data,
      languageCodename: data.languageCodename ?? this.configurationManager.defaultLanguageCodename,
      projectId: data.projectId ?? this.configurationManager.defaultProjectId,
    };

    if (validatePlusRequestMessageData(messageData)) {
      if (isInsideIFrame()) {
        const messageMetadata: IClickedMessageMetadata = {
          elementRect: targetNode.getBoundingClientRect(),
        };

        this.iframeCommunicator.sendMessageWithResponse(
          IFrameMessageType.PlusRequest,
          messageData,
          (response?: IPlusButtonPermissionsServerModel) => {
            if (!response || response.elementType === PlusButtonElementType.Unknown) {
              return onReject({ message: 'Something went wrong.' });
            }

            return onResolve(response);
          },
          messageMetadata
        );
      } else {
        Logger.warn('Plus buttons are only functional inside Web Spotlight.');
        onReject({ message: 'Plus buttons are only functional inside Web Spotlight.' });
      }
    }
  };

  private onPlusActionClick = (event: KSLPlusButtonElementActionEvent): void => {
    const { data, targetNode } = event.detail;

    const messageData: DeepPartial<IPlusActionMessageData> = {
      ...data,
      languageCodename: data.languageCodename ?? this.configurationManager.defaultLanguageCodename,
      projectId: data.projectId ?? this.configurationManager.defaultProjectId,
    };

    if (validatePlusActionMessageData(messageData)) {
      if (isInsideIFrame()) {
        const messageMetadata: IClickedMessageMetadata = {
          elementRect: targetNode.getBoundingClientRect(),
        };

        this.iframeCommunicator.sendMessage(IFrameMessageType.PlusAction, messageData, messageMetadata);
      } else {
        Logger.warn('Plus buttons are only functional inside Web Spotlight.');
      }
    }
  };
}
