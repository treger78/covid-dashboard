import TableManager from './table-manager';

export const tableInit = (data) => {
  (() => new TableManager(document.querySelector('.covid-table-wrapper')))();
  return data;
}
export const tableConvert = (data) => data;
