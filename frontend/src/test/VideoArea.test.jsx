import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import configureStore from "redux-mock-store";
import VideoArea from "../components/liveStudio/VideoArea";

const mockStore = configureStore([]);

const defaultState = {
  liveSession: {
    session: { title: "Test Class", instructorName: "John Doe" },
    isCameraOff: true,
    isScreenSharing: false,
  },
};

describe("VideoArea", () => {
  it("renders camera off placeholder by default", () => {
    const store = mockStore(defaultState);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <VideoArea />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByTestId("video-area")).toBeInTheDocument();
    expect(screen.getByText("Camera is off")).toBeInTheDocument();
  });

  it("shows instructor initial when camera is off", () => {
    const store = mockStore(defaultState);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <VideoArea />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("shows screen share active view when screen sharing", () => {
    const store = mockStore({
      liveSession: {
        ...defaultState.liveSession,
        isCameraOff: true,
        isScreenSharing: true,
      },
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <VideoArea />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText("Screen Share Active")).toBeInTheDocument();
  });

  it("shows camera active view when camera is on", () => {
    const store = mockStore({
      liveSession: {
        ...defaultState.liveSession,
        isCameraOff: false,
        isScreenSharing: false,
      },
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <VideoArea />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText("Camera Active")).toBeInTheDocument();
  });

  it("displays instructor name overlay", () => {
    const store = mockStore(defaultState);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <VideoArea />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("(Host)")).toBeInTheDocument();
  });
});
