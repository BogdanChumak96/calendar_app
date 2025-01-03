import { useState, FormEvent } from "react";
import { TextField, Button, MenuItem, CircularProgress } from "@mui/material";

const countries = [
  { code: "UA", name: "Ukraine" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
];

type RegistrationFormProps = {
  onSubmit: (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    country: string;
  }) => void;
  isSubmitting: boolean;
};

export const RegistrationForm = ({
  onSubmit,
  isSubmitting,
}: RegistrationFormProps) => {
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);

    const values = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      country: formData.get("country") as string,
    };

    if (values.password !== values.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError(null);
    onSubmit(values);
  };

  const countryItems = countries.map((country) => (
    <MenuItem key={country.code} value={country.name}>
      {country.name}
    </MenuItem>
  ));

  return (
    <form onSubmit={handleSubmit}>
      <TextField fullWidth label='Name' name='name' margin='normal' required />
      <TextField
        fullWidth
        label='Email'
        name='email'
        margin='normal'
        required
        type='email'
      />
      <TextField
        fullWidth
        label='Password'
        name='password'
        margin='normal'
        required
        type='password'
      />
      <TextField
        fullWidth
        label='Confirm Password'
        name='confirmPassword'
        margin='normal'
        required
        type='password'
        error={!!passwordError}
        helperText={passwordError}
      />
      <TextField
        fullWidth
        select
        label='Country'
        name='country'
        margin='normal'
        defaultValue=''
        required
      >
        {countryItems}
      </TextField>
      <Button
        type='submit'
        variant='contained'
        fullWidth
        sx={{ mt: 2 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          "Register"
        )}
      </Button>
    </form>
  );
};
