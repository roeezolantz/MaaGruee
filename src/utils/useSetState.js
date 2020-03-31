import { useCallback, useState } from 'react';

const useSetState = (initialState = {}, prevState) => {
  const [state, set] = useState(initialState);
  const setState = useCallback(
    patch => {
      set(prevState => Object.assign({}, prevState, patch instanceof Function ? patch(prevState) : patch));
    },
    [set]
  );

  return [state, setState];
};

export default useSetState;