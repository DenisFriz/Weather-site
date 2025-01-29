import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import mockWeatherData from "../CurrentWeather/mockWeatherData.json";
import { useWeather } from "@contexts/WeatherData";
import { useTheme } from "@contexts/Theme";
import Header from "./Header";
import type { Root } from "@global-types/main-types";

vi.mock("../../Contexts/WeatherData.tsx", () => ({
  useWeather: vi.fn(),
}));

vi.mock("../../Contexts/Theme.tsx", () => ({
  useTheme: vi.fn(),
}));

const weatherData: Root = mockWeatherData;

describe("Header component", () => {
  const mockUpdateData = vi.fn();
  const mockUpdateCity = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Should display error message below the input when user entered empty string", () => {
    vi.mocked(useWeather).mockReturnValue({
      data: weatherData,
      isLoading: false,
      weatherError: undefined,
      updateData: vi.fn(),
      currentCity: "London", // Set a default current city
      updateCity: vi.fn(),
    });
    render(<Header />);

    const input = screen.getByPlaceholderText(/Search City.../i);

    fireEvent.change(input, {
      target: {
        value: "",
      },
    });

    const buttonSearch = screen.getByTestId("submit-btn");

    fireEvent.click(buttonSearch);

    expect(
      screen.getByText(/Please, enter the city name./i)
    ).toBeInTheDocument();
  });

  it("Submits the city name when valid input is provided", async () => {
    vi.mocked(useWeather).mockReturnValue({
      data: weatherData,
      isLoading: false,
      weatherError: undefined,
      updateData: mockUpdateData,
      currentCity: "London", // Set a default current city
      updateCity: mockUpdateCity,
    });

    render(<Header />);

    const input = screen.getByPlaceholderText(/search city.../i);
    const btnSearch = screen.getByTestId("submit-btn");

    fireEvent.change(input, { target: { value: "Kyiv" } });
    fireEvent.click(btnSearch);

    expect(mockUpdateData).toHaveBeenCalledWith({ city: "Kyiv", days: "1" });
    expect(mockUpdateCity).toHaveBeenCalledWith("Kyiv");

    expect(mockUpdateData).toBeCalledTimes(1);
    expect(mockUpdateCity).toBeCalledTimes(1);

    expect(
      screen.queryByText(/please, enter the city name/i)
    ).not.toBeInTheDocument();
  });

  it("Should display a dark or light version of the component depending on the current theme value", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "dark",
      changeTheme: vi.fn(),
    });
    const { rerender } = render(<Header />);
    expect(screen.getByTestId("submit-btn")).toHaveClass(/btn_dark/i);
    expect(screen.getByTestId("header")).toHaveClass(/header_dark/i);

    vi.mocked(useTheme).mockReturnValue({
      theme: "light",
      changeTheme: vi.fn(),
    });
    rerender(<Header />);
    expect(screen.getByTestId("submit-btn")).not.toHaveClass(/btn_dark/i);
    expect(screen.getByTestId("header")).not.toHaveClass(/header_dark/i);
  });

  it("Should display correct date", () => {
    const mockDate = new Date(2024, 9, 11);
    vi.setSystemTime(mockDate);

    render(<Header />);

    expect(screen.getByTestId("date")).toHaveTextContent(
      /Пятница Октябрь 2024/i
    );
  });
});
