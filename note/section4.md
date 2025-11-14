# Section 4: 요청에서 정보 추출하기

## 개요

요청 핸들러에서 유입되는 요청의 정보를 추출해야 함:
- **POST 요청**: 요청 본문(body) 추출
- **GET 요청**: URL 경로의 와일드카드 파라미터(예: `:id`) 추출

## HTTP 요청 구조

HTTP 요청은 텍스트로 구성됨:

1. **시작 줄 (Start Line)**
   - 요청 메서드 (GET, POST, PUT, PATCH 등)
   - 전체 경로
   - 사용된 프로토콜

2. **요청 헤더 (Headers)**
   - 여러 줄의 헤더 정보

3. **요청 본문 (Body)**
   - POST, PUT, PATCH 등의 요청에 포함될 수 있음

### 추출 가능한 정보
- 요청 본문 (Body)
- 특정 헤더 (Headers)
- 쿼리 문자열 (Query String)
- URL 파라미터/와일드카드 (예: `/messages/:id`에서 `id`)

## Nest의 요청 정보 추출 데코레이터

### 1. @Param() - URL 파라미터 추출
- URL 경로의 와일드카드 값을 추출
- 사용 예: `@Param('id')` → `/messages/:id`에서 `id` 값 추출

### 2. @Query() - 쿼리 문자열 추출
- URL의 쿼리 문자열 부분 추출
- 예: `/messages?page=1&limit=10`에서 `page`, `limit` 추출

### 3. @Headers() - 헤더 추출
- 요청 헤더에 액세스
- 이 강좌에서는 많이 사용하지 않음

### 4. @Body() - 요청 본문 추출
- POST, PUT, PATCH 요청의 본문(body) 추출
- 가장 많이 사용되는 데코레이터 중 하나

### 데코레이터 임포트
모든 데코레이터는 `@nestjs/common`에서 임포트:
```typescript
import { Body, Param, Query, Headers } from '@nestjs/common';
```

## 데코레이터 유형

### 1. 클래스 데코레이터
- 클래스 전체에 적용
- 예: `@Controller('messages')`

### 2. 메서드 데코레이터
- 메서드 전체에 적용
- 예: `@Get()`, `@Post()`

### 3. 인수 데코레이터 (Argument Decorator)
- 메서드의 인수(파라미터)에 적용
- 예: `@Body()`, `@Param()`, `@Query()`, `@Headers()`
- **인수 리스트 안에 직접 사용**

## 실제 구현 예시

### POST 요청 - 본문 추출
```typescript
@Post()
createMessage(@Body() body: any) {
  console.log(body);
  return {};
}
```

**동작 방식:**
- Nest가 유입되는 요청의 본문을 자동으로 추출
- `@Body()` 데코레이터가 붙은 인수에 본문 데이터를 제공
- `body` 인수에 요청 본문이 자동으로 주입됨

### GET 요청 - URL 파라미터 추출
```typescript
@Get(':id')
findOne(@Param('id') id: string) {
  console.log(id);
  return {};
}
```

**동작 방식:**
- `@Param('id')`에서 `'id'`는 URL 경로의 와일드카드 이름
- 예: `/messages/123` 요청 시 `id`는 `"123"`이 됨
- Nest가 URL에서 해당 파라미터 값을 추출하여 인수에 제공

## 테스트 방법

### REST Client (VSCode 확장 프로그램)
- `.http` 또는 `.rest` 파일 생성
- 요청 작성 및 실행

**예시:**
```http
### POST 요청 테스트
POST http://localhost:3000/messages
Content-Type: application/json

{
  "content": "hi there"
}

### GET 요청 테스트 (ID 파라미터)
GET http://localhost:3000/messages/123123123
```

### Postman 또는 기타 API 클라이언트
- 동일한 방식으로 요청 전송 가능

### 테스트 결과 확인
- 서버 터미널에서 `console.log()` 출력 확인
- POST 요청: 요청 본문이 콘솔에 로깅됨
- GET 요청: URL 파라미터가 콘솔에 로깅됨

## 데코레이터 사용 빈도

### 자주 사용
- **@Body()**: POST, PUT, PATCH 요청에서 매우 자주 사용
- **@Param()**: 동적 라우팅에서 자주 사용

### 가끔 사용
- **@Query()**: 쿼리 문자열이 필요한 경우에만 사용
- **@Headers()**: 특정 헤더 정보가 필요한 경우에만 사용

## 핵심 포인트

1. **인수 데코레이터 사용법**
   - 메서드의 인수 리스트 안에 직접 사용
   - 클래스나 메서드 데코레이터와는 다른 사용 방식

2. **자동 추출**
   - Nest가 요청에서 정보를 자동으로 추출하여 인수에 주입
   - 수동으로 파싱할 필요 없음

3. **타입 지정**
   - `@Body() body: any` - 본문은 초기에는 `any` 타입 사용 가능
   - `@Param('id') id: string` - URL 파라미터는 보통 `string` 타입

4. **데코레이터 이름과 파라미터**
   - `@Param('id')`에서 `'id'`는 URL 경로의 와일드카드 이름과 일치해야 함
   - 예: `@Get(':id')`와 `@Param('id')`에서 `'id'`가 일치

