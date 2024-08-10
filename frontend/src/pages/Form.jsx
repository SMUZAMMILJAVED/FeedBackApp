import React from "react";
import FeedBackForm from "../components/Form";
import { FormThemeProvider } from "react-form-component";
export const Form = () => {
  return (
    <FormThemeProvider>
      <FeedBackForm />
    </FormThemeProvider>
  );
};
