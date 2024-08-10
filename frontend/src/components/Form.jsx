// BasicExampleForm.js
// Create a fully operational form.
import React from "react";

import Form, { Input, Select, FormButton } from "react-form-component";

const FeedBackForm = () => (
  <div className=" md:w-96 px-5 md:px-0 mx-auto py-10">
    <Form fields={["name", "email", "type"]}>
      <Input name="name" label="User name" />
      <Input name="email" type="email" label="E-mail" />
      <Select
        name="type"
        label="Type of a user"
        options={["Viewer", "Moderator", "Admin"]}
      />
      <FormButton onClick={(fields) => console.log(fields)}>Save</FormButton>
    </Form>
  </div>
);

export default FeedBackForm;
