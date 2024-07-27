import { set } from 'date-fns';
import { useState, useCallback } from 'react';

const useAutoSearch = () => {
  const [isAutoSearch, setIsAutoSearch] = useState<boolean>(false);
  const [searchWord, setSearchWord] = useState<string>('');
  const [lastSearchWord, setLastSearchWord] = useState<string>('');
  const [searchAutoList, setSearchAutoList] = useState<string[]>([]);
  const [focusIndex, setFocusIndex] = useState(-1);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const value = e.target.value;
    setSearchWord(value);

    if (value.length) {
      const ps = new kakao.maps.services.Places();
      ps.keywordSearch(value, (data, status, pagination) => {
        if (status === kakao.maps.services.Status.OK) {
          const list = data.map((item: any) => item.place_name).slice(0, 5);
          setSearchAutoList(list);
          setIsAutoSearch(true);
          setFocusIndex(-1);
        } else {
          setIsAutoSearch(false);
        }
      });
    } else setIsAutoSearch(false);
  };

  const handleChangeFocus = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      const index = (focusIndex + 1) % searchAutoList.length;
      setFocusIndex(index);
    } else if (e.key === 'ArrowUp') {
      const index = (focusIndex - 1 + searchAutoList.length) % searchAutoList.length;
      setFocusIndex(index);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (!isAutoSearch) return;
      setSearchWord(searchAutoList[focusIndex]);
      setIsAutoSearch(false);
    }
  };

  const onClickAutoGroup = (place: string) => {
    setSearchWord(place);
    setIsAutoSearch(false);
    setSearchAutoList([]);
  };

  const onClickSearchButton = (isSuccess: boolean) => {
    setIsAutoSearch(false);
    setSearchWord('');
    if (isSuccess) {
      setLastSearchWord(searchWord);
    }
  };

  return {
    isAutoSearch,
    searchWord,
    lastSearchWord,
    searchAutoList,
    focusIndex,
    handleChangeInput,
    handleChangeFocus,
    onClickSearchButton,
    onClickAutoGroup,
  };
};

export default useAutoSearch;
