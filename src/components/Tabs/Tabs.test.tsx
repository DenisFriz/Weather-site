import { fireEvent, render, screen } from "@testing-library/react";
import { useTheme } from "@contexts/Theme";
import Tabs from "./Tabs";
import { Root } from "@global-types/main-types";
import mockWeatherData from "../CurrentWeather/mockWeatherData.json";
import { useWeather } from "@contexts/WeatherData";

vi.mock("../../Contexts/Theme.tsx", () => ({
  useTheme: vi.fn(),
}));

vi.mock("../../Contexts/WeatherData", () => ({
  useWeather: vi.fn(),
}));

const weatherData: Root = mockWeatherData;

describe("Tabs component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it("Should display list with three childs", () => {
    render(<Tabs />);

    expect(screen.getByRole("list")).toBeInTheDocument();

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(3);
    expect(listItems[0]).toHaveTextContent("Today");
    expect(listItems[1]).toHaveTextContent("Tomorrow");
    expect(listItems[2]).toHaveTextContent("Next 7 day");
  });

  it("Should display light or dark version of component depending on the current theme value", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "dark",
      changeTheme: vi.fn(),
    });

    const { rerender } = render(<Tabs />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems[0]).toHaveClass(/tabs__link_dark/i);
    expect(listItems[1]).toHaveClass(/tabs__link_dark/i);
    expect(listItems[2]).toHaveClass(/tabs__link_dark/i);

    vi.mocked(useTheme).mockReturnValue({
      theme: "light",
      changeTheme: vi.fn(),
    });

    rerender(<Tabs />);

    expect(listItems[0]).not.toHaveClass(/tabs__link_dark/i);
    expect(listItems[1]).not.toHaveClass(/tabs__link_dark/i);
    expect(listItems[2]).not.toHaveClass(/tabs__link_dark/i);
  });

  it("Should send request to the server if user clicked a button", async () => {
    const mockUpdateWeatherData = vi.fn();
    vi.mocked(useWeather).mockReturnValue({
      data: weatherData,
      isLoading: false,
      weatherError: undefined,
      updateData: mockUpdateWeatherData,
      currentCity: "London",
      updateCity: vi.fn(),
    });

    render(<Tabs />);

    const listItems = screen.getAllByRole("listitem");
    await fireEvent.click(listItems[0]);

    expect(mockUpdateWeatherData).toHaveBeenCalledWith({
      city: "London",
      days: "1",
    });

    await fireEvent.click(listItems[1]);

    expect(mockUpdateWeatherData).toHaveBeenCalledWith({
      city: "London",
      days: "2",
    });

    await fireEvent.click(listItems[2]);

    expect(mockUpdateWeatherData).toHaveBeenCalledWith({
      city: "London",
      days: "7",
    });
  });
});
