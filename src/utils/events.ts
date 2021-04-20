export type AsyncCustomEventDetail<TEventData, TResolveData, TRejectReason> = {
  readonly eventData: TEventData;
  readonly onResolve: (data: TResolveData) => void;
  readonly onReject: (reason: TRejectReason) => void;
};

export type AsyncCustomEvent<TEventData, TResolveData, TRejectReason> = CustomEvent<
  AsyncCustomEventDetail<TEventData, TResolveData, TRejectReason>
>;
