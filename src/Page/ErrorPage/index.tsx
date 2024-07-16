import { useDispatch } from 'react-redux';
import { loadedData } from '@src/Store/loadingStateSlice';

const ErrorPage = () => {
  const dispatch = useDispatch();

  dispatch(loadedData());

  return (
    <div>
      <h1>Error Page</h1>
    </div>
  );
};

export default ErrorPage;
