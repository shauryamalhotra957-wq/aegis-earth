import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const setReducedMotion = (matches: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => ({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }))
  });
};

describe("Aegis Earth app", () => {
  beforeEach(() => {
    window.localStorage.clear();
    setReducedMotion(false);
  });

  it("renders the command center and top metrics", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Resilience Command Center" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Decision brief" })).toBeInTheDocument();
    expect(screen.getByText("Global Risk")).toBeInTheDocument();
    expect(screen.getByText("Planetary Risk Map")).toBeInTheDocument();
    expect(screen.getByText("Scenario Lab")).toBeInTheDocument();
  });

  it("starts in focus mode and opens full telemetry on demand", () => {
    render(<App />);

    expect(screen.queryByText("Signal Trust Feed")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Full" }));

    expect(screen.getByText("Trust Feed")).toBeInTheDocument();
    expect(screen.getByText("Resource Stack")).toBeInTheDocument();
  });

  it("updates the selected region from the triage roster", () => {
    render(<App />);

    fireEvent.click(screen.getByTestId("region-row-la-basin"));

    const brief = screen.getByRole("region", { name: "Decision brief" });
    expect(within(brief).getByRole("heading", { name: "Los Angeles Basin" })).toBeInTheDocument();
    expect(screen.getByTestId("region-row-la-basin")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /Los Angeles Basin, United States: \d+% risk/ })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("switches scenario mode through the segmented control", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Shock" }));

    expect(screen.getByRole("button", { name: "Shock" })).toHaveClass("is-active");
    expect(screen.getByRole("button", { name: "Shock" })).toHaveAttribute("aria-pressed", "true");
  });

  it("renders a static risk map when reduced motion is requested", () => {
    setReducedMotion(true);
    const animationFrame = vi.spyOn(window, "requestAnimationFrame");

    render(<App />);

    expect(animationFrame).not.toHaveBeenCalled();
  });

  it("starts live feed refresh without crashing on unsupported regions", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Full" }));
    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));

    expect(screen.getByText(/NWS live alerts cover United States coordinates/)).toBeInTheDocument();
    expect(vi.isMockFunction(HTMLCanvasElement.prototype.getContext)).toBe(true);
  });
});
