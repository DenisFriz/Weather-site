import { fireEvent, render, screen } from "@testing-library/react";
import DaysList from "./DaysList";
import { vi } from "vitest";
import { useTheme } from "@contexts/Theme";
import { useWeather } from "@contexts/WeatherData";
import mockWeatherData from "../CurrentWeather/mockWeatherData.json";
import type { Root } from "@global-types/main-types";
import * as utils from "@utils/getDay";

vi.mock("../../Contexts/Theme", () => ({
  useTheme: vi.fn(),
}));

vi.mock("../../Contexts/WeatherData", () => ({
  useWeather: vi.fn(),
}));

const weatherData: Root = mockWeatherData;

describe("DaysList component", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("Should display loader if data is loading", () => {
    vi.mocked(useWeather).mockReturnValue({
      data: undefined,
      isLoading: true,
      weatherError: undefined,
      updateData: vi.fn(),
      currentCity: "London", // Set a default current city
      updateCity: vi.fn(),
    });

    render(<DaysList />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("If no data is received, an error should be displayed.", () => {
    vi.mocked(useWeather).mockReturnValue({
      data: undefined,
      isLoading: false,
      weatherError: {
        isError: true,
        ErrorMessage: "Error test message",
      },
      updateData: vi.fn(),
      currentCity: "London", // Set a default current city
      updateCity: vi.fn(),
    });
    render(<DaysList />);
    expect(screen.getByText(/Error test message/i)).toBeInTheDocument();
  });

  it("Should display light or dark version of component depending on the current theme value", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "dark",
      changeTheme: vi.fn(),
    });
    vi.mocked(useWeather).mockReturnValue({
      data: weatherData,
      isLoading: false,
      weatherError: undefined,
      updateData: vi.fn(),
      currentCity: "London", // Set a default current city
      updateCity: vi.fn(),
    });

    const { rerender } = render(<DaysList />);

    expect(screen.getAllByTestId("days-item")[0]).toHaveClass(
      /days__item_dark/i
    );

    vi.mocked(useTheme).mockReturnValue({
      theme: "light",
      changeTheme: vi.fn(),
    });
    rerender(<DaysList />);
    expect(screen.getAllByTestId("days-item")[0]).not.toHaveClass(
      /days__item_dark/i
    );
  });

  it("Should open modal window if user clicked on the button", () => {
    vi.mocked(useWeather).mockReturnValue({
      data: weatherData,
      isLoading: false,
      weatherError: undefined,
      updateData: vi.fn(),
      currentCity: "London", // Set a default current city
      updateCity: vi.fn(),
    });

    render(<DaysList />);

    fireEvent.click(screen.getByText("More info"));
    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("Should display the correct day of the week in long format", () => {
    const spyGetDay = vi.spyOn(utils, "getDay");

    vi.mocked(useWeather).mockReturnValue({
      data: weatherData,
      isLoading: false,
      weatherError: undefined,
      updateData: vi.fn(),
      currentCity: "London", // Set a default current city
      updateCity: vi.fn(),
    });

    render(<DaysList />);

    expect(spyGetDay).toHaveBeenCalledTimes(1);
    spyGetDay.mockRestore();
  });
});
