import { useState, useEffect } from "react";
import axios from "axios";

export async function useCountry(name) {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    async function getCountry(name) {
      const response = await axios.get(
        `https://restcountries.com/v3.1/name/${name}?fullText=true`
      );
      setCountry(response.data);
    }

    getCountry();
  }, [name]);

  return country;
}
