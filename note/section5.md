# Section 5: 서비스와 리포지토리 이해하기

## 개요

컨트롤러만으로는 메시지를 저장하고 검색할 수 없음. 이를 위해 **MessagesService**와 **MessagesRepository**가 필요함.

## 서비스와 리포지토리의 기본 개념

### 공통점
- **모두 클래스**: Nest에서 만드는 다른 것들과 마찬가지로 클래스로 구현
- **비슷한 메서드 이름**: 서비스와 리포지토리에 동일한 메서드가 있는 것은 매우 흔함
  - 예: `findOne()`, `findAll()`, `create()`

### 서비스 (Service)

#### 역할
- **비즈니스 논리 작성**: 계산을 실행하는 등의 작업
- **리포지토리 사용**: 리포지토리로부터 데이터를 가져올 때 사용
- **데이터 조합**: 여러 리포지토리를 사용하여 다양한 데이터를 받고 결합
- **컨트롤러와 리포지토리 사이의 중간 계층**: 컨트롤러는 서비스와 상호작용

#### 특징
- 리포지토리를 직접 사용하지 않음
- 서비스를 통해 리포지토리에 접근
- 하나의 서비스가 여러 리포지토리를 사용할 수 있음

### 리포지토리 (Repository)

#### 역할
- **스토리지 관련 논리 작성**: 데이터 저장소와 직접 상호작용
- **데이터베이스 상호작용**: 직접 데이터베이스와 통신
- **파일 관리**: 정보를 파일에 작성하거나 읽기
- **저장소 래퍼**: 다른 스토리지 라이브러리를 감싸는 래퍼 역할

#### 우리 프로젝트의 경우
- 모든 메시지를 저장하는 **평문 파일** (`messages.json`) 관리
- 파일로부터 데이터 읽기
- 파일에 데이터 기록

## 서비스와 리포지토리의 관계

### 데이터 흐름
```
Controller → Service → Repository → Storage (파일/DB)
```

### 상호작용 방식
1. **컨트롤러**: 서비스와 상호작용
2. **서비스**: 리포지토리와 상호작용
3. **리포지토리**: 실제 저장소(파일/DB)와 상호작용

### 왜 서비스가 필요한가?

#### 초기에는 불필요해 보일 수 있음
- 서비스의 메서드가 리포지토리의 메서드와 동일해 보임
- 단순히 다른 클래스의 동일한 메서드를 호출하는 것처럼 보임
- 서비스가 불필요한 중복 코드로 보일 수 있음

#### 하지만 서비스가 필요한 이유

1. **다수의 리포지토리 결합**
   - 하나의 서비스가 여러 리포지토리를 사용
   - 다양한 데이터 소스를 결합하여 제공

2. **비즈니스 논리 처리**
   - 단순 데이터 접근이 아닌 계산, 변환, 검증 등
   - 리포지토리는 단순 저장/조회만 담당

3. **테스트 용이성**
   - 서비스를 통해 리포지토리를 모킹하기 쉬움
   - 비즈니스 논리와 데이터 접근 로직 분리

4. **프록시 역할**
   - 리포지토리 앞에 있는 일종의 프록시
   - 추가적인 로직이나 검증을 수행할 수 있음

5. **유연성**
   - 나중에 저장소를 변경해도 서비스 인터페이스는 유지 가능
   - 리포지토리 구현만 변경하면 됨

## 예상되는 메서드 구조

### MessagesRepository 메서드

#### 1. findOne(id: string)
- 파일을 열고 특정 ID로 메시지 찾기
- 목적: 파일에서 개별 메시지 조회

#### 2. findAll()
- 파일을 열고 저장된 모든 메시지 찾기
- 목적: 파일에서 모든 메시지 조회

#### 3. create(content: string)
- 파일을 열고 새 메시지 추가
- 목적: 파일에 새 메시지 저장

### MessagesService 메서드

#### 1. findOne(id: string)
- 리포지토리를 통해 개별 메시지 찾기
- 목적: 리포지토리의 `findOne()` 호출

#### 2. findAll()
- 모든 메시지 찾기
- 목적: 리포지토리의 `findAll()` 호출

#### 3. create(content: string)
- 새 메시지 생성
- 목적: 리포지토리의 `create()` 호출

### 메서드 이름이 동일한 이유
- 서비스는 리포지토리의 메서드를 그대로 호출하는 경우가 많음
- 이는 **정상적이고 흔한 패턴**
- 서비스가 단순히 리포지토리를 감싸는 것처럼 보이지만, 나중에 비즈니스 논리가 추가될 수 있음

## 리포지토리의 다양한 형태

### 직접 구현 (우리 프로젝트)
- 백지 상태부터 리포지토리를 구축
- 파일 읽기/쓰기 직접 구현

### 라이브러리 기반 (일반적인 경우)
- **TypeORM 엔터티**: SQL 데이터베이스용
- **Mongoose 스키마**: MongoDB용
- 기타 ORM/ODM 라이브러리

**장점:**
- 이미 설정과 구성이 완료된 리포지토리 제공
- 처음부터 조립할 필요 없음
- 표준화된 방식으로 데이터 접근

## 핵심 포인트

### 1. 서비스와 리포지토리는 모두 클래스
- Nest에서는 모든 것이 클래스로 구현됨

### 2. 역할 분리
- **서비스**: 비즈니스 논리, 리포지토리 사용
- **리포지토리**: 스토리지 관련 논리, 실제 저장소와 상호작용

### 3. 동일한 메서드 이름은 정상
- 서비스와 리포지토리에 같은 메서드가 있는 것은 흔함
- 서비스가 리포지토리를 단순히 감싸는 것처럼 보여도 문제없음

### 4. 서비스가 필요한 이유
- 다수의 리포지토리 결합
- 비즈니스 논리 처리
- 테스트 용이성
- 유연성과 확장성

### 5. 데이터 흐름
- Controller → Service → Repository → Storage
- 각 계층은 바로 아래 계층과만 상호작용

### 6. 현재는 단순하지만 나중에 복잡해짐
- 지금은 서비스가 단순히 리포지토리를 호출하는 것처럼 보임
- 하지만 나중에 비즈니스 논리가 추가되면 서비스의 가치가 명확해짐

## 다음 단계

다음 동영상부터는:
- MessagesService 구현
- MessagesRepository 구현
- 서비스와 리포지토리를 모듈에 연결
- 컨트롤러에서 서비스 사용

## 예외 처리 (Exception Handling)

### 문제 상황

존재하지 않는 ID로 메시지를 요청할 때:
- 현재: 상태 코드 200 (성공) 반환
- 문제: 메시지를 찾지 못했는데도 성공 응답을 반환함

### 해결 방법: NotFoundException 사용

#### 목표
- 존재하지 않는 메시지 요청 시 **404 상태 코드** 반환
- 적절한 오류 메시지 제공: "죄송합니다만 해당 ID로 된 메시지를 찾을 수 없습니다"

### 구현 단계

#### 1. NotFoundException 임포트
```typescript
import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
```

#### 2. 라우트 핸들러 수정

**변경 전:**
```typescript
@Get(':id')
getMessage(@Param('id') id: string) {
  return this.messagesService.findOne(id);
}
```

**변경 후:**
```typescript
@Get(':id')
async getMessage(@Param('id') id: string) {
  const message = await this.messagesService.findOne(id);
  
  if (!message) {
    throw new NotFoundException('message not found');
  }
  
  return message;
}
```

#### 주요 변경사항
1. **`async` 키워드 추가**: 비동기 메서드로 변경
2. **`await` 사용**: `findOne()`의 Promise 결과를 기다림
3. **변수에 할당**: 결과를 `message` 변수에 저장
4. **검증 로직**: `message`가 없으면 예외 던지기
5. **예외 던지기**: `throw new NotFoundException('message not found')`

### NotFoundException이란?

#### Nest의 내장 예외
- Nest 자체에 정의된 오류 클래스
- HTTP 요청 사이클 중에 던지면 Nest가 자동으로 포착
- 적절한 HTTP 응답으로 자동 변환

#### 동작 방식
1. 예외를 던지면 Nest가 자동으로 포착
2. 예외로부터 정보 추출:
   - 상태 코드: 404
   - 오류 메시지: 전달한 문자열
3. 사용자에게 적절한 형식의 응답으로 변환

### Nest의 다양한 예외들

#### 위치 확인 방법
1. `@nestjs/common`에서 임포트
2. `NotFoundException`에 커서를 두고 `Ctrl + 클릭` (Windows) 또는 `Cmd + 클릭` (Mac)
3. 정의로 이동
4. 파일 탭을 우클릭 → "Reveal in Side Bar"
5. 예외들이 정의된 폴더 확인

#### 주요 예외들
- **NotFoundException (404)**: 리소스를 찾을 수 없음
- **BadRequestException (400)**: 잘못된 요청
- **UnauthorizedException (401)**: 인증 필요
- **ForbiddenException (403)**: 접근 금지
- **InternalServerErrorException (500)**: 서버 내부 오류
- **GatewayTimeoutException (503)**: 타임아웃
- **UnprocessableEntityException (422)**: 처리할 수 없는 엔티티

#### HTTP 표준 준수
- 모든 예외는 HTTP 표준에 설정된 패턴을 따름
- 일반적인 HTTP 상태 코드들이 모두 포함됨

### 자주 사용하는 예외들

1. **NotFoundException**: 가장 많이 사용
2. **BadRequestException**: 잘못된 요청 데이터
3. **UnauthorizedException**: 인증 관련
4. **UnprocessableEntityException**: 검증 실패 등

### 테스트

#### 존재하지 않는 메시지 요청
```http
GET http://localhost:3000/messages/999999
```

**응답:**
- 상태 코드: **404 Not Found**
- 메시지: "message not found"
- 적절한 오류 형식으로 반환

### 예외 처리 핵심 포인트

1. **자동 변환**
   - Nest가 예외를 자동으로 적절한 HTTP 응답으로 변환
   - 수동으로 상태 코드나 응답 형식을 지정할 필요 없음

2. **표준 준수**
   - HTTP 표준에 맞는 상태 코드 사용
   - RESTful API 설계 원칙 준수

3. **사용자 경험**
   - 명확한 오류 메시지 제공
   - 적절한 상태 코드로 클라이언트가 오류를 처리하기 쉬움

4. **간단한 사용법**
   - `throw new NotFoundException('메시지')`만으로 충분
   - 복잡한 설정 불필요

### 다음 단계

- 의존성 주입(Dependency Injection) 학습
- 생성자에서 서비스 주입 방식 개선

## 현재 Service 코드 분석: 의존성 주입 패턴의 개선점

### 현재 구현 코드

```1:30:src/messages/messages.service.ts
import { MessagesRepository } from './messages.repository';

interface Repository {
    findOne(id: string);
    findAll();
    create(content: string);
}


export class MessagesService {

    messagesRepo: Repository;

    constructor(repo: Repository) {
        this.messagesRepo = repo;
    }

    findOne(id: string) {
        return this.messagesRepo.findOne(id);
    }

    findAll() {
        return this.messagesRepo.findAll();
    }

    create(content: string) {
        return this.messagesRepo.create(content);
    }
    
}
```

### 이전 버전과의 비교

#### 이전 버전의 문제점 (추정)
이전에는 아마도 다음과 같은 방식이었을 것입니다:

**잠재적 이전 구현:**
```typescript
export class MessagesService {
    messagesRepo: MessagesRepository;

    constructor() {
        // Repository를 직접 생성 - 강한 결합
        this.messagesRepo = new MessagesRepository();
    }
    
    // ... 메서드들
}
```

**또는:**
```typescript
export class MessagesService {
    // Repository 없이 직접 파일 접근 - 책임 혼재
    async findOne(id: string) {
        const contents = await readFile('messages.json', 'utf8');
        // ... 직접 파일 처리
    }
}
```

### 현재 코드가 더 나은 이유

#### 1. **의존성 주입 (Dependency Injection) 패턴**

**현재 코드:**
- 생성자에서 `Repository` 인터페이스를 주입받음
- Service가 Repository의 구체적인 구현을 알 필요가 없음
- 외부에서 의존성을 주입하여 제어가 역전됨

**장점:**
- **느슨한 결합 (Loose Coupling)**: Service와 Repository가 서로 강하게 결합되지 않음
- **제어의 역전 (Inversion of Control)**: 의존성 생성과 관리를 외부에 위임
- **단일 책임 원칙 (SRP)**: Service는 비즈니스 로직에만 집중

#### 2. **인터페이스를 통한 추상화**

**현재 코드:**
```typescript
interface Repository {
    findOne(id: string);
    findAll();
    create(content: string);
}
```

**장점:**
- **추상화**: 구체적인 구현이 아닌 인터페이스에 의존
- **다형성**: 다양한 Repository 구현체를 주입 가능
- **계약 기반 설계**: 인터페이스가 Service와 Repository 간의 계약을 정의

**예시 활용:**
```typescript
// 테스트용 Mock Repository
class MockRepository implements Repository {
    findOne(id: string) { return { id, content: 'test' }; }
    findAll() { return {}; }
    create(content: string) { return { id: '1', content }; }
}

// 실제 Repository
class MessagesRepository implements Repository {
    // 실제 파일 I/O 구현
}

// 동일한 Service에 다른 구현체 주입 가능
const testService = new MessagesService(new MockRepository());
const realService = new MessagesService(new MessagesRepository());
```

#### 3. **테스트 용이성 향상**

**이전 방식의 문제:**
- Repository를 직접 생성하면 실제 파일 시스템에 접근
- 테스트 시 실제 파일을 읽고 써야 함
- 테스트 격리 어려움

**현재 방식의 장점:**
- Mock Repository를 쉽게 주입 가능
- 실제 파일 시스템 없이 테스트 가능
- 단위 테스트 작성이 간단해짐

**테스트 예시:**
```typescript
describe('MessagesService', () => {
    it('should find a message', () => {
        const mockRepo = {
            findOne: jest.fn().mockReturnValue({ id: '1', content: 'test' })
        };
        const service = new MessagesService(mockRepo);
        
        const result = service.findOne('1');
        
        expect(result).toEqual({ id: '1', content: 'test' });
        expect(mockRepo.findOne).toHaveBeenCalledWith('1');
    });
});
```

#### 4. **유연성과 확장성**

**다양한 Repository 구현체 교체 가능:**
```typescript
// 파일 기반 Repository
class FileMessagesRepository implements Repository { ... }

// 데이터베이스 기반 Repository
class DatabaseMessagesRepository implements Repository { ... }

// 메모리 기반 Repository (테스트용)
class InMemoryMessagesRepository implements Repository { ... }

// 모두 동일한 Service에 주입 가능
const service1 = new MessagesService(new FileMessagesRepository());
const service2 = new MessagesService(new DatabaseMessagesRepository());
const service3 = new MessagesService(new InMemoryMessagesRepository());
```

#### 5. **SOLID 원칙 준수**

**단일 책임 원칙 (SRP):**
- Service: 비즈니스 로직만 담당
- Repository: 데이터 접근만 담당

**개방-폐쇄 원칙 (OCP):**
- Service는 수정 없이 새로운 Repository 구현체를 받을 수 있음
- 확장에는 열려있고 수정에는 닫혀있음

**의존성 역전 원칙 (DIP):**
- 구체적인 구현이 아닌 추상화(인터페이스)에 의존
- 고수준 모듈(Service)이 저수준 모듈(Repository 구현체)에 의존하지 않음

### 설계 패턴 관점에서의 개선

#### 1. **의존성 주입 패턴 (Dependency Injection)**
- 의존성을 외부에서 주입받아 결합도를 낮춤
- NestJS의 핵심 설계 원칙과 일치

#### 2. **전략 패턴 (Strategy Pattern)**
- 다양한 Repository 구현체를 전략으로 교체 가능
- 런타임에 알고리즘(저장 방식)을 선택 가능

#### 3. **어댑터 패턴 (Adapter Pattern)**
- 인터페이스를 통해 서로 다른 구현체를 통일된 방식으로 사용

### 실제 코드에서의 활용 예시

**컨트롤러에서의 사용:**
```typescript
@Controller('messages')
export class MessagesController {
    messagesService: MessagesService;

    constructor() {
        // Repository를 생성하여 Service에 주입
        const repo = new MessagesRepository();
        this.messagesService = new MessagesService(repo);
    }
}
```

**향후 NestJS 의존성 주입 시스템 활용:**
```typescript
// NestJS가 자동으로 의존성을 주입
@Injectable()
export class MessagesService {
    constructor(private messagesRepo: MessagesRepository) {}
}
```

### 핵심 개선 요약

| 측면 | 이전 방식 (추정) | 현재 방식 | 개선점 |
|------|----------------|----------|--------|
| **결합도** | 강한 결합 (직접 생성) | 느슨한 결합 (주입) | 유연성 향상 |
| **테스트** | 실제 파일 필요 | Mock 주입 가능 | 테스트 용이성 |
| **확장성** | 구현 변경 필요 | 인터페이스 교체 | 확장 용이 |
| **추상화** | 구체적 구현 의존 | 인터페이스 의존 | 다형성 활용 |
| **책임 분리** | 혼재 가능성 | 명확한 분리 | 단일 책임 |

### 결론

현재 Service 코드는 **의존성 주입 패턴**을 통해 다음과 같은 이점을 제공합니다:

1. ✅ **테스트 가능성**: Mock 객체 주입으로 단위 테스트 용이
2. ✅ **유연성**: 다양한 Repository 구현체로 교체 가능
3. ✅ **유지보수성**: 인터페이스 기반으로 변경 영향 최소화
4. ✅ **확장성**: 새로운 저장소 방식 추가 시 Service 수정 불필요
5. ✅ **SOLID 원칙 준수**: 객체지향 설계 원칙을 따름

이러한 설계는 NestJS의 의존성 주입 시스템과 완벽하게 호환되며, 향후 NestJS의 `@Injectable()` 데코레이터와 자동 의존성 주입으로 자연스럽게 전환할 수 있는 기반을 제공합니다.

## NestJS 의존성 주입 시스템으로의 리팩토링

### 최종 구현 코드

#### MessagesService
```1:20:src/messages/messages.service.ts
import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessagesService {
    constructor(public messagesRepo: MessagesRepository) {}

    findOne(id: string) {
        return this.messagesRepo.findOne(id);
    }

    findAll() {
        return this.messagesRepo.findAll();
    }

    create(content: string) {
        return this.messagesRepo.create(content);
    }
    
}
```

#### MessagesController
```1:33:src/messages/messages.controller.ts
import { Controller , Get, Post, Param, Body, NotFoundException} from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessagesService } from './messages.service';


@Controller('messages')
export class MessagesController {
    constructor(public messagesService: MessagesService) {}

    @Get()
    listMessages() {
        return this.messagesService.findAll();
    }

    @Post()
    createMessage( @Body() body: CreateMessageDto ) {
        return this.messagesService.create(body.content);
    }

    @Get('/:id')
    async getMessage( @Param('id') id: string) {
        const message = await this.messagesService.findOne(id);

        if (!message) { 
            throw new NotFoundException('message not found');
        }

        return message;
    }


}
```

#### MessagesRepository
```1:34:src/messages/messages.repository.ts
import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';

@Injectable()
export class MessagesRepository {

    async findOne(id: string) {
        const contents = await readFile('messages.json', 'utf8');
        const messages = JSON.parse(contents);

        return messages[id];
    }

    async findAll() {
        const contents = await readFile('messages.json', 'utf8');
        const messages = JSON.parse(contents);

        return messages;
    }

    async create(content: string) {
        const contents = await readFile('messages.json', 'utf8');
        const messages = JSON.parse(contents);

        const id = Math.floor(Math.random() * 1000000);

        messages[id] = { id, content };

        await writeFile('messages.json', JSON.stringify(messages, null, 2));

        return messages[id];
    }

}
```

#### MessagesModule
```1:11:src/messages/messages.module.ts
import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesRepository } from './messages.repository';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository],
})
export class MessagesModule {}
```

### 주요 변경사항

#### 1. `@Injectable()` 데코레이터 추가
- **Service와 Repository에 추가**: NestJS가 이 클래스들을 DI 컨테이너에서 관리할 수 있도록 표시
- **역할**: NestJS에게 "이 클래스는 의존성 주입이 가능한 클래스입니다"라고 알려줌

#### 2. 생성자에서 직접 의존성 주입
**이전 방식:**
```typescript
export class MessagesService {
    messagesRepo: Repository;
    
    constructor(repo: Repository) {
        this.messagesRepo = repo;
    }
}
```

**현재 방식:**
```typescript
@Injectable()
export class MessagesService {
    constructor(public messagesRepo: MessagesRepository) {}
}
```

**개선점:**
- `public` 키워드로 자동으로 프로퍼티 선언과 할당이 한 번에 처리됨
- NestJS가 자동으로 `MessagesRepository` 인스턴스를 생성하여 주입
- 수동으로 인스턴스를 생성할 필요 없음

#### 3. Module에 Providers 등록
- `MessagesModule`의 `providers` 배열에 `MessagesService`와 `MessagesRepository` 등록
- NestJS가 이 클래스들의 인스턴스를 관리

### Better vs Best 패턴: 왜 인터페이스를 사용하지 않는가?

#### Best 패턴 (이상적)
```typescript
// 인터페이스 기반
interface Repository {
    findOne(id: string);
    findAll();
    create(content: string);
}

@Injectable()
export class MessagesService {
    constructor(private messagesRepo: Repository) {}
}
```

**장점:**
- 다양한 구현체를 쉽게 교체 가능
- 완전한 추상화
- 테스트 시 Mock 객체 주입이 더 명확

#### Better 패턴 (현재 사용)
```typescript
// 구체적인 클래스 타입 사용
@Injectable()
export class MessagesService {
    constructor(public messagesRepo: MessagesRepository) {}
}
```

**왜 Better 패턴을 사용하는가?**

1. **TypeScript의 제한사항**
   - TypeScript에서 인터페이스는 런타임에 존재하지 않음 (타입 정보만 존재)
   - NestJS의 DI 컨테이너는 런타임에 타입 정보를 기반으로 의존성을 해결해야 함
   - 인터페이스를 직접 주입받으려면 추가적인 트릭이 필요함

2. **NestJS의 가정**
   - NestJS는 모든 서비스, 리포지토리, 컨트롤러가 프로젝트 내의 다른 클래스를 직접 참조한다고 가정
   - 이는 NestJS의 표준 패턴이며, 대부분의 경우 충분히 잘 작동함

3. **실용성**
   - 대부분의 프로젝트에서 하나의 구현체만 사용
   - 인터페이스 없이도 테스트는 충분히 가능 (클래스 자체를 Mock으로 교체 가능)

**참고:**
- Best 패턴을 사용하는 방법도 있지만, 추가적인 설정과 트릭이 필요
- 현재는 Better 패턴으로 시작하고, 필요시 Best 패턴으로 전환 가능

### DI 컨테이너의 싱글톤 인스턴스 관리

#### 핵심 개념

**DI 컨테이너는 생성한 모든 인스턴스를 내부에 저장하고 재사용합니다.**

#### 동작 방식

1. **인스턴스 생성 및 저장**
   - 컨테이너가 `MessagesService` 인스턴스를 생성할 때, 그 인스턴스를 내부 리스트에 저장
   - 이후 같은 타입의 의존성이 요청되면 새로 생성하지 않고 저장된 인스턴스를 재사용

2. **싱글톤 패턴**
   - 애플리케이션 전체에서 같은 타입의 서비스는 하나의 인스턴스만 존재
   - 여러 클래스가 같은 서비스를 요청해도 동일한 인스턴스를 공유

#### 실증 예시

**컨트롤러에서 여러 개의 의존성 요청:**
```typescript
@Controller('messages')
export class MessagesController {
    constructor(
        public messagesService: MessagesService,
        public messagesService2: MessagesService,
        public messagesService3: MessagesService
    ) {
        // 모두 같은 인스턴스
        console.log(messagesService === messagesService2); // true
        console.log(messagesService2 === messagesService3); // true
    }
}
```

**결과:**
- `MessagesService`의 인스턴스는 **하나만 생성**됨
- 세 개의 파라미터 모두 **동일한 인스턴스**를 받음
- 컨테이너가 생성한 인스턴스를 재사용

#### 설계에 미치는 영향

**중요한 고려사항:**
- 서비스는 애플리케이션 전체에서 **공유되는 상태**를 가질 수 있음
- 여러 위치에서 같은 서비스 인스턴스를 사용하므로, 서비스 내부의 상태 변경이 다른 곳에 영향을 줄 수 있음
- 서비스를 설계할 때는 항상 **싱글톤 인스턴스**라고 가정하고 설계해야 함

**새로운 인스턴스가 필요한 경우:**
- 특정 상황에서 항상 새로운 인스턴스가 필요하다면, NestJS에서 이를 설정하는 방법이 있음
- 하지만 대부분의 경우 싱글톤 패턴이 적절함

### 의존성 주입의 주요 이점

#### 1. 테스트 용이성 (가장 큰 이점)

**의존성 주입을 사용하지 않았을 때:**
```typescript
export class MessagesService {
    private messagesRepo = new MessagesRepository();
    
    findOne(id: string) {
        return this.messagesRepo.findOne(id);
    }
}
```

**문제점:**
- 실제 파일 시스템에 접근해야 함
- 테스트마다 실제 파일을 읽고 써야 함
- 테스트 격리가 어려움
- 느리고 복잡한 테스트

**의존성 주입을 사용했을 때:**
```typescript
@Injectable()
export class MessagesService {
    constructor(public messagesRepo: MessagesRepository) {}
    
    findOne(id: string) {
        return this.messagesRepo.findOne(id);
    }
}
```

**장점:**
- Mock Repository를 쉽게 주입 가능
- 실제 파일 시스템 없이 테스트 가능
- 빠르고 격리된 단위 테스트 작성 가능

**테스트 예시:**
```typescript
describe('MessagesService', () => {
    it('should find a message', () => {
        // Mock Repository 생성
        const mockRepo = {
            findOne: jest.fn().mockResolvedValue({ id: '1', content: 'test' })
        };
        
        // Mock을 주입하여 Service 생성
        const service = new MessagesService(mockRepo);
        
        // 테스트 실행
        const result = await service.findOne('1');
        
        // 검증
        expect(result).toEqual({ id: '1', content: 'test' });
        expect(mockRepo.findOne).toHaveBeenCalledWith('1');
    });
});
```

#### 2. 코드 재사용성
- 서비스를 여러 컨트롤러에서 재사용 가능
- 비즈니스 로직을 한 곳에 집중

#### 3. 유지보수성
- 의존성 변경 시 한 곳만 수정하면 됨
- 코드 구조가 명확하고 이해하기 쉬움

#### 4. 느슨한 결합
- 클래스 간의 의존성이 명시적으로 드러남
- 변경 영향 범위가 명확함

### DI가 필요하지 않은 경우?

**솔직한 고민:**
- 때로는 DI가 불필요한 복잡성을 추가하는 것처럼 느껴질 수 있음
- 작은 프로젝트에서는 수동으로 인스턴스를 생성하는 것이 더 간단할 수도 있음

**하지만:**
- **테스트를 작성한다면**: DI는 필수적이며 매우 큰 이점을 제공
- **테스트를 작성하지 않는다면**: DI의 이점을 충분히 활용하지 못할 수 있음

**결론:**
- NestJS는 DI를 핵심으로 하는 프레임워크
- 테스트를 작성할 계획이라면 DI는 필수
- 테스트를 전혀 작성하지 않을 계획이라면, NestJS가 최적의 선택이 아닐 수 있음

### NestJS DI 시스템의 동작 과정

#### 1. 컨트롤러 생성 요청
```
NestJS가 MessagesController를 생성해야 할 때
```

#### 2. DI 컨테이너 확인
```
컨테이너가 MessagesController의 생성자 파라미터 확인
→ MessagesService가 필요함을 발견
```

#### 3. 의존성 해결
```
컨테이너가 MessagesService를 확인
→ MessagesRepository가 필요함을 발견
→ MessagesRepository는 더 이상 의존성이 없음
```

#### 4. 인스턴스 생성 순서
```
1. MessagesRepository 인스턴스 생성 및 저장
2. MessagesService 인스턴스 생성 (Repository 주입) 및 저장
3. MessagesController 인스턴스 생성 (Service 주입)
```

#### 5. 인스턴스 재사용
```
다른 곳에서 MessagesService가 필요하면
→ 저장된 인스턴스를 재사용 (새로 생성하지 않음)
```

### 핵심 정리

#### NestJS DI 시스템의 특징

1. **`@Injectable()` 데코레이터**
   - DI 컨테이너에서 관리할 클래스에 표시
   - Service, Repository, Controller 등에 사용

2. **생성자 주입**
   - 생성자 파라미터로 의존성 선언
   - NestJS가 자동으로 주입

3. **Module의 Providers**
   - `@Module` 데코레이터의 `providers` 배열에 등록
   - 해당 모듈 내에서만 사용 가능한 의존성 정의

4. **싱글톤 인스턴스**
   - 같은 타입의 의존성은 하나의 인스턴스만 생성
   - 애플리케이션 전체에서 공유

5. **자동 의존성 해결**
   - NestJS가 의존성 그래프를 자동으로 분석
   - 올바른 순서로 인스턴스 생성 및 주입

#### 왜 이렇게 설계되었는가?

- **테스트 용이성**: Mock 객체 주입이 쉬움
- **코드 재사용**: 비즈니스 로직을 여러 곳에서 공유
- **유지보수성**: 의존성 변경이 쉬움
- **확장성**: 새로운 기능 추가가 용이

#### 다음 단계

- 테스트 작성 시 DI의 진정한 가치를 경험하게 됨
- 더 복잡한 의존성 구조에서도 동일한 패턴 적용
- 필요시 Best 패턴(인터페이스 기반)으로 전환 가능