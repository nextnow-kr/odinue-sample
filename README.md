# 메시지 템플릿 에디터

## 소개
순수 JavaScript로 구현된 모듈형 메시지 템플릿 에디터입니다. React나 Vue와 같은 프레임워크 없이도 컴포넌트 기반 아키텍처와 중앙 집중식 상태 관리를 구현하여, 모던 웹 애플리케이션의 개발 패턴을 준수합니다.

## 주요 특징
- 컴포넌트 기반 아키텍처
- 중앙 집중식 상태 관리 (Store 패턴)
- 반응형 UI 업데이트
- LocalStorage 기반 데이터 영속성
- 모바일 디바이스 프리뷰

## 기술 스택
- Vanilla JavaScript (ES6)
- jQuery 3.6.0
- HTML5
- CSS3
- LocalStorage API

## 아키텍처

### 컴포넌트 기반 설계
프레임워크 없이 순수 JavaScript로 컴포넌트 기반 아키텍처를 구현했습니다:

```javascript
class MessageTemplateComponent {
    constructor(containerId, store) {
        // 컴포넌트 초기화
    }

    // 렌더링 메서드
    render() {
        // UI 업데이트
    }

    // 이벤트 핸들링
    bindEvents() {
        // 이벤트 바인딩
    }
}
```

### 상태 관리 (Store)
Redux와 유사한 중앙 집중식 상태 관리를 구현했습니다:

```javascript
class Store {
    constructor(initialState = {}) {
        this.state = initialState;
        this.subscribers = [];
    }

    // 상태 구독
    subscribe(callback) {
        this.subscribers.push(callback);
    }

    // 상태 업데이트
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }
}
```

## 컴포넌트 구조

### MessageTemplateComponent
템플릿 목록과 에디터를 관리하는 메인 컴포넌트입니다.

#### 주요 기능
- 템플릿 목록 표시 및 관리
- 템플릿 선택 및 편집
- 실시간 내용 업데이트
- 자동 저장

### MessagePreviewComponent
선택된 템플릿의 모바일 프리뷰를 표시하는 컴포넌트입니다.

#### 주요 기능
- 모바일 디바이스 UI 시뮬레이션
- 실시간 프리뷰 업데이트
- 메시지 포맷팅

## 시작하기

### 설치
1. 저장소 클론
```bash
git clone [repository-url]
```

2. 의존성 포함
```html
<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- 앱 스크립트 -->
<script src="Store.js"></script>
<script src="MessageTemplateComponent.js"></script>
<script src="MessagePreviewComponent.js"></script>
```

### 사용 방법

1. Store 초기화
```javascript
const store = new Store({
    templates: [],
    selectedTemplateId: null
});
```

2. 컴포넌트 초기화
```javascript
const templateList = new MessageTemplateComponent('templateList', store);
const preview = new MessagePreviewComponent('messagePreview', store);
```

## 데이터 구조

### Template
```javascript
{
    id: Number,          // 템플릿 ID
    title: String,       // 제목
    content: String,     // 내용
    createdAt: String    // 생성일시
}
```

## 구현 특징

### 1. 모듈형 아키텍처
- 각 컴포넌트는 독립적으로 동작
- 명확한 책임 분리
- 재사용 가능한 구조

### 2. 반응형 상태 관리
- Store를 통한 중앙 집중식 상태 관리
- 옵저버 패턴을 활용한 상태 변화 감지
- 자동 UI 업데이트

### 3. 성능 최적화
- 불필요한 렌더링 방지
- 이벤트 위임 활용
