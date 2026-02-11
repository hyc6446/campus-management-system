// 图书状态
export enum BookStatus {
  AVAILABLE = 'available',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  DELETED = 'deleted',
}
// 图书分类
export enum BookCategory {
  COMPUTER = 'computer',
  LITERATURE = 'literature',
  SCIENCE = 'science',
  ART = 'art',
  HISTORY = 'history',
  PHILOSOPHY = 'philosophy',
  OTHER = 'other',
}
// 图书状态标签
export const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  [BookStatus.AVAILABLE]: '可借阅',
  [BookStatus.LOW_STOCK]: '库存紧张',
  [BookStatus.OUT_OF_STOCK]: '缺货',
  [BookStatus.DELETED]: '已删除',
}

// 图书分类标签
export const BOOK_CATEGORY_LABELS: Record<BookCategory, string> = {
  [BookCategory.COMPUTER]: '计算机',
  [BookCategory.LITERATURE]: '文学',
  [BookCategory.SCIENCE]: '科学',
  [BookCategory.ART]: '艺术',
  [BookCategory.HISTORY]: '历史',
  [BookCategory.PHILOSOPHY]: '哲学',
  [BookCategory.OTHER]: '其他',
}
