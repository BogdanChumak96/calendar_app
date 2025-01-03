import { RegistrationForm } from "@/components";
import { useRegistration } from "@/hooks";
import { RegistrationFormValues } from "@/types";
import { Container, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Registration = () => {
  const { mutate, isPending } = useRegistration();

  const handleSubmit = async (values: RegistrationFormValues) => {
    mutate({
      email: values.email,
      password: values.password,
      name: values.name,
      country: values.country,
    });
  };

  return (
    <Container
      className='h-screen w-screen flex justify-center items-center flex-col'
      maxWidth='sm'
    >
      <Typography variant='h4' align='center' gutterBottom>
        Create an Account
      </Typography>
      <RegistrationForm onSubmit={handleSubmit} isSubmitting={isPending} />
      <Box mt={2}>
        <Typography variant='body2' align='center'>
          Already have an account?
          <Link
            to='/login'
            style={{ color: "#3f51b5", textDecoration: "none" }}
          >
            Login here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Registration;
