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

  it("treats unsupported numeric routes as unknown pages", async () => {
    renderAt("/error/999");

    expect(await screen.findByText("Unknown Page")).toBeInTheDocument();
    expect(
      await screen.findByText(
        "An unknown error has occurred. The exact cause is unknown. Please contact the administrator.",
      ),
    ).toBeInTheDocument();
  });

  it("uses the app base path for public image assets", async () => {
    renderAt("/error/404");

    const image = await screen.findByRole("img", { name: "캐릭터" });
    expect(image).toHaveAttribute(
      "src",
      `${import.meta.env.BASE_URL}res/characters/1.png`,
    );
  });

  it("renders a custom message from the message query parameter", async () => {
    renderAt("/error/500?message=Please%20try%20again%20later");

    expect(await screen.findByText("500")).toBeInTheDocument();
    expect(
      await screen.findByText("Please try again later"),
    ).toBeInTheDocument();
  });

  it("renders a home link from the homeUrl query parameter", async () => {
    renderAt("/error/500?homeUrl=%2F");

    expect(await screen.findByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("ignores unsafe homeUrl query parameters", async () => {
    renderAt("/error/500?homeUrl=javascript%3Aalert(1)");

    await screen.findByText("500");
    expect(
      screen.queryByRole("link", { name: "Home" }),
    ).not.toBeInTheDocument();
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
