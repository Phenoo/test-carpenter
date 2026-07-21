import type { FulfilmentStatus } from "./types";

export const fulfilmentTransitions: Record<FulfilmentStatus, FulfilmentStatus[]> = {
  pending: ["processing", "cancelled"],
  processing: ["packed", "cancelled"],
  packed: ["shipped", "cancelled"],
  shipped: ["out_for_delivery", "delivered"],
  out_for_delivery: ["delivered"],
  delivered: ["refunded"],
  cancelled: [],
  refunded: [],
};

export function canTransitionFulfilment(from: FulfilmentStatus, to: FulfilmentStatus) {
  return fulfilmentTransitions[from].includes(to);
}
