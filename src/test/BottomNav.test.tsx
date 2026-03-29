import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "nav.home": "Home",
        "nav.plan": "Plan",
        "nav.journal": "Journal",
        "nav.photos": "Photos",
        "nav.tools": "Tools",
        "nav.badges": "Badges",
        "nav.mainNavigation": "Main navigation",
      };
      return map[key] ?? key;
    },
  }),
}));

import { BottomNav } from "@/components/BottomNav";

function renderAtRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <BottomNav />
    </MemoryRouter>,
  );
}

describe("BottomNav", () => {
  it("renders all nav links", () => {
    renderAtRoute("/");
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Plan")).toBeInTheDocument();
    expect(screen.getByText("Journal")).toBeInTheDocument();
    expect(screen.getByText("Photos")).toBeInTheDocument();
    expect(screen.getByText("Tools")).toBeInTheDocument();
    expect(screen.getByText("Badges")).toBeInTheDocument();
  });

  it("marks home as active on / route", () => {
    renderAtRoute("/");
    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toHaveAttribute("aria-current", "page");
  });

  it("marks journal as active on /journal route", () => {
    renderAtRoute("/journal");
    const journalLink = screen.getByText("Journal").closest("a");
    expect(journalLink).toHaveAttribute("aria-current", "page");
    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).not.toHaveAttribute("aria-current");
  });

  it("has navigation landmark", () => {
    renderAtRoute("/");
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("nav has aria-label", () => {
    renderAtRoute("/");
    expect(screen.getByLabelText("Main navigation")).toBeInTheDocument();
  });
});
