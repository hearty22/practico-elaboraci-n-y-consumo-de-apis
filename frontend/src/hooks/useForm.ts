import { useState } from "react";

export const useForm = <T extends object>(initialValue: T) => {
  const [formData, setFormData] = useState<T>(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleReset = () => {
    setFormData(initialValue);
  };
  return {
    handleChange,
    handleReset,
    formData,
  };
};
