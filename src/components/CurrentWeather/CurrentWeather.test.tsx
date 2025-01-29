import { render, screen } from "@testing-library/react";
import CurrentWeather from "./CurrentWeather";
import { vi } from "vitest";
import { useTheme } from "@contexts/Theme";
import { useWeather } from "@contexts/WeatherData";
import mockWeatherData from "./mockWeatherData.json";
import type { Root } from "@global-types/main-types";

vi.mock("../../Contexts/Theme", () => ({
  useTheme: vi.fn(),
}));

vi.mock("../../Contexts/WeatherData", () => ({
  useWeather: vi.fn(),
}));

const weatherData: Root = mockWeatherData;

describe("CurrentWeather component", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("Should display loader when loading", () => {
    vi.mocked(useWeather).mockReturnValue({
      data: undefined,
      isLoading: true,
      weatherError: undefined,
      updateData: vi.fn(),
      currentCity: "London", // Set a default current city
      updateCity: vi.fn(),
    });

    render(<CurrentWeather />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("Should display error text when got error", async () => {
    vi.mocked(useWeather).mockReturnValue({
      data: undefined,
      isLoading: false,
      weatherError: {
        isError: true,
        ErrorMessage: "Fake error text",
      },
      updateData: vi.fn(),
      currentCity: "London", // Set a default current city
      updateCity: vi.fn(),
    });
    render(<CurrentWeather />);
    const screenError = await screen.findByText(/fake Error Text/i);
    expect(screenError).toBeInTheDocument();
  });

  it("Should display light or dark version of component depending on the current theme value", async () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "dark",
      changeTheme: () => null,
    });

    vi.mocked(useWeather).mockReturnValue({
      data: weatherData,
      isLoading: false,
      weatherError: undefined,
      updateData: vi.fn(),
      currentCity: "London", // Set a default current city
      updateCity: vi.fn(),
    });

    const { rerender } = render(<CurrentWeather />);

    const component = await screen.findByTestId("currentWeather");
    expect(component).toHaveClass(/dark/i);

    vi.mocked(useTheme).mockReturnValue({
      theme: "light",
      changeTheme: () => null,
    });
    rerender(<CurrentWeather />);
    expect(screen.getByTestId("currentWeather")).not.toHaveClass(/dark/i);
  });
});
