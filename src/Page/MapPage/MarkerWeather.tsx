import { useLiveDataQuery } from '@src/Queries';
import { MarkerType } from '@src/Queries/useLiveDataQuery';

const MarkerWeather = ({ marker }: { marker: MarkerType }) => {
  const result = useLiveDataQuery(new Date(), marker);
  const data = result.data;
  console.log('test : ', data);
  return (
    <div>
      {result.isLoading && <p>Loading...</p>}
      {result.error && <p>Error: {result.error.message}</p>}
      {result.data && (
        <div>
          <p>지역: {result.data.province}</p>
          <p>도시: {result.data.city}</p>
          <p>장소 : {result.data.content}</p>

          <p>기온: {result.data.T1H}°C</p>
          <p>강수량: {result.data.RN1}mm</p>
          <p>강수형태: {result.data.PTY}</p>
        </div>
      )}
    </div>
  );
};

export default MarkerWeather;
