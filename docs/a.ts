// User: ['id', 'email', 'password', 'userName', 'avatarUrl', 'phone',
//  'roleId', 'failedLoginAttempts', 'lockUntil', 'createdAt', 'updatedAt', 
// 'deletedAt'],

// Book: ['id', 'isbn', 'name', 'subname', 'originalName', 'author', 
// 'publisher', 'publicationYear', 'stock', 'description', 'createdAt', 
// 'updatedAt', 'deletedAt'],

// Course: ['id', 'name', 'credit', 'description', 'createdAt', 'updatedAt',
//  'deletedAt'],

// Student: ['id', 'name', 'password', 'phone', 'cardId', 'classId',
//  'createdAt', 'updatedAt', 'deletedAt'],

// Role: ['id', 'name', 'createdAt', 'updatedAt', 'deletedAt'],
// Permission: ['id', 'action', 'subject', 'roleId', 'createdAt',
//  'updatedAt', 'deletedAt'],

// Token: ['id', 'userId', 'token', 'type', 'expiresAt', 'createdAt',
//  'updatedAt', 'deletedAt'],

// Class: ['id', 'name', 'description', 'createdAt', 'updatedAt', 'deletedAt'],
// CourseTeaching: ['id', 'courseId', 'teacherId', 'semester', 'year', 
// 'startTime', 'endTime', 'createdAt', 'updatedAt', 'deletedAt'],

// CourseEnrollment: ['id', 'courseId', 'userId', 'teachingId', 'status', 
// 'createdAt', 'updatedAt', 'deletedAt'],

// Borrow: ['id', 'bookId', 'userId', 'status', 'borrowDate', 'dueDate',
//  'returnDate', 'createdAt', 'updatedAt', 'deletedAt'],

// BookReservation: ['id', 'bookId', 'userId', 'status', 'reserveTime', 
// 'expireTime', 'createdAt', 'updatedAt', 'deletedAt'],

// LibrarySeat: ['id', 'seatNumber', 'location', 'status', 'createdAt',
//  'updatedAt', 'deletedAt'],

// SeatReservation: ['id', 'seatId', 'userId', 'status', 'reserveDate', 
// 'startTime', 'endTime', 'createdAt', 'updatedAt', 'deletedAt'],

// SystemNotice: ['id', 'type', 'publisherId', 'title', 'content',
//  'expireAt', 'createdAt', 'updatedAt', 'deletedAt'],

// RuleConfig: ['id', 'rule', 'type', 'createdAt', 'updatedAt', 'deletedAt'],
// Route: ['id', 'path', 'createdAt', 'updatedAt', 'deletedAt']