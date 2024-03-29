import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../elements/loader';
import { PrimaryText } from '../elements/text';
import {
  GET_GOOGLE_TOKENS,
  GoogleTokensResponse,
  GoogleTokensVariables,
} from '../graphQL/queries/google';
import { errorToast, successToast } from '../utils/toasts';
import PATH from '../utils/router/paths';
import { useAuth } from '../context/AuthContext';
import useLocalStorage, { Keys } from '../hooks/useLocalStorage';

export const GoogleAuthenticationHelper = () => {
  const [refetchTokens] = useLazyQuery<
    GoogleTokensResponse,
    GoogleTokensVariables
  >(GET_GOOGLE_TOKENS);
  const navigate = useNavigate();
  const { setUserHandler } = useAuth();

  const [access_token, setAccessToken] = useLocalStorage<string>(Keys.ACCESS_TOKEN, null);
  const [token, setToken] = useLocalStorage<string>(Keys.TOKEN, null);
  const [refresh_token, setRefreshToken] = useLocalStorage<string>(Keys.REFRESH_TOKEN, null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      refetchTokens({ variables: { code: code } })
        .then(res => {
          if (res.data) {
            const { access_token, refresh_token } =
              res.data.googleTokens.tokens;
            const { token } = res.data.googleTokens;
            const { user } = res.data.googleTokens;

            setAccessToken(access_token);
            setRefreshToken(refresh_token);
            setToken(token);
            setUserHandler(user);

            successToast('Authentication Successful');
            setTimeout(() => {
              successToast(`Welcome ${user.login}`);
            }, 500);
            setTimeout(() => navigate(PATH.APP), 1000);
          } else {
            throw new Error('No tokens received');
          }
        })
        .catch(err => {
          errorToast('Error while authenticating with Google');
          setTimeout(() => navigate(PATH.LOGIN), 1000);
        });
    }
  }, [window.location.search]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingTop: 100,
      }}
    >
      <Loader />
      <PrimaryText color="#000">
        Connecting with your Google Account
      </PrimaryText>
    </div>
  );
};
