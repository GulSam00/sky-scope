import { useState } from 'react';

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
    setFocusIndex,
    handleChangeInput,
    onClickSearchButton,
  };
};

export default useAutoSearch;
