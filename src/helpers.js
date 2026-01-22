export const generateIdxSelected = (arr = []) => {
  return arr?.map((data, idx) => ({
    ...data,
    idxSelected: idx,
  }));
};

export const onOnceSelect = ({
  key,
  idxSelected,
  selectedKeyRef,
  direction,
  objSelectIdxRef,
}) => {
  if (selectedKeyRef?.current?.has(key)) {
    selectedKeyRef?.current.delete(key);

    // objSelectIdxRef.current[direction].start = -1;
  } else {
    selectedKeyRef?.current.add(key);

    // objSelectIdxRef.current[direction].start = idxSelected;
  }
};
