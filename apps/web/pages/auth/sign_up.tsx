import Link from 'next/link';
import { FormControl } from 'components/FormControl';
import { useForm, SubmitHandler, useFormState } from 'react-hook-form';

type SignUpFormData = {
  username: string;
  email: string;
  firstName: string;
  lastName?: string;
  password: string;
  confirmPassword: string;
};

const SignUp: React.FunctionComponent = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<SignUpFormData>();
  const onSubmit: SubmitHandler<SignUpFormData> = (data) => console.log(data);
  const { isValid } = useFormState({ control });
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-4 bg-white shadow-sm rounded-md mt-6">
      <h3 className="text-center font-medium text-xl mb-4">Sign up Viforo</h3>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <FormControl
          label="Username"
          required
          {...register('username', {
            required: true,
            minLength: 6,
            maxLength: 15,
          })}
        />
        <FormControl
          label="Email address"
          type="email"
          autoComplete="email"
          required
          {...register('email', {
            required: true,
          })}
        />

        <FormControl
          label="First name"
          required
          {...register('firstName', {
            required: true,
            maxLength: 32,
          })}
        />
        <FormControl
          label="Last name"
          {...register('lastName', { maxLength: 32 })}
        />

        <FormControl
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          {...register('password', {
            required: true,
          })}
        />

        <FormControl
          label="Confirm password"
          type="password"
          required
          {...register('confirmPassword', {
            required: true,
          })}
        />

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          disabled={!isValid}
        >
          Sign up
        </button>
      </form>
      <div className="text-sm text-center mt-6">
        <Link href="/auth/sign_in">
          <a className="font-medium text-indigo-600 hover:text-indigo-500">
            Already has an account? Please sign in
          </a>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
