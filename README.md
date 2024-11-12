<div align="center">

<img src="public/scope.png"  height="150" width="150"/>

# Skyscope

# 프로젝트 소개

카카오 지도로 검색한 장소의 실시간 날씨 정보를 확인할 수 있습니다.<br/>
실시간 날씨는 북마크로 저장이 가능하며, 매시 정각마다 갱신되는 데이터를 가져옵니다.<br/>

공공 데이터 포털에서 제공하는 기상청 API와 카카오 지도 API를 조합해서 제작했습니다.<br/>

---

# 기술 스택

<div>

<img src="https://img.shields.io/badge/vite-123142?style=flat-square&logo=vite&logoColor=white"/>
<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white"/>
<img src="https://img.shields.io/badge/styled components-DB7093?style=flat-square&logo=styled-components&logoColor=white"/>
<img src="https://img.shields.io/badge/Bootstrap-7952B3?style=flat-square&logo=bootstrap&logoColor=white"/>
</div>

<div>
<img src="https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=Typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/react query-234152?style=flat-square&logo=react-query&logoColor=white"/>
<img src="https://img.shields.io/badge/redux-223415?style=flat-square&logo=redux&logoColor=white"/>
<img src="https://img.shields.io/badge/OAuth-EB5424?style=flat-square&logo=auth0&logoColor=white"/>
<img src="https://img.shields.io/badge/Firebase-DD2C00?style=flat-square&logo=firebase&logoColor=white"/>

</div>

---

# 배포
<div align="center">

- 서비스 도메인 : [https://skyscope.vercel.app](https://skyscope.vercel.app)
- 자체 패키지 : [https://www.npmjs.com/package/ultra-exact-ncst](https://www.npmjs.com/package/ultra-exact-ncst)
</div>

---


# 주요 기능

## 카카오 지도 상에서 검색한 장소 날씨 제공 & 북마크 기능

https://github.com/user-attachments/assets/b080192e-c021-49f9-acfb-e729f1f4bd1b

<div align="left">

* 카카오 지도로 검색한 장소에 해당되는 지역의 실시간 날씨를 제공합니다.
* react-query를 사용해 동일한 쿼리 키(지역에 해당하는 코드) 호출 시 캐싱된 데이터를 전달하게 해서 불필요한 API 호출을 방지했습니다.
* query 함수(기상청 API 호출)가 에러가 났을 때 에러 페이지로 navigate 되게끔 하여 안정성을 높였습니다.
* 북마크한 장소, 조회한 장소, 검색한 장소에 해당하는 마커를 별개의 이미지로 표시하여 한눈에 알아볼 수 있는 UX를 고려했습니다.
* 카카오 지도 상에 올라가는 마커를 별개의 state로 관리하여 마커의 중복을 방지하고 북마크, 조회, 검색할 때마다 마커를 갱신시켜 사용자가 동작할 떄마다 지도 상의 마커가 실시간으로 변하는 경험을 구현했습니다.
  
</div>

https://github.com/user-attachments/assets/6d1fd416-d302-434f-9ecd-82f9bbd27eb8


# 프로젝트 기록

<div align="left">
  
> [Velog 기록](https://velog.io/@sham/series/SkyScope-%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80)



- 2024.3.13 : 프로젝트 시작
- 2024.5.17 : 날씨 차트(예보차트 페이지) 추가
- 2024.7.16 : 카카오 지도(실시간날씨 페이지) 추가
- 2024.7.27 : 실시간날씨 페이지 - 자동완성 기능 추가, 컴포넌트 최적화 작업
- 2024.9.25 : 디자인 리펙토링, Toast 기능 추가
- 2024.10.8 : 네이버, 카카오 OAuth 추가. firebase 연동. 디자인 개선.
- 2024.10.28 : API 요청을 처리하기 위한 [패키지](https://www.npmjs.com/package/ultra-exact-ncst) 제작 및 배포. 프로젝트에 이식 작업 진행.

</div>

# 회고

## 해결하고자 했던 문제

<div align="left">
  
- 기상청 API 요청 시 지역에 해당하는 파라미터 값을 실제 좌표가 아닌 고유한 좌표로 보내주어야만 했습니다.
- 카카오 지도 위에 렌더링 될 마커들을 상태에 따라 관리하고 제어해야만 했습니다.
- 다양한 최적화 방법을 시도하며 성능을 개선했습니다.
- 인증 과정에서 발생할 수 있는 CORS 및 Vercel의 URL 리다이렉션 문제를 proxy를 활용해 해결했습니다.
- Firebase를 활용한 OAuth 인증을 통해 기존에 로컬 스토리지로 데이터를 저장하던 불안정성을 개선하였습니다.
- 자주 사용하는 API 로직을 모듈화하여 npm 상에 패키지로 배포하고 프로젝트에서 직접 적용해 코드의 재사용성, 유지보수성을 향상했습니다.
  
</div>
  
## 무엇을 얻었는지

<div align="left">
  
- 서로 다른 API를 목적에 맞게 호환해보는 경험을 얻었습니다.
- 커스텀 훅을 통한 UI와 비즈니스 로직 분리를 경험하며 장단점을 파악했습니다.
- CORS의 발생 원인과 이유, 해결 방안에 대해 고민할 수 있었습니다.
- 직접 패키지를 만들고 배포하는 과정을 통해 tsconfig 설정에 대해 학습할 수 있었습니다.
  
</div>


</div>






