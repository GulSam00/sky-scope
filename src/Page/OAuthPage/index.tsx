import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { onLogin } from '@src/Store/globalDataSlice';
import { errorAccured } from '@src/Store/requestStatusSlice';

import { LoadingState } from '@src/Component';
import { getNaverToken, getKakaoToken, getNaverInfo, getKakaoInfo } from '@src/API';

const OAuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const code = new URLSearchParams(location.search).get('code');
  const pathSegments = location.pathname.split('/'); // 경로를 '/'로 나눠 배열로 저장

  const getToken = async () => {
    // naver인지, kakao인지 구분해야함
    const type = pathSegments.pop();

    if (!code) {
      dispatch(errorAccured('잘못된 접근입니다.'));
      navigate('/');
      return;
    }

    switch (type) {
      case 'naver': {
        const result = await getNaverToken('authorization_code', `code=${code}&state=1234`);
        if (!result) {
          dispatch(errorAccured('네이버 로그인에 실패했습니다.'));
          return;
        }
        const { access_token, refresh_token } = result;
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        localStorage.setItem('oauthType', 'naver');

        const info = await getNaverInfo();
        if (info) {
          const { id, nickname } = info;
          dispatch(onLogin({ id, nickname, type: 'naver' }));
          navigate('/');
        }
        break;
      }
      case 'kakao': {
        const result = await getKakaoToken('authorization_code', `code=${code}`);
        if (!result) {
          dispatch(errorAccured('카카오 로그인에 실패했습니다.'));
          return;
        }
        const { access_token, refresh_token } = result;
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        localStorage.setItem('oauthType', 'kakao');
        const info = await getKakaoInfo();
        if (info) {
          const { id, nickname } = info;
          dispatch(onLogin({ id, nickname, type: 'kakao' }));
          navigate('/');
        }

        navigate('/');
        break;
      }
      default:
      // dispatch(errorAccured('잘못된 접근입니다.'));
      // navigate('/');
    }
  };

  useEffect(() => {
    getToken();
  }, [pathSegments]);

  return (
    <div>
      <LoadingState />
    </div>
  );
};

export default OAuthPage;
