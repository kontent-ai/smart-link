import { logError } from '../lib/Logger';

export function reload(): void {
  try {
    window.location.reload();
  } catch (e) {
    logError(e);
  }
}
