import { LIMIT_PAGE } from "./constants";

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

    objSelectIdxRef.current[direction].start = -1;
  } else {
    selectedKeyRef?.current.add(key);

    objSelectIdxRef.current[direction].start = idxSelected;
  }
};

export const onMultipleSelect = ({
  objSelectIdxRef,
  idxSelected,
  direction,
  selectedKeyRef,
}) => {
  if (idxSelected < objSelectIdxRef?.current?.[direction]?.start) {
    objSelectIdxRef.current[direction].end =
      objSelectIdxRef?.current?.[direction]?.start;

    objSelectIdxRef.current[direction].start = idxSelected;
  } else {
    objSelectIdxRef.current[direction].end = idxSelected;
  }

  const start = objSelectIdxRef.current[direction].start;
  const end = objSelectIdxRef.current[direction].end;

  // generate array from start index to end index
  const arrGeneratedIdx = [];
  for (let i = start; i <= end; i++) {
    arrGeneratedIdx.push(i);
  }

  if (arrGeneratedIdx.every((index) => selectedKeyRef.current?.has(index))) {
    arrGeneratedIdx?.forEach((key) => {
      selectedKeyRef.current?.delete(key);
    });
  } else {
    arrGeneratedIdx?.forEach((key) => {
      selectedKeyRef.current?.add(key);
    });
  }
};

export const getNewPageAfterOnChange = ({ arrDatasLength, currPage }) => {
  const newPage = Math.ceil(arrDatasLength / LIMIT_PAGE);

  if (newPage < currPage) {
    if (newPage > 0) {
      return newPage;
    }
    return 1;
  }

  return currPage;
};
