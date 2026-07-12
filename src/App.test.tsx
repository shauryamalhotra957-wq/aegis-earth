import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

describe("Aegis Earth app", () => {
  beforeEach(() => {
    window.localStorage.clear();
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
  });

  it("switches scenario mode through the segmented control", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Shock" }));

    expect(screen.getByRole("button", { name: "Shock" })).toHaveClass("is-active");
  });

  it("starts live feed refresh without crashing on unsupported regions", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Full" }));
    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));

    expect(screen.getByText(/NWS live alerts cover United States coordinates/)).toBeInTheDocument();
    expect(vi.isMockFunction(HTMLCanvasElement.prototype.getContext)).toBe(true);
  });
});
