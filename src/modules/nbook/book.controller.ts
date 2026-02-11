import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { BookService } from './book.service'
import { CreateDto, UpdateDto, QueryDto } from './dto'
import { Book } from './entities'
import { BookSummaryDto, BookDetailDto, BookFrontendDto } from './dto/response.dto'

@ApiTags('book')
@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  @ApiOperation({ summary: '获取图书列表' })
  @ApiResponse({ status: 200, description: '成功获取图书列表' })
  async findAll(@Query() query: QueryDto) {
    const result = await this.bookService.findAll(query)
    return {
      ...result,
      data: BookFrontendDto.fromEntities(result.data),
    }
  }

  @Get('summary')
  @ApiOperation({ summary: '获取图书摘要列表' })
  @ApiResponse({ status: 200, description: '成功获取图书摘要' })
  async findAllSummary(@Query() query: QueryDto) {
    const result = await this.bookService.findAll(query)
    return {
      ...result,
      data: BookSummaryDto.fromEntities(result.data),
    }
  }

  @Get(':id')
  @ApiOperation({ summary: '获取图书详情' })
  @ApiResponse({ status: 200, description: '成功获取图书详情' })
  async findById(@Param('id') id: number) {
    const book = await this.bookService.findById(id)
    return BookDetailDto.fromEntity(book)
  }

  @Get('isbn/:isbn')
  @ApiOperation({ summary: '根据ISBN获取图书' })
  @ApiResponse({ status: 200, description: '成功获取图书' })
  async findByIsbn(@Param('isbn') isbn: string) {
    const book = await this.bookService.findByIsbn(isbn)
    return BookDetailDto.fromEntity(book)
  }

  @Get(':id/status')
  @ApiOperation({ summary: '获取图书状态' })
  @ApiResponse({ status: 200, description: '成功获取图书状态' })
  async getStatus(@Param('id') id: number) {
    return this.bookService.getBookStatus(id)
  }

  @Get(':id/due-date')
  @ApiOperation({ summary: '获取图书借阅到期日期' })
  @ApiResponse({ status: 200, description: '成功获取到期日期' })
  async getDueDate(@Param('id') id: number, @Query('borrowDate') borrowDate?: string) {
    const date = borrowDate ? new Date(borrowDate) : undefined
    const dueDate = await this.bookService.getDueDate(id, date)
    return { dueDate: dueDate.toISOString() }
  }

  @Post()
  @ApiOperation({ summary: '创建图书' })
  @ApiResponse({ status: 201, description: '成功创建图书' })
  async create(@Body() createDto: CreateDto) {
    const book = await this.bookService.create(createDto)
    return BookDetailDto.fromEntity(book)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新图书' })
  @ApiResponse({ status: 200, description: '成功更新图书' })
  async update(@Param('id') id: number, @Body() updateDto: UpdateDto) {
    const book = await this.bookService.update(id, updateDto)
    return BookDetailDto.fromEntity(book)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除图书' })
  @ApiResponse({ status: 200, description: '成功删除图书' })
  async delete(@Param('id') id: number) {
    const book = await this.bookService.delete(id)
    return BookDetailDto.fromEntity(book)
  }

  @Post(':id/restore')
  @ApiOperation({ summary: '恢复已删除图书' })
  @ApiResponse({ status: 200, description: '成功恢复图书' })
  async restore(@Param('id') id: number) {
    const book = await this.bookService.restore(id)
    return BookDetailDto.fromEntity(book)
  }

  @Post(':id/borrow')
  @ApiOperation({ summary: '借阅图书' })
  @ApiResponse({ status: 200, description: '成功借阅图书' })
  async borrow(@Param('id') id: number) {
    const book = await this.bookService.borrow(id)
    return BookDetailDto.fromEntity(book)
  }

  @Post(':id/return')
  @ApiOperation({ summary: '归还图书' })
  @ApiResponse({ status: 200, description: '成功归还图书' })
  async returnBook(@Param('id') id: number) {
    const book = await this.bookService.returnBook(id)
    return BookDetailDto.fromEntity(book)
  }

  @Post(':id/restock')
  @ApiOperation({ summary: '补货' })
  @ApiResponse({ status: 200, description: '成功补货' })
  async restock(@Param('id') id: number, @Body('quantity') quantity: number) {
    const book = await this.bookService.restock(id, quantity)
    return BookDetailDto.fromEntity(book)
  }

  @Get('search/:keyword')
  @ApiOperation({ summary: '搜索图书' })
  @ApiResponse({ status: 200, description: '成功搜索图书' })
  async search(@Param('keyword') keyword: string) {
    const books = await this.bookService.search(keyword)
    return BookFrontendDto.fromEntities(books)
  }

  @Get('restock/suggestions')
  @ApiOperation({ summary: '获取补货建议' })
  @ApiResponse({ status: 200, description: '成功获取补货建议' })
  async getRestockSuggestions() {
    const suggestions = await this.bookService.getRestockSuggestions()
    return suggestions.map(item => ({
      book: BookDetailDto.fromEntity(item.book),
      quantity: item.quantity,
    }))
  }

  @Post('validate')
  @ApiOperation({ summary: '验证图书数据' })
  @ApiResponse({ status: 200, description: '成功验证图书数据' })
  async validate(@Body() data: CreateDto | UpdateDto) {
    return this.bookService.validateBook(data)
  }
}
