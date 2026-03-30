import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProfileProvider } from "@/context/ProfileContext";
import { FertilizerDecoder } from "@/components/FertilizerDecoder";

function renderDecoder() {
  return render(
    <MemoryRouter>
      <ProfileProvider>
        <FertilizerDecoder />
      </ProfileProvider>
    </MemoryRouter>,
  );
}

describe("FertilizerDecoder", () => {
  it("renders without crashing", () => {
    renderDecoder();
    expect(screen.getByText("Fertilizer Label Decoder")).toBeInTheDocument();
  });

  it("shows N-P-K input fields", () => {
    renderDecoder();
    expect(screen.getByLabelText("N")).toBeInTheDocument();
    expect(screen.getByLabelText("P")).toBeInTheDocument();
    expect(screen.getByLabelText("K")).toBeInTheDocument();
  });

  it("shows preset dropdown", () => {
    renderDecoder();
    expect(screen.getByLabelText("Common Presets")).toBeInTheDocument();
  });

  it("shows Decode Label button", () => {
    renderDecoder();
    expect(screen.getByRole("button", { name: /decode label/i })).toBeInTheDocument();
  });

  it("displays results when form is submitted", () => {
    renderDecoder();

    // Set N value
    const nInput = screen.getByLabelText("N");
    fireEvent.change(nInput, { target: { value: "24" } });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /decode label/i }));

    // Results section should appear
    expect(screen.getByText("What Each Number Means")).toBeInTheDocument();
    expect(screen.getByText("Rating")).toBeInTheDocument();
    expect(screen.getByText("Best Use")).toBeInTheDocument();
  });

  it("preset dropdown changes N-P-K values", () => {
    renderDecoder();

    const select = screen.getByLabelText("Common Presets");
    fireEvent.change(select, {
      target: { value: "Balanced (10-10-10)" },
    });

    const nInput = screen.getByLabelText("N") as HTMLInputElement;
    const pInput = screen.getByLabelText("P") as HTMLInputElement;
    const kInput = screen.getByLabelText("K") as HTMLInputElement;

    expect(Number(nInput.value)).toBe(10);
    expect(Number(pInput.value)).toBe(10);
    expect(Number(kInput.value)).toBe(10);
  });

  it("shows warning for phosphorus > 0", () => {
    renderDecoder();

    const pInput = screen.getByLabelText("P");
    fireEvent.change(pInput, { target: { value: "18" } });

    fireEvent.click(screen.getByRole("button", { name: /decode label/i }));

    expect(
      screen.getByText(/high phosphorus/i),
    ).toBeInTheDocument();
  });

  it("classifies high-nitrogen fertilizer correctly", () => {
    renderDecoder();

    fireEvent.change(screen.getByLabelText("N"), { target: { value: "32" } });
    fireEvent.change(screen.getByLabelText("P"), { target: { value: "0" } });
    fireEvent.change(screen.getByLabelText("K"), { target: { value: "4" } });

    fireEvent.click(screen.getByRole("button", { name: /decode label/i }));

    expect(screen.getByText("High Nitrogen")).toBeInTheDocument();
  });
});
