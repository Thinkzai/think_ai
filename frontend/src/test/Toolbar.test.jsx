import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { describe, it, expect, vi } from "vitest";
import configureStore from "redux-mock-store";
import Toolbar from "../components/liveStudio/Toolbar";

const mockStore = configureStore([]);

const defaultState = {
  liveSession: {
    isMuted: true,
    isCameraOff: true,
    isScreenSharing: false,
  },
};

describe("Toolbar", () => {
  it("renders all toolbar buttons", () => {
    const store = mockStore(defaultState);
    render(
      <Provider store={store}>
        <Toolbar onLeave={vi.fn()} />
      </Provider>
    );

    expect(screen.getByTestId("toolbar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /unmute/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start video/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /share screen/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /leave/i })).toBeInTheDocument();
  });

  it("dispatches toggleMute when mic button is clicked", async () => {
    const user = userEvent.setup();
    const store = mockStore(defaultState);
    store.dispatch = vi.fn();

    render(
      <Provider store={store}>
        <Toolbar onLeave={vi.fn()} />
      </Provider>
    );

    await user.click(screen.getByRole("button", { name: /unmute/i }));
    expect(store.dispatch).toHaveBeenCalled();
  });

  it("dispatches toggleCamera when camera button is clicked", async () => {
    const user = userEvent.setup();
    const store = mockStore(defaultState);
    store.dispatch = vi.fn();

    render(
      <Provider store={store}>
        <Toolbar onLeave={vi.fn()} />
      </Provider>
    );

    await user.click(screen.getByRole("button", { name: /start video/i }));
    expect(store.dispatch).toHaveBeenCalled();
  });

  it("dispatches toggleScreenShare when screen share button is clicked", async () => {
    const user = userEvent.setup();
    const store = mockStore(defaultState);
    store.dispatch = vi.fn();

    render(
      <Provider store={store}>
        <Toolbar onLeave={vi.fn()} />
      </Provider>
    );

    await user.click(screen.getByRole("button", { name: /share screen/i }));
    expect(store.dispatch).toHaveBeenCalled();
  });

  it("calls onLeave when leave button is clicked", async () => {
    const user = userEvent.setup();
    const onLeave = vi.fn();
    const store = mockStore(defaultState);

    render(
      <Provider store={store}>
        <Toolbar onLeave={onLeave} />
      </Provider>
    );

    await user.click(screen.getByRole("button", { name: /leave/i }));
    expect(onLeave).toHaveBeenCalledTimes(1);
  });

  it("shows mute label when unmuted", () => {
    const store = mockStore({
      liveSession: { ...defaultState.liveSession, isMuted: false },
    });
    render(
      <Provider store={store}>
        <Toolbar onLeave={vi.fn()} />
      </Provider>
    );
    expect(screen.getByRole("button", { name: /mute$/i })).toBeInTheDocument();
  });

  it("shows stop video label when camera is on", () => {
    const store = mockStore({
      liveSession: { ...defaultState.liveSession, isCameraOff: false },
    });
    render(
      <Provider store={store}>
        <Toolbar onLeave={vi.fn()} />
      </Provider>
    );
    expect(screen.getByRole("button", { name: /stop video/i })).toBeInTheDocument();
  });

  it("shows stop share label when screen sharing", () => {
    const store = mockStore({
      liveSession: { ...defaultState.liveSession, isScreenSharing: true },
    });
    render(
      <Provider store={store}>
        <Toolbar onLeave={vi.fn()} />
      </Provider>
    );
    expect(screen.getByRole("button", { name: /stop share/i })).toBeInTheDocument();
  });
});
