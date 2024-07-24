import { useState, useCallback } from 'react';

const useAutoSearch = () => {
  const [isAutoSearch, setIsAutoSearch] = useState<boolean>(false);
  const [searchWord, setSearchWord] = useState<string>('');
  const [searchAutoList, setSearchAutoList] = useState<string[]>([]);

  const [focusIndex, setFocusIndex] = useState(-1);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchWord(value);
    const ps = new kakao.maps.services.Places();

    if (value.length) {
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
    }
  };

  const handleChangeFocus = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isAutoSearch === false) return;

    if (e.key === 'ArrowDown') {
      const index = (focusIndex + 1) % searchAutoList.length;
      setFocusIndex(index);
    } else if (e.key === 'ArrowUp') {
      const index = (focusIndex - 1 + searchAutoList.length) % searchAutoList.length;
      setFocusIndex(index);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      setSearchWord(searchAutoList[focusIndex]);
      setIsAutoSearch(false);
      setSearchAutoList([]);
      setFocusIndex(-1);
    }
  };

  const onClickAutoGroup = (place: string) => {
    setSearchWord(place);
    setIsAutoSearch(false);
    setSearchAutoList([]);
  };

  return {
    isAutoSearch,
    searchWord,
    searchAutoList,
    focusIndex,
    handleChangeInput,
    handleChangeFocus,
    onClickAutoGroup,
  };
};

export default useAutoSearch;
