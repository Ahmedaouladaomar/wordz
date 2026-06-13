export class PageMetaDto {
  readonly page: number;
  readonly take: number;
  readonly total: number;
  readonly totalPages: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor(page: number, take: number, total: number) {
    this.page = page;
    this.take = take;
    this.total = total;
    this.totalPages = Math.ceil(total / take);
    this.hasPreviousPage = page !== 1;
    this.hasNextPage = page < this.totalPages;
  }
}
