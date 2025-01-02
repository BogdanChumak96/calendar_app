import { TextField, Button } from "@mui/material";

type LoginFormValues = {
  email: string;
  password: string;
};

export const LoginForm = ({
  onSubmit,
}: {
  onSubmit: (values: LoginFormValues) => void;
}) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    onSubmit({
      email: (data.get("email") as string) || "",
      password: (data.get("password") as string) || "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label='Email'
        name='email'
        margin='normal'
        required
      />
      <TextField
        fullWidth
        label='Password'
        name='password'
        type='password'
        margin='normal'
        required
      />
      <Button type='submit' variant='contained' fullWidth sx={{ mt: 2 }}>
        Login
      </Button>
    </form>
  );
};
