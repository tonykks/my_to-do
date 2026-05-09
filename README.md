# MyToDo App

HTML, CSS, **Vanilla JavaScript**만으로 동작하는 할 일 관리 앱입니다.  
상태는 `todos` 배열로 관리하고, 변경 시 `renderTodos()`로 목록과 통계를 다시 그립니다.  
할 일 목록은 `localStorage`에 저장되며, **목록 필터(전체 / 남은 할 일 / 완료)** 선택값도 별도 키로 저장되어 새로고침 후에도 유지됩니다.

## 프로젝트 구조

```
todo-app/
├── index.html
├── style.css
└── script.js
```

## 주요 기능

| 기능 | 설명 |
|------|------|
| 할 일 추가 | 입력 후 **추가** 버튼 또는 **Enter**로 추가. 앞뒤 공백 제거(`trim`), 빈 문자열은 무시. 추가 후 입력창 비우고 포커스 유지 |
| 완료 토글 | 할 일 **텍스트**를 클릭하면 완료/미완료 전환. 완료 시 취소선·흐림(`.completed`) 및 행 배경(`.todo-item--done`) |
| 삭제 | 각 항목의 **삭제** 버튼으로 해당 Todo만 제거 |
| 목록 필터 | **전체** / **남은 할 일**(미완료만) / **완료**로 표시 범위 전환. 선택값은 `localStorage` 키 `todo-filter`에 자동 저장·복원(`all` \| `active` \| `completed`) |
| 통계 | **완료**·**남은 할 일**·**전체** 개수를 푸터에 실시간 표시. 숫자는 **전체 목록** 기준이며 현재 필터와 무관 |
| 데이터 유지 | 할 일: 키 `todos`에 `JSON.stringify` 저장, 시작 시 `JSON.parse`로 복원 |

## HTML 요소 (스크립트 연동)

스크립트에서 참조하는 주요 ID는 다음과 같습니다.

- `#todo-input` — 입력 필드  
- `#add-btn` — 추가 버튼  
- `#todo-filter-bar` — 필터 버튼 그룹(이벤트 위임)  
- `#todo-list` — Todo 목록(`<ul>`)  
- `#todo-count-completed` — 완료 개수  
- `#todo-count-remaining` — 남은 할 일 개수  
- `#todo-count-total` — 전체 개수  

## localStorage 키

| 키 | 용도 | 값 형식 |
|----|------|---------|
| `todos` | 할 일 배열 | `JSON` 배열 (`{ id, text, completed }[]`) |
| `todo-filter` | 마지막으로 선택한 필터 | `"all"` \| `"active"` \| `"completed"` |

## Todo 데이터 형식

각 항목은 아래 형태의 객체입니다.

```js
{
  id: number,        // 고유 식별자
  text: string,      // 할 일 내용
  completed: boolean // 완료 여부
}
```

전체 목록은 위 객체의 배열로 관리됩니다.

## 구현 방식 요약

- **렌더링**: `renderTodos()`에서 `todosMatchingFilter()`로 표시할 항목만 골라 DOM을 다시 만들고, `updateCount()`로 통계를 갱신한 뒤 `syncFilterButtons()`로 필터 버튼 활성 상태를 맞춥니다.  
- **이벤트 위임**: `#todo-list`에서 삭제·완료 토글, `#todo-filter-bar`에서 필터 변경을 처리합니다.  
- **저장소**: `saveTodos()` / `loadTodos()`로 할 일 동기화, `saveFilter()` / `loadFilter()`로 필터 동기화. 손상·형식 오류 시 안전하게 기본값으로 초기화합니다.

## 기술 스택

- HTML5  
- CSS3 (반응형: 좁은 화면에서 입력 영역·필터 버튼 줄바꿈)  
- Vanilla JavaScript (ES6+, 외부 라이브러리 없음)

## 실행 방법

1. `todo-app` 폴더의 `index.html`을 브라우저에서 엽니다.  
2. 할 일을 입력하고 추가·완료 토글·삭제·필터를 사용합니다.  
3. 페이지를 새로고침해도 할 일 목록과 마지막 필터 선택이 복원되는지 확인할 수 있습니다.

> 로컬 파일로 열 때도 대부분의 브라우저에서 동일 출처로 `localStorage`가 동작합니다.

## GitHub Pages 배포

프로젝트 사이트 주소가 `https://사용자.github.io/저장소이름/`처럼 **하위 경로**일 때, 주소가 `.../저장소이름`(끝 슬래시 없음)으로 열리면 브라우저가 `style.css` 같은 상대 경로를 사이트 루트(`github.io/style.css`)로 잘못 해석해 **CSS·JS가 404**가 나는 경우가 있습니다. 그러면 입력창만 보이고 버튼 스타일·스크립트가 적용되지 않습니다.

이 프로젝트는 `<head>` 안에서 현재 경로에 맞게 `<base href="...">`를 넣어, `style.css`와 `script.js`가 항상 **이 페이지가 있는 폴더** 기준으로 로드되도록 했습니다. 저장소 루트에 `index.html`, `style.css`, `script.js`를 두고 Pages 소스를 해당 브랜치(또는 `/docs`)로 지정하면 동일하게 동작합니다.

## 스타일 참고

- 완료된 텍스트: `.completed` — `text-decoration: line-through`, `opacity: 0.5`  
- 완료된 행 배경: `.todo-item--done`  
- 필터 활성 버튼: `.filter-btn--active`  
- 필터 결과 없음 안내: `.todo-list-empty`
