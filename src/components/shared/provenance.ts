/**
 * Special provenance values of the navigation state.
 *
 * @remarks
 * A container that holds a navigation state, such as {@link Stack.Host},
 * labels every state it reports with a *provenance*: a number that grows with
 * every change of the state. JS sends the provenance of the last state it
 * received back as the base of its next request, so the container can tell
 * whether the request was made on top of an outdated state.
 *
 * Provenance values are opaque. Keep the last value received from the native
 * side and pass it back unchanged. Do not compute with provenance values and do
 * not assume where they start.
 */
export const Provenance: {
  /**
   * Base provenance of a request made before JS has seen any state of the
   * container.
   *
   * @remarks
   * Use it as the base of the initial request. It also lets a JS side that
   * lost its state, while the container kept its own, request a state again:
   * such a request is older than every state of the container, so it is
   * rejected as stale if the state was changed by anything other than JS
   * requests, and the rejection carries the current state to re-sync from.
   *
   * The value is implementation-defined and can change between releases. The
   * native side never reports it as the provenance of a state.
   */
  readonly INITIAL: number;
} = Object.freeze({
  INITIAL: -1,
});
