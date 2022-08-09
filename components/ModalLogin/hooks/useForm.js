import { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function useForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (name) => (e) => {
    const { value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((v) => ({ ...v, [name]: undefined }));
  };

  const validate = () => {
    let hasError = false;
    if (!values.email) {
      hasError = true;
      setErrors((v) => ({ ...v, email: "Masukkan email" }));
    } else if (
      !String(values.email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      hasError = true;
      setErrors((v) => ({ ...v, email: "Format email tidak benar" }));
    }

    if (!values.password) {
      hasError = true;
      setErrors((v) => ({ ...v, password: "Masukkan password" }));
    }

    return hasError;
  };

  const captcha = useRef();
  const resetCaptcha = () => captcha.current.resetCaptcha();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const hasError = validate();
    if (hasError) return;

    if (
      process.env.BUILD_ENV === "production" ||
      process.env.BUILD_ENV === "prod"
    ) {
      resetCaptcha();

      captcha.current.execute();
    } else {
      setIsLoading(true);
      try {
        await axios.post("/api/common/login", { ...values });
        replace("/");
      } catch (err) {
        console.error(err);
        if (err.response?.data) setMessage(err.response.data);
      }
      setIsLoading(false);
    }
  };

  const { replace } = useRouter();

  const onCaptchaVerify = async (c) => {
    setIsLoading(true);
    try {
      await axios.post("/api/common/login", { ...values, captcha: c });
      replace("/");
    } catch (err) {
      if (err.response?.data) setMessage(err.response.data);
      resetCaptcha();
    }
    setIsLoading(false);
  };

  return {
    isLoading,
    values,
    errors,
    message,
    captcha,
    handleChange,
    handleSubmit,
    onCaptchaVerify,
    resetCaptcha,
  };
}
