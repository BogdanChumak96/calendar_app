import { LoginForm } from "@/components";
import { Container, Typography } from "@mui/material";

const Login = () => {
  return (
    <Container
      className='flex h-screen w-screen justify-center flex-col items-center'
      maxWidth='sm'
    >
      <Typography variant='h4' align='center' gutterBottom>
        Login
      </Typography>
      <LoginForm onSubmit={() => {}} />
    </Container>
  );
};
export default Login;
