import { TextField, Button, CircularProgress } from "@mui/material";
import { FC, FormEvent, useState } from "react";

type LoginFormValues = {
  email: string;
  password: string;
};

type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => void;
  isSubmitting: boolean;
};

export const LoginForm: FC<LoginFormProps> = ({ onSubmit, isSubmitting }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label='Email'
        name='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin='normal'
        required
      />
      <TextField
        fullWidth
        label='Password'
        name='password'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin='normal'
        required
      />
      <Button
        type='submit'
        disabled={isSubmitting}
        variant='contained'
        fullWidth
        sx={{ mt: 2 }}
      >
        {isSubmitting ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
};
