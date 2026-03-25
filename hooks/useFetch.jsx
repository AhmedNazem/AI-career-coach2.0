import React, { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cb(...args);
      if (response && typeof response === "object" && "success" in response) {
        if (response.success) {
          setData(response.data);
          setError(null);
        } else {
          setError(new Error(response.error));
          toast.error(response.error);
        }
      } else {
        // Backward compatibility for non-standardized actions
        setData(response);
        setError(null);
      }
    } catch (error) {
      setError(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { data, loading, error, fn, setData };
};

export default useFetch;
