import { FormControl } from 'components/FormControl';
import { withUrql } from '../../libs/urql-client';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { updateAuthState } from 'services/auth';
import { useMutation } from 'urql';

type SignInFormData = {
  username: string;
  password: string;
};

const SignInMutation = `
mutation SignIn($input: LoginInput!) {
  signIn(input: $input) {
    accessToken
    refreshToken
  }
}
`;

const SignIn: React.FunctionComponent = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignInFormData>({
    mode: 'onTouched',
  });
  const { isValid } = useFormState({ control });
  const [signInResult, signIn] = useMutation(SignInMutation);
  const onSubmit: SubmitHandler<SignInFormData> = async (input) => {
    const result = await signIn({ input });
    if (result.data) {
      updateAuthState(
        result.data.signIn.accessToken,
        result.data.signIn.refreshToken
      );
      window.location.href = '/';
    } else {
      // TODO: Toast notification here
      alert('Sign in error');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-4 bg-white shadow-sm rounded-md mt-6">
      <h3 className="text-center font-medium text-xl mb-4">
        Sign in to Viforo
      </h3>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <FormControl
          label="Username"
          required
          {...register('username', {
            required: true,
            minLength: 6,
            maxLength: 15,
          })}
          error={
            errors.username
              ? 'Username length must be from 6 to 15 characters'
              : undefined
          }
        />
        <FormControl
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          {...register('password', {
            required: {
              value: true,
              message: 'Password is a required field',
            },
          })}
          error={errors.password?.message}
        />

        {signInResult.error?.message && (
          <div className="text-white px-6 py-4 border-0 rounded relative bg-pink-500">
            {signInResult.error?.message}
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Sign in
        </button>
        <div className="text-center">
          <a
            href="#"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot your password?
          </a>
        </div>
      </form>
    </div>
  );
};

export default withUrql(SignIn);
