import React, { useState } from "react";
import { TextField, Button, MenuItem, CircularProgress } from "@mui/material";
import { COUNTRIES } from "@/common/constants";

type RegistrationFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
};

type RegistrationFormProps = {
  onSubmit: (values: RegistrationFormValues) => void;
  isSubmitting: boolean;
};

export const RegistrationForm = ({
  onSubmit,
  isSubmitting,
}: RegistrationFormProps) => {
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<RegistrationFormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (formValues.password !== formValues.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError(null);
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label='Name'
        name='name'
        margin='normal'
        required
        value={formValues.name}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label='Email'
        name='email'
        margin='normal'
        required
        type='email'
        value={formValues.email}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label='Password'
        name='password'
        margin='normal'
        required
        type='password'
        value={formValues.password}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label='Confirm Password'
        name='confirmPassword'
        margin='normal'
        required
        type='password'
        value={formValues.confirmPassword}
        onChange={handleChange}
        error={!!passwordError}
        helperText={passwordError}
      />
      <TextField
        fullWidth
        select
        label='Country'
        name='country'
        margin='normal'
        required
        value={formValues.country}
        onChange={handleChange}
      >
        {COUNTRIES.map((country) => (
          <MenuItem key={country.code} value={country.code}>
            {country.name}
          </MenuItem>
        ))}
      </TextField>
      <Button type='submit' variant='contained' fullWidth sx={{ mt: 2 }}>
        {isSubmitting ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          "Register"
        )}
      </Button>
    </form>
  );
};
