import { RegistrationForm } from "@/components";
import { useRegistration } from "@/hooks";
import { RegistrationFormValues } from "@/types";
import { Container, Typography } from "@mui/material";

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
    </Container>
  );
};
export default Registration;
