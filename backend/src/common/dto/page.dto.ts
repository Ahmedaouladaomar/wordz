import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
  items: T[];
  meta?: PageMetaDto;

  constructor(items: T[], meta?: PageMetaDto) {
    this.items = items;
    this.meta = meta;
  }
}
