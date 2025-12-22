import { KSLTooltipElement } from "../KSLTooltipElement";
import { KSLCustomElement } from "./KSLCustomElement";
import { ElementPositionOffset } from "./KSLPositionedElement";

export abstract class KSLCustomElementWithTooltip extends KSLCustomElement {
  public static get observedAttributes(): string[] {
    return ["tooltip-disabled", "tooltip-message"];
  }

  public get tooltipDisabled(): boolean {
    return this.hasAttribute("tooltip-disabled");
  }

  public set tooltipDisabled(value: boolean) {
    this.updateAttribute("tooltip-disabled", value);
  }

  public get tooltipMessage(): string | null {
    return this.getAttribute("tooltip-message");
  }

  public set tooltipMessage(value: string | null) {
    this.updateAttribute("tooltip-message", value);
  }

  public get tooltipPosition(): string {
    return this.getAttribute("tooltip-position") ?? ElementPositionOffset.Bottom;
  }

  public set tooltipPosition(value: string) {
    this.updateAttribute("tooltip-position", value);
  }

  protected tooltipRef: KSLTooltipElement | null = null;

  public connectedCallback(): void {
    this.addEventListener("focus", this.showTooltip);
    this.addEventListener("mouseenter", this.showTooltip);
    this.addEventListener("blur", this.hideTooltip);
    this.addEventListener("mouseleave", this.hideTooltip);
  }

  public disconnectedCallback(): void {
    this.hideTooltip();

    this.removeEventListener("focus", this.showTooltip);
    this.removeEventListener("mouseenter", this.showTooltip);
    this.removeEventListener("blur", this.hideTooltip);
    this.removeEventListener("mouseleave", this.hideTooltip);
  }

  public attributeChangedCallback(
    attributeName: string,
    _oldValue: string | null,
    newValue: string | null,
  ): void {
    if (attributeName === "tooltip-disabled") {
      if (newValue) {
        this.hideTooltip();
      }
    } else if (attributeName === "tooltip-message") {
      if (!newValue) {
        this.hideTooltip();
      }
    }
  }

  private showTooltip = (): void => {
    if (this.tooltipRef) {
      this.hideTooltip();
    }

    if (!this.tooltipMessage || this.tooltipDisabled) {
      return;
    }

    const tooltip = document.createElement(KSLTooltipElement.is);
    tooltip.innerText = this.tooltipMessage;

    this.tooltipRef = document.body.appendChild(tooltip);
    this.tooltipRef.position = this.tooltipPosition;
    this.tooltipRef.attachTo(this);

    this.tooltipRef.visible = true;
  };

  private hideTooltip = (): void => {
    if (this.tooltipRef) {
      this.tooltipRef.visible = false;
      this.tooltipRef.remove();
      this.tooltipRef = null;
    }
  };
}
