import { API_KEY } from "@constants/constants";
import type { Root } from "@global-types/main-types";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQuery, useQueryClient } from "react-query";

type WeatherError = {
  isError: boolean;
  ErrorMessage: string;
};

interface WeatherContextType {
  data: Root | undefined;
  updateData: ({ city, days }: WeatherType) => void;
  currentCity: string;
  updateCity: (city: string) => void;
  isLoading: boolean;
  weatherError: WeatherError | undefined;
}

const WeatherContext = createContext<WeatherContextType | null>(null);

type WeatherType = {
  city: string;
  days: string;
};

type Result<T> = { success: true; data: T } | { success: false; error: Error };

async function getWeatherData<T>({
  city,
  days,
}: WeatherType): Promise<Result<T>> {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=${days}`
    );
    if (!response.ok) {
      throw new Error("An error occurred while loading data.");
    }
    const data = (await response.json()) as T;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
type WeatherQueryKey = [string, { city: string; days: string }];
const WeatherData = ({ children }: { children: ReactNode }) => {
  const [currentCity, setCurrentCity] = useState("London");
  const [data, setData] = useState<Root | undefined>(undefined);
  const [weatherError, setWeatherError] = useState<WeatherError>();

  const { refetch, isLoading } = useQuery(
    ["weather", { city: "kyiv", days: "1" }] as WeatherQueryKey,
    ({ queryKey }: { queryKey: WeatherQueryKey }) => {
      const [, { city, days }] = queryKey;
      return getWeatherData<Root>({ city, days });
    },
    {
      enabled: false,
    }
  );

  const queryClient = useQueryClient();
  useEffect(() => {
    const handleData = async () => {
      const { data } = await refetch();

      if (data?.success) {
        setData(data.data);
      }
    };
    handleData();
  }, [refetch]);

  const updateData = async ({ city, days }: WeatherType) => {
    const result = await queryClient.fetchQuery({
      queryKey: ["weather", { city, days }] as WeatherQueryKey,
      queryFn: ({ queryKey }: { queryKey: WeatherQueryKey }) => {
        const [, { city, days }] = queryKey;
        return getWeatherData<Root>({ city, days });
      },
    });

    if (result.success) {
      setData(result.data);
      setWeatherError({ isError: false, ErrorMessage: "" });
    } else {
      setWeatherError({ isError: true, ErrorMessage: result.error.message });
    }
  };

  const updateCity = (city: string) => {
    setCurrentCity(city);
  };

  const contextValue: WeatherContextType = {
    data,
    updateData,
    currentCity,
    updateCity,
    isLoading,
    weatherError,
  };

  return (
    <WeatherContext.Provider value={contextValue}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);

export default WeatherData;
