import { RegistrationForm } from "@/components";
import { Container, Typography } from "@mui/material";

const Registration = () => {
  return (
    <Container
      className='h-screen w-screen flex justify-center items-center flex-col'
      maxWidth='sm'
    >
      <Typography variant='h4' align='center' gutterBottom>
        Create an Account
      </Typography>
      <RegistrationForm onSubmit={() => {}} />
    </Container>
  );
};
export default Registration;
