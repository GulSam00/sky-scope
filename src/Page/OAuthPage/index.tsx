import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getNaverToken } from '@src/API';

const naver_id = import.meta.env.VITE_NAVER_ID;
const naver_sercret = import.meta.env.VITE_NAVER_SECRET;

const OAuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const code = new URLSearchParams(location.search).get('code');
  // naver인지, kakao인지 구분해야함
  const pathSegments = location.pathname.split('/'); // 경로를 '/'로 나눠 배열로 저장
  console.log('code : ', code);
  console.log('pathSegments : ', pathSegments);

  const getToken = async () => {
    const type = pathSegments.pop();
    switch (type) {
      case 'naver': {
        const url = `/token?grant_type=authorization_code&client_id=${naver_id}&client_secret=${naver_sercret}&code=${code}&state=1234`;
        const result = await getNaverToken(url);
        if (!result) return;
        const { access_token, refresh_token } = result;
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        localStorage.setItem('oauthType', 'naver');
        navigate('/');
        break;
      }
      default:
        console.log('error!');
    }
  };

  useEffect(() => {
    getToken();
  }, []);
  return (
    <div>
      <h1>OAuth Page</h1>
    </div>
  );
};

export default OAuthPage;
