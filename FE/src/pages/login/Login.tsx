import { LoginForm } from "@/components";
import { useLogin } from "@/hooks";
import { Box, Container, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { mutate, isPending } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      await mutate({ email: values.email, password: values.password });
      navigate("/");
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
      <Box mt={2}>
        <Typography variant='body2' align='center'>
          Don't have an account?{" "}
          <Link
            to='/registration'
            style={{ color: "#3f51b5", textDecoration: "none" }}
          >
            Register here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};
export default Login;
