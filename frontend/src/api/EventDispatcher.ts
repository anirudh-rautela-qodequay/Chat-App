export const eventDispatcher = {
  authError: (message: string) => {
    const event = new CustomEvent("authError",{detail:message});
    window.dispatchEvent(event);
  },
  serviceUnavailableError: () => {
    const event = new CustomEvent("serviceUnavailableError");
    window.dispatchEvent(event);
  },
};
