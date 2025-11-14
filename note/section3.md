# Section 3: Nest CLI를 사용한 프로젝트 생성

## 프로젝트 시작 방식

### 첫 번째 프로젝트의 접근 방식
- 아주 작은 프로젝트로 시작
- Nest CLI 없이 수동으로 최소한의 파일만 생성
- Nest를 시작하고 실행하는 데 필요한 코드가 적다는 사실을 이해하기 위함
- Nest CLI로 자동 생성하면 많은 파일/폴더가 생성되어 이해하기 어려울 수 있음

### 두 번째 프로젝트: Nest CLI 사용
- Nest CLI를 전역 설치: `npm install -g @nestjs/cli` (또는 `sudo npm install -g @nestjs/cli`)
- 새 프로젝트 생성: `nest new messages`
- 패키지 관리자 선택 (npm 권장)
- 의존성 자동 설치

## 애플리케이션 개요

### 목표
- **간단한 메시지 저장/검색 애플리케이션**
- 일반 JSON 파일에 메시지(문자열) 저장
- 저장된 메시지 검색

### API 경로 설계
1. **GET /messages** - 모든 메시지 목록 조회
2. **POST /messages** - 새 메시지 생성
3. **GET /messages/:id** - ID로 특정 메시지 조회

## 각 요청에 필요한 NestJS 구성 요소 분석

### 1. GET /messages (메시지 목록 조회)
- **컨트롤러**: 요청을 특정 함수로 라우팅
- **서비스**: 데이터베이스/리포지토리 접근 및 모든 메시지 리스트 조회 로직
- **리포지토리**: 메시지를 저장하는 파일(데이터베이스) 접근
- **파이프**: 불필요 (검증할 데이터 없음)
- **가드**: 불필요 (인증/인가 없음)

### 2. POST /messages (메시지 생성)
- **파이프**: 필요 (요청 본문 데이터 검증 - 콘텐츠가 문자열인지, 길이 제한 등)
- **컨트롤러**: 라우팅 로직
- **서비스**: 메시지 생성 로직
- **리포지토리**: 메시지 저장
- **가드**: 불필요 (인증/인가 없음)

### 3. GET /messages/:id (특정 메시지 조회)
- **컨트롤러**: 라우팅 로직
- **서비스**: ID로 메시지 조회 로직
- **리포지토리**: 메시지 조회
- **파이프**: 불필요
- **가드**: 불필요

## 필요한 클래스 구조

### 전체 구조
- **컨트롤러**: 1개 (`MessagesController`) - 모든 메시지 관련 요청 처리
- **서비스**: 1개 (`MessagesService`) - 메시지 처리 비즈니스 로직
- **리포지토리**: 1개 (`MessagesRepository`) - 메시지 저장소 접근
- **파이프**: 1개 (POST 요청의 데이터 검증용)
- **모듈**: 1개 (`AppModule` 또는 `MessagesModule`) - 모든 클래스들을 그룹화

### 명명 규칙
- 컨트롤러: `MessagesController`
- 서비스: `MessagesService`
- 리포지토리: `MessagesRepository`
- 모듈: `AppModule` 또는 `MessagesModule` (적절한 이름은 추후 결정)

## 핵심 포인트

1. **각 요청마다 별도의 클래스를 만드는 것이 아님**
   - 하나의 컨트롤러, 서비스, 리포지토리로 모든 요청 처리

2. **각 요청을 어떻게 처리할지 먼저 생각**
   - 필요한 구성 요소 파악 후 구현

3. **모듈의 역할**
   - 앱의 기능이나 클래스 그룹들을 감싸는 컨테이너
   - 컨트롤러, 서비스, 리포지토리, 파이프 등을 모듈로 그룹화

## 프로젝트 생성 후 설정

### package.json의 주요 스크립트
- **`start:dev`**: 개발 모드에서 프로젝트 시작
  - 프로젝트 변경 시 서버가 자동으로 재시작됨
  - 실행: `npm run start:dev`

### ESLint 설정
- Nest는 기본적으로 ESLint를 사용
- ESLint는 코드를 자동으로 확인하고 오류나 형식화 이슈를 지적
- **비활성화 방법**: `eslintrc.js` 파일의 모든 내용을 주석 처리
  - TypeScript가 이미 많은 오류를 잡아주므로 ESLint가 불필요할 수 있음
  - 원한다면 ESLint를 유지해도 무방

## src 폴더 구조

### 자동 생성된 파일들
- `main.ts`: 애플리케이션 진입점 (이전에 수동으로 만든 파일과 동일)
- `app.module.ts`: 루트 모듈 (이전에 만든 파일과 유사)
- `app.controller.ts`: 기본 컨트롤러
- `app.service.ts`: 기본 서비스
- `app.controller.spec.ts`: 테스트 파일

### 프로젝트 초기화 전략
- 기존 App 관련 파일들을 모두 삭제하고 백지 상태에서 시작
- 삭제할 파일들:
  - `app.controller.spec.ts`
  - `app.controller.ts`
  - `app.module.ts`
  - `app.service.ts`
- 삭제 후 `main.ts`에서 임포트 오류 발생 (정상)

## Nest CLI를 사용한 모듈 생성

### 모듈 생성 명령
```bash
nest generate module messages
```

### 명령 실행 결과
- `src/messages/` 디렉터리 생성
- `messages.module.ts` 파일 자동 생성
- 클래스 이름은 `MessagesModule`로 자동 생성

### 명명 규칙 주의사항
- 명령어에 `module` 단어를 포함하지 않음
  - ✅ 올바름: `nest generate module messages` → `MessagesModule`
  - ❌ 잘못됨: `nest generate module messagesmodule` → `MessagesmoduleModule`
- Nest CLI가 자동으로 적절한 이름을 생성

### Nest CLI의 장점
- 많은 양의 보일러플레이트 코드를 자동 생성
- 프로젝트 구성 시간 단축
- 컨트롤러, 서비스 등을 생성할 때 더욱 유용

## main.ts 파일 연결

### 변경 사항
1. 기존 `AppModule` 임포트 삭제
2. 새로운 임포트 추가:
   ```typescript
   import { MessagesModule } from './messages/messages.module';
   ```
3. `NestFactory.create()`에 `MessagesModule` 전달

### 모듈 이름 선택
- `MessagesModule` 사용
- 메시지 기능에 관련된 많은 내용이 이 모듈 안에 들어갈 예정이기 때문

## 현재 상태

### 완료된 작업
- ✅ 프로젝트 생성 및 설정
- ✅ ESLint 비활성화 (선택사항)
- ✅ 기존 App 파일 삭제
- ✅ MessagesModule 생성
- ✅ main.ts에 MessagesModule 연결

### 다음 단계
- MessagesController 생성
- MessagesService 생성
- MessagesRepository 생성
- 실제 기능 구현

## 추가 핵심 포인트

1. **개발 모드 실행**
   - `npm run start:dev`로 개발 모드 시작
   - 파일 변경 시 자동 재시작

2. **Nest CLI 활용**
   - `nest generate` 명령으로 파일 자동 생성
   - 모듈, 컨트롤러, 서비스 등을 빠르게 생성 가능

3. **모듈 구조**
   - 기능별로 모듈을 분리하여 관리
   - 메시지 관련 기능은 `MessagesModule`에 포함

4. **명명 규칙**
   - CLI 명령어에 최종 클래스 이름의 일부만 포함
   - Nest CLI가 적절한 이름을 자동 생성
