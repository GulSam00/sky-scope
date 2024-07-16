<div align="center">

<img src="public/scope.png"  height="150" width="150"/>

# Skyscope

# 프로젝트 소개

카카오 지도로 검색한 장소의 현재 기온과 강수 확률에 대한 3일까지의 정보를 차트로 제공합니다.<br/>
카카오 지도로 검색한 장소의 실시간 날씨 정보를 확인할 수 있습니다.<br/>
실시간 날씨는 북마크로 저장이 가능하며, 매시 정각마다 갱신되는 데이터를 가져옵니다.<br/>

공공 데이터 포털에서 제공하는 기상청 API와 카카오 지도 API를 조합해서 제작했습니다.<br/>

---

# 기술 스택

<div>

<img src="https://img.shields.io/badge/vite-123142?style=flat-square&logo=vite&logoColor=white"/>
<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white"/>
<img src="https://img.shields.io/badge/styled components-DB7093?style=flat-square&logo=styled-components&logoColor=white"/>
<img src="https://img.shields.io/badge/Bootstrapap-7952B3?style=flat-square&logo=bootstrap&logoColor=white"/>
</div>

<div>
<img src="https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=Typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/react query-234152?style=flat-square&logo=react-query&logoColor=white"/>
<img src="https://img.shields.io/badge/redux-223415?style=flat-square&logo=redux&logoColor=white"/>

</div>

---

# 배포주소
<div align="center">

[Skyscope](https://skyscope.vercel.app)
</div>

---


# 주요 기능

## 날씨 정보 차트 제공 (3일)

<div align="left">
  
* nivo chart 라이브러리를 사용해서 조회 결과를 직관적으로 보여주고자 하였습니다.
* Dropdown에서 도, 시를 선택하는 방식이 아닌 카카오 지도 검색으로 해당 위치의 날씨 데이터를 받을 수 있게 적절한 파싱 작업을 거쳤습니다.

</div>

https://github.com/user-attachments/assets/97311481-744a-4030-9820-4d743871534e

## 카카오 지도 상에서 검색한 장소 날씨 제공 & 북마크 기능 (시간별 실시간)

<div align="left">
  
* react-query를 사용해 동일한 쿼리 키(지역에 해당하는 코드) 호출 시 캐싱된 데이터를 전달하게 해서 불필요한 API 호출을 방지했습니다.
* query 함수(기상청 API 호출)가 에러가 났을 때 에러 페이지로 navigate 되게끔 하여 안정성을 높였습니다.
* 북마크한 장소, 조회한 장소, 검색한 장소에 해당하는 마커를 별개의 이미지로 표시하여 한눈에 알아볼 수 있는 UX를 고려했습니다.
* 카카오 지도 상에 올라가는 마커를 별개의 state로 관리하여 마커의 중복을 방지하고 북마크, 조회, 검색할 때마다 마커를 갱신시켜 사용자가 동작할 떄마다 지도 상의 마커가 실시간으로 변하는 경험을 구현했습니다.
  
</div>

https://github.com/user-attachments/assets/48d50db2-a170-409f-8cc4-1ebdc9b7aac0

# 회고

## 해결하고자 했던 문제

<div align="left">
  
- react-query를 활용하여 API 요청 부분을 별도의 코드로 처리하게 되어 유지보수가 용이해지고 코드 상에서도 더 깔끔하게 사용할 수 있도록 하였습니다.
- redux를 활용하여 다양한 컴포넌트에서 사용되는 상태들을 전역적으로 관리할 수 있게 되었으며 불필요한 props drilling 현상을 방지할 수 있도록 하였습니다.
- 기존에 사용했던 CRA 대신 Vite를 활용해서 CRA보다 훨씬 빠르게 빌드가 진행되도록 하였습니다.
- 타입스크립트를 적용하여 코드의 생산성을 높이고자 하였습니다.
- 로딩 화면을 도입하여 데이터가 변경되는 동안 사용자의 추가적인 입력을 방지했습니다.
- 모바일로 접속하는 사용자를 위해 모바일 환경을 고려한 디자인을 고민했습니다.
  
</div>

## 개발 과정의 어려움

<div align="left">
  
- 기상청 API는 지역에 해당하는 파라미터를 실제 좌표 값이 아닌 고유한 좌표를 요구했기에 실제 좌표를 기상청 API에서 정한 포맷에 맞춰 변환하는 작업이 필요했습니다.
- 카카오 지도 API로 특정 장소를 검색했을 때 기상청 API로 받아오는 과정에서 해당 지역에 대한 정보를 기상청이 요구하는 파라미터에 맞게 적절하게 파싱해주는 작업이 필요했습니다.

</div>
  
## 무엇을 얻었는지

<div align="left">
  
- 서로 다른 API를 목적에 맞게 호환해보는 경험을 얻었습니다.
- react-query를 사용해서 데이터를 캐싱하는 것으로 불필요한 API 호출을 줄일 수 있었습니다.
- API를 호출할 마다 redux로 생성한 boolean 값을 변경시켜 사용자가 API 호출 도중 동작을 하지 못하도록 제어해주었습니다.
  
</div>


</div>






