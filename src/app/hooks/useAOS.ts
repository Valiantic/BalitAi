import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export const useAOS = (options = {}) => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      ...options,
    });
  }, []);
};