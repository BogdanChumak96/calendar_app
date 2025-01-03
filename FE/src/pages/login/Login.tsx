import { LoginForm } from "@/components";
import { useLogin } from "@/hooks";
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { mutate, isPending } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      await mutate({ email: values.email, password: values.password });
      navigate("/calendar");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <Container
      className='flex h-screen w-screen justify-center flex-col items-center'
      maxWidth='sm'
    >
      <Typography variant='h4' align='center' gutterBottom>
        Login
      </Typography>
      <LoginForm onSubmit={handleSubmit} isSubmitting={isPending} />
    </Container>
  );
};
export default Login;
