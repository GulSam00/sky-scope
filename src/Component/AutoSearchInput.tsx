import { useAutoSearch } from '@src/Hook';

import { Form, Button } from 'react-bootstrap';
import styled from 'styled-components';

interface Props {
  onClickButton: () => void;
}
const AutoSearchInput = ({ onClickButton }: Props) => {
  const { isAutoSearch, searchWord, searchAutoList, handleChangeInput, handleChangeFocus } = useAutoSearch();

  return (
    <FormContainer>
      <Form>
        <Form.Control size='lg' type='text' placeholder='테스트' value={searchWord} onChange={handleChangeInput} />
      </Form>
      <Button onClick={onClickButton}>확인</Button>
    </FormContainer>
  );
};

export default AutoSearchInput;

const FormContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 16px;

  form {
    flex-grow: 1;
    margin-right: 10px;
  }

  button {
    min-width: 80px;
    min-height: 40px;
  }
`;
