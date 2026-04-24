export class PageMetaDto {
  readonly page: number;
  readonly take: number;
  readonly totalFiltered: number;
  readonly total: number;
  readonly totalPages: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor(page: number, take: number, totalFiltred: number, total: number) {
    this.page = page;
    this.take = take;
    this.total = total;
    this.totalFiltered = totalFiltred;
    this.totalPages = Math.ceil(totalFiltred / take);
    this.hasPreviousPage = page !== 1;
    this.hasNextPage = page < this.totalPages;
  }
}
