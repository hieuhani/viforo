import { urqlClient } from '../../libs/urql-client';
import { createContext, useContext, useEffect, useState } from 'react';
import { getAuthState } from './storage';

interface MyUser {
  account: {
    avatar?: string;
    email: string;
    firstName: string;
    lastName?: string;
    username: string;
  };
}

interface State {
  hasToken: boolean;
  checking: boolean;
  myUser?: MyUser;
}

const isServerSide = typeof window === 'undefined';
const hasToken = (): boolean => {
  return !isServerSide && !!getAuthState();
};
const defaultState: State = {
  hasToken: hasToken(),
  checking: true,
  myUser: undefined,
};

const AuthContext = createContext(defaultState);

const queryMe = `
{
  me {
    id
    account {
      avatar
      email
      email
      username
      fullName
    }
  }
}
`;

export const AuthProvider: React.FunctionComponent = ({ children }) => {
  const [myUser, setMyUser] = useState<MyUser>();
  const [checking, setChecking] = useState(true);
  const fetchMe = async () => {
    try {
      const result = await urqlClient.query(queryMe).toPromise();
      if (result.data?.me) {
        setMyUser(result.data?.me);
      }
    } finally {
      setChecking(false);
    }
  };
  useEffect(() => {
    fetchMe();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        hasToken: hasToken(),
        checking,
        myUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth hook must be inside an AuthProvider');
  }
  return context;
};
