import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App";

function renderAt(path: string) {
  window.history.pushState({}, "", path);
  return render(<App />);
}

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the unknown page at the error root", async () => {
    renderAt("/error");

    expect(
      await screen.findByText(
        "An unknown error has occurred. The exact cause is unknown. Please contact the administrator.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Unknown Page")).toBeInTheDocument();
  });

  it("renders a numeric error route", async () => {
    renderAt("/error/404");

    expect(await screen.findByText("404")).toBeInTheDocument();
    expect(
      await screen.findByText(
        "The page cannot be found. The requested page does not exist.",
      ),
    ).toBeInTheDocument();
  });

  it("treats non-numeric routes as unknown pages", async () => {
    renderAt("/error/not-found");

    expect(await screen.findByText("Unknown Page")).toBeInTheDocument();
    expect(
      await screen.findByText(
        "An unknown error has occurred. The exact cause is unknown. Please contact the administrator.",
      ),
    ).toBeInTheDocument();
  });

  it("persists language changes and updates the message", async () => {
    const user = userEvent.setup();
    renderAt("/error/404");

    await screen.findByText(
      "The page cannot be found. The requested page does not exist.",
    );

    await user.selectOptions(screen.getByRole("combobox"), "ko");

    expect(localStorage.getItem("language")).toBe("ko");
    expect(
      await screen.findByText(
        "찾을 수 없는 페이지예요. 요청한 페이지가 없어요.",
      ),
    ).toBeInTheDocument();
  });

  it("persists dark mode changes", async () => {
    const user = userEvent.setup();
    const { container } = renderAt("/error");

    await user.click(
      await screen.findByRole("button", { name: "Toggle Light/Dark Mode" }),
    );

    await waitFor(() => {
      expect(container.querySelector(".error-container")).toHaveClass(
        "dark-mode",
      );
    });
    expect(localStorage.getItem("darkMode")).toBe("true");
  });
});
