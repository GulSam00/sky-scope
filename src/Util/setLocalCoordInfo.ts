interface ICoordInfo {
  nx: number;
  ny: number;
  province: string;
  city: string;
}

const setLocalCoordInfo = (coord: ICoordInfo) => {
  const { nx, ny, province, city } = coord;
  const prevCity = localStorage.getItem("city");
  console.log("prevCity", prevCity);
  console.log("city", city);
  if (prevCity === city) {
    alert("동일한 지역입니다.");
    return null;
  }

  localStorage.setItem("coord", JSON.stringify({ nx, ny }));
  localStorage.setItem("province", province);
  localStorage.setItem("city", city);

  return 1;
};

export default setLocalCoordInfo;
