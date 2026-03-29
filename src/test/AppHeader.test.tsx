import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock dependencies
vi.mock("@/context/ProfileContext", () => ({
  useProfile: () => ({
    profile: { zone: 7, region: "Transition Zone", name: "Test" },
  }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      const map: Record<string, string> = {
        "common.appName": "Grasswise",
        "common.editProfile": "Edit profile",
        "common.switchToLight": "Switch to light mode",
        "common.switchToDark": "Switch to dark mode",
        "common.zone": `Zone ${opts?.zone ?? "?"}`,
      };
      return map[key] ?? key;
    },
  }),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme: vi.fn() }),
}));

import { AppHeader } from "@/components/AppHeader";

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("AppHeader", () => {
  it("renders Grasswise logo text", () => {
    renderWithRouter(<AppHeader />);
    expect(screen.getByText("Grasswise")).toBeInTheDocument();
  });

  it("logo links to home", () => {
    renderWithRouter(<AppHeader />);
    const logoLink = screen.getByText("Grasswise").closest("a");
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("renders theme toggle button", () => {
    renderWithRouter(<AppHeader />);
    expect(screen.getByLabelText(/switch to dark mode/i)).toBeInTheDocument();
  });

  it("renders profile link", () => {
    renderWithRouter(<AppHeader />);
    expect(screen.getByLabelText(/edit profile/i)).toBeInTheDocument();
  });

  it("header has sticky positioning", () => {
    renderWithRouter(<AppHeader />);
    const header = screen.getByText("Grasswise").closest("header");
    expect(header?.className).toContain("sticky");
  });
});
