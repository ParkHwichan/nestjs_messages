# Section 4: 파이프로 요청 데이터 검증하기

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

## ValidationPipe를 사용한 요청 데이터 검증

### 검증의 필요성

POST 요청 핸들러에서 유입되는 데이터를 검증해야 함:
- 요청 본문에 문자열 타입의 `content` 속성이 있어야 함
- 데이터가 무효한 경우 (예: `content` 속성 없음, 숫자 타입 등) 요청을 거부해야 함
- **파이프(Pipe)**를 사용하여 라우트 핸들러에 도달하기 전에 검증 수행

### 파이프의 역할

- 앱에 유입되는 데이터가 라우트 핸들러에 도달하기 **전에** 검증
- `createMessage()` 메서드 실행 전에 본문이 올바른 형식인지 확실히 보장
- 무효한 요청은 컨트롤러에 도달하기 전에 요청자에게 반환

### ValidationPipe 소개

- **NestJS에 내장된 파이프**
- Nest가 제공하는 표준 검증 파이프
- 대부분의 프로젝트에서 사용하게 될 파이프
- 직접 파이프를 만들 수도 있지만, 보통은 ValidationPipe 사용

### 전역 파이프 설정

#### main.ts에 ValidationPipe 추가

```typescript
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MessagesModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
```

#### 설정 단계
1. `@nestjs/common`에서 `ValidationPipe` 임포트
2. `NestFactory.create()` 직후에 `app.useGlobalPipes(new ValidationPipe())` 추가

### useGlobalPipes()의 역할

- **전역 파이프 적용**: 애플리케이션의 모든 요청에 파이프 적용
- 개별 라우트 핸들러에 파이프를 적용할 수도 있지만, 이 경우는 전역 적용
- 유입되는 모든 요청을 검증하려는 경우 전역 파이프 사용

### ValidationPipe의 동작 방식

#### 스마트한 검증
- ValidationPipe는 매우 스마트함
- 특정 핸들러에 검증 규칙을 추가하지 않으면 해당 핸들러에서는 작동하지 않음
- **사용 설정(opt-in) 방식**: 검증 규칙을 명시적으로 추가한 핸들러만 검증

#### 검증 범위
- 모든 요청에 파이프가 적용되지만
- 실제로는 검증 규칙이 설정된 특정 경로만 검증됨
- 초기 연결만 설정하고, 실제 검증 규칙은 다음 단계에서 설정

## ValidationPipe 사용하기 - 단계별 가이드

### 전체 단계 개요

**1단계**: ValidationPipe 전역 연결 (한 번만 수행)
- `main.ts`에 `app.useGlobalPipes(new ValidationPipe())` 추가
- 이미 완료됨

**2-4단계**: 특정 라우트 핸들러에 검증 적용 (각 핸들러마다 반복)
- 유입되는 요청 본문을 검증하는 핸들러마다 2-4단계를 반복 수행

### 2단계: DTO 클래스 생성

#### DTO란?
- **Data Transfer Object (데이터 전송 객체)**
- 유입되는 요청이 가져야 할 모든 속성을 기술하는 클래스
- 간단히 **DTO**라고 부름

#### 작업 내용
1. `src/messages/` 디렉터리 안에 `dtos` 폴더 생성
2. `dtos` 폴더 안에 `create-message.dto.ts` 파일 생성
3. DTO 클래스 작성:

```typescript
export class CreateMessageDto {
  content: string;
}
```

**설명:**
- POST 요청 핸들러가 받을 것으로 예상하는 모든 속성을 나열
- 예: `content` 속성은 `string` 타입이어야 함

### 3단계: 검증 데코레이터 추가

#### 필요한 라이브러리 설치
```bash
npm install class-validator class-transformer
```

**설치 후 서버 재시작:**
```bash
npm run start:dev
```

#### 검증 데코레이터 적용
1. `create-message.dto.ts` 파일 상단에 임포트 추가:
```typescript
import { IsString } from 'class-validator';
```

2. 클래스 속성에 데코레이터 적용:
```typescript
import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content: string;
}
```

**설명:**
- `@IsString()` 데코레이터는 `class-validator` 라이브러리에서 제공
- `content` 속성이 실제로 문자열인지 검증
- `number`, `undefined`, `null` 등이면 검증 실패

### 4단계: 컨트롤러에 DTO 적용

#### 작업 내용
1. `messages.controller.ts` 파일 상단에 DTO 임포트:
```typescript
import { CreateMessageDto } from './dtos/create-message.dto';
```

2. POST 요청 핸들러에서 `@Body()`의 타입 변경:
```typescript
@Post()
createMessage(@Body() body: CreateMessageDto) {
  console.log(body);
  return {};
}
```

**변경 사항:**
- `@Body() body: any` → `@Body() body: CreateMessageDto`
- 타입만 변경하면 자동으로 검증이 적용됨

### 검증 테스트

#### 유효한 요청
```http
POST http://localhost:3000/messages
Content-Type: application/json

{
  "content": "hi there"
}
```
- ✅ 성공: 정상적으로 처리됨

#### 무효한 요청들

**1. 숫자 타입:**
```http
POST http://localhost:3000/messages
Content-Type: application/json

{
  "content": 123
}
```
- ❌ 오류: "content must be a string"

**2. null 값:**
```http
POST http://localhost:3000/messages
Content-Type: application/json

{
  "content": null
}
```
- ❌ 오류: "content must be a string"

**3. 속성 누락:**
```http
POST http://localhost:3000/messages
Content-Type: application/json

{}
```
- ❌ 오류 발생

**4. 속성 이름 오타:**
```http
POST http://localhost:3000/messages
Content-Type: application/json

{
  "contnt": "hi there"
}
```
- ❌ 오류 발생

### 작업 체크리스트

#### 2단계: DTO 생성
- [ ] `src/messages/dtos/` 폴더 생성
- [ ] `create-message.dto.ts` 파일 생성
- [ ] `CreateMessageDto` 클래스 작성
- [ ] 예상되는 모든 속성 나열

#### 3단계: 검증 데코레이터 추가
- [ ] `class-validator` 및 `class-transformer` 설치
- [ ] `IsString` 데코레이터 임포트
- [ ] 속성에 `@IsString()` 데코레이터 적용

#### 4단계: 컨트롤러에 적용
- [ ] 컨트롤러에 DTO 임포트
- [ ] `@Body()` 타입을 `CreateMessageDto`로 변경

#### 테스트
- [ ] 유효한 요청 테스트 (문자열 content)
- [ ] 무효한 요청 테스트 (숫자, null, 누락, 오타 등)

### 핵심 포인트

1. **1단계는 한 번만**
   - ValidationPipe 전역 연결은 프로젝트 시작 시 한 번만 수행

2. **2-4단계는 반복**
   - 검증이 필요한 각 라우트 핸들러마다 2-4단계 반복

3. **타입만 변경하면 검증 적용**
   - `@Body()`의 타입을 DTO로 변경하면 자동으로 검증 시작
   - TypeScript 타입 정보가 런타임 검증으로 변환됨

4. **검증 데코레이터**
   - `@IsString()` 외에도 다양한 검증 데코레이터 존재
   - `class-validator` 라이브러리에서 제공


