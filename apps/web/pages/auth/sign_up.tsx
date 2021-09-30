import Link from 'next/link';
import { FormControl } from 'components/FormControl';
import { useForm, SubmitHandler, useFormState } from 'react-hook-form';
import { useMutation } from 'urql';
import { withUrql } from '../../libs/urql-client';
import { updateAuthState } from 'services/auth';
import { useState } from 'react';

type SignUpFormData = {
  username: string;
  email: string;
  firstName: string;
  lastName?: string;
  password: string;
  confirmPassword: string;
};

const SignUpMutation = `
mutation SignUp($input: SignUpInput!) {
  signUp(input: $input) {
    accessToken
    refreshToken
  }
}
`;

const SignUp: React.FunctionComponent = () => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<SignUpFormData>({
    mode: 'onTouched',
  });
  const [succeed, setSucceed] = useState(false);
  const { isValid } = useFormState({ control });
  const [signUpResult, signUp] = useMutation(SignUpMutation);
  const onSubmit: SubmitHandler<SignUpFormData> = async ({
    confirmPassword,
    ...input
  }) => {
    const result = await signUp({ input });
    if (result.data) {
      updateAuthState(
        result.data.signUp.accessToken,
        result.data.signUp.refreshToken
      );
      setSucceed(true);
    } else {
      // TODO: Toast notification here
      alert('Sign up error');
    }
  };
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-4 bg-white shadow-sm rounded-md mt-6">
      {succeed ? (
        <div className="text-center">Thank you for signing up!</div>
      ) : (
        <>
          <h3 className="text-center font-medium text-xl mb-4">
            Sign up Viforo
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
              label="Email address"
              type="email"
              autoComplete="email"
              required
              {...register('email', {
                required: {
                  value: true,
                  message: 'Email is a required field',
                },
              })}
              error={errors.email?.message}
            />

            <FormControl
              label="First name"
              required
              {...register('firstName', {
                required: {
                  value: true,
                  message: 'First name is a required field',
                },
                maxLength: {
                  value: 32,
                  message:
                    'First name length must be not greater than 32 characters',
                },
              })}
              error={errors.firstName?.message}
            />
            <FormControl
              label="Last name"
              {...register('lastName', {
                maxLength: {
                  value: 32,
                  message:
                    'Last name length must be not greater than 32 characters',
                },
              })}
              error={errors.lastName?.message}
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

            <FormControl
              label="Confirm password"
              type="password"
              required
              {...register('confirmPassword', {
                required: {
                  value: true,
                  message: 'Please enter the confirmation password',
                },
                validate: (valValue) => {
                  return valValue === getValues('password')
                    ? true
                    : 'Password and confirmation password must be the same';
                },
              })}
              error={errors.confirmPassword?.message}
            />
            {signUpResult.error?.message && (
              <div className="text-white px-6 py-4 border-0 rounded relative bg-pink-500">
                {signUpResult.error?.message}
              </div>
            )}

            <button
              type="submit"
              disabled={!isValid}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
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
        </>
      )}
    </div>
  );
};

export default withUrql(SignUp);
