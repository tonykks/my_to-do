# Todo App

## 프로젝트 소개
Vanilla JavaScript 기반의 간단한 Todo App입니다.  
데이터(Array) 변경 후 렌더링(Render)으로 UI를 동기화하는 구조를 중심으로 구현했습니다.

## 주요 기능
- Todo 추가 (빈 값 입력 방지, trim 처리)
- Todo 목록 렌더링
- 완료/미완료 토글
- Todo 삭제
- 남은 Todo 개수 표시
- LocalStorage 저장/복원

## 실행 방법
1. `todo-app` 폴더로 이동합니다.
2. `index.html` 파일을 브라우저에서 엽니다.
3. 입력창에 할 일을 입력하고 추가/완료/삭제 기능을 사용합니다.

## 사용 기술
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- LocalStorage

## AI 활용 기록
- 요구사항 기반으로 파일 구조를 생성했습니다.
- 기능 단위 함수 분리(`addTodo`, `renderTodos`, `toggleTodo`, `deleteTodo`, `updateCount`)를 적용했습니다.
- 예외 처리(빈 입력, 잘못된 id, 배열 상태 방어)를 반영했습니다.

## 회고
- 데이터 상태를 기준으로 UI를 다시 그리는 구조가 유지보수에 유리했습니다.
- 함수 분리를 통해 기능별 책임이 명확해졌고 디버깅이 쉬워졌습니다.
- LocalStorage를 추가해 새로고침 이후에도 상태를 유지할 수 있었습니다.
