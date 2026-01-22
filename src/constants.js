export const mockData = Array.from({
  // length: 1000000,
  length: 300000,
  // length: 50000,
  // length: 10,
  // length: 30,
}).map((_, i) => ({
  //   key: i.toString(),
  // data: `content${i + 1}`,
  value: `value${i}`,
  label: `label${i}`,
  data: `content${i}`,
  description: `descriptioncontent${i}`,
  aaaaa: `descriptioncontent${i}`,
  bbbbb: `bbbbb${i}`,
  ccccc: `ccccc${i}`,
  ddddd: `ddd${i}`,
  eeeee: `eeee${i}`,
  fffff: `ffff${i}`,
  ggggg: `gggg${i}`,
  hhhhh: `hhhh${i}`,
  iiiii: `iiii${i}`,
  jjjjj: `jjjj${i}`,
  kkkkk: `kkkk${i}`,
  lllll: `lllll${i}`,
  mmmmm: `mmmm${i}`,
  nnnnn: `nnnnn${i}`,
  ooooo: `oooooo${i}`,
}));

export const mockData2 = Array.from({ length: 1000_000 }).map((_, i) => ({
  key: i.toString(),
  title: `content${i + 1}`,
  value: `value${i + 1}`,
  description: `description of content${i + 1}`,
}));

export const ARR_DATAS_LOADING = Array.from({
  length: 8,
})?.map((_, idx) => ({
  key: idx,
  idxSelected: idx,
  disabled: false,
}));

export const HEIGHT_TABLE_TRANSFER = 480;

export const OBJ_CLASS_TRANSFER = {
  ROW_SELECTED: "ant-table-row-selected",
  ROW_DISABLED: "ant-transfer-list-content-item-disabled",
  WRAPPER_TRANSFER: "ant-transfer-wrapper-component",
  WRAPPER_TRANSFER_ERROR: "ant-wrapper-error-transfer",
  TRANSFER_BLURRY: "ant-transfer-blurry",
};

export const LIMIT_PAGE = 10;
