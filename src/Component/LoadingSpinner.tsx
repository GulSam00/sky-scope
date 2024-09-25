import { Spinner } from 'react-bootstrap';
import { styled } from 'styled-components';

const LoadingSpinner = () => {
  return (
    <SpinnerContainer>
      <Spinner animation='border' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </Spinner>
    </SpinnerContainer>
  );
};

export default LoadingSpinner;

const SpinnerContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
