import { expect } from "@jest/globals";
import { render } from "@testing-library/react";
import Leaderboard from "../pages/leaderboard";

describe("Leaderboard Tests", () => {
  test("addition", () => {
    expect(1 + 1).toBe(2);
  });

  const fakeAverages = [
    {
      name: "test",
      downloads: 0,
    },
    {
      name: "test2",
      downloads: 2,
    },
  ];
  const fakeTotals = [
    {
      name: "test",
      downloads: 0,
    },
    {
      name: "test2",
      downloads: 2,
    },
  ];
  it("Shows headers", () => {
    render(<Leaderboard />);
  });
});

export {};
