# Park Group 홈페이지 관리자(CMS) 시제품 — 설정·시험 안내서

이 폴더는 **Home 한 페이지 + 관리자 화면** 시제품이에요. 기존 홈페이지(`parklab.kaist.ac.kr`, Squarespace)는 **건드리지 않습니다.**
아래 순서대로 하면 임시 주소(`https://계정명.github.io/저장소이름/`)에서 직접 로그인해 글·사진·블록·크기·색을 바꾸고 게시해 볼 수 있어요.

---

## 0. 먼저 알아둘 것

### 0-1. 무엇을 바꿀 수 있나요? (관리자 화면: `주소/admin/`)

| 하고 싶은 일 | 어떻게 |
|---|---|
| 글 수정 | 입력칸에 쓰면 오른쪽 미리보기에 바로 보여요 |
| 사진 업로드 | 사진 칸의 "이미지 선택" → "업로드" |
| 블록 추가 | "블록 추가" → 배너 / 글 / 사진+글 / 사진 한 장 / 뉴스 목록 / 버튼 / 빈 공간 |
| 블록 삭제·순서 변경 | 카드 오른쪽 위 ✕, 카드 위쪽 가운데 `=` 를 잡고 끌기 |
| 글자 크기·글자색·배경색·정렬·위아래 여백 | 각 블록 안 "글자·색·정렬·여백 설정" |
| 사진 너비, 사진을 왼쪽/오른쪽에 두기 | "사진 + 글" 블록 |
| 뉴스·메뉴 항목 추가·삭제 | 항목 목록의 "추가", ✕ (뉴스는 날짜순 자동 정렬) |
| 상단 메뉴·푸터 | 왼쪽 "사이트 공통" |

### 0-2. 이 시제품에서 안 되는 것 (미리 말씀드려요)
- **Home 한 페이지만** 있어요. 메뉴의 Research 등은 지금 **기존 홈페이지 주소**로 연결돼 있어요(관리자 "사이트 공통"에서 바꿀 수 있어요).
- 화면을 직접 클릭해 고치는 방식이 아니라 **입력 양식 + 오른쪽 미리보기**예요. 미리보기는 폭이 좁아서 실제보다 좁은 화면 기준(모바일에 가까움)으로 보여요. 정확한 모습은 게시 후 공개 주소에서 확인하세요.
- 색은 한 블록에 글자색·제목색·배경색, 크기는 본문·제목 두 가지만 있어요. 글 중간 일부만 색을 바꾸는 건 안 돼요.
- 새로운 **블록 종류**나 전체 디자인(폰트, 메뉴 모양)을 바꾸려면 코드 작업이 필요해요.
- **푸터 로고**: 원본의 KAIST 로고 파일을 가져오지 못해 비어 있어요. 관리자 "사이트 공통 → 푸터 로고 사진"에서 올려 주세요.
- 원본 푸터에 있던 "Make it stand out"은 Squarespace 기본 안내문이 남은 것으로 보여 옮기지 않았어요.
- 글은 **브라우저에서 불러와 그려요**(JavaScript). 공개는 되지만 검색엔진이 읽는 방식은 기존과 달라질 수 있어요. 본 이전 전에 점검이 필요해요.
- 여러 명이 같은 페이지를 동시에 고치면 나중에 게시한 쪽이 이겨요.
- 아이폰 사진(HEIC)은 브라우저에서 안 보여요. JPG/PNG로 올려 주세요.

### 0-3. 제가 확인한 것 / 확인하지 못한 것
| 구분 | 내용 | 상태 |
|---|---|---|
| **로컬 시험(제 작업 환경)** | 관리자 로그인(로컬 저장소) → 글 수정 → 뉴스 추가 → 블록 삭제 → 블록 추가 + 사진 업로드 → 사진 오른쪽·너비 50% → 글자 크기·색·배경색·여백·정렬 변경 → 블록 끌어서 순서 변경 → 게시 → 저장된 파일 확인 → 공개 페이지에 글·사진·크기·색·여백·순서 반영 | **11단계 모두 통과** |
| **실제 배포 시험(직접 해 주세요)** | GitHub 로그인 → 수정 → 게시 → 공개 주소 반영 | **아직 안 해봤어요 (5번 체크리스트)** |
| 제가 못 해본 것 | GitHub·Cloudflare 계정 화면 설정, GitHub Pages 게시, unpkg에서 관리자 프로그램 불러오기(로컬 시험은 같은 버전 파일을 대신 제공), 사진 자동 축소 워크플로, DNS 전환 | 미확인 |

> **"이전 완료" 기준**: 5번 체크리스트가 전부 통과하기 전에는 도메인·Squarespace에 아무것도 하지 않아요.

### 0-4. 비용과 계정
- **추가 비용 없음**: GitHub Free(공개 저장소) + GitHub Pages + Cloudflare Workers 무료 요금제. 비공개 저장소로 Pages를 쓰려면 유료 플랜이 필요해서, **저장소는 공개(Public)** 로 만들어요. 소스와 수정 기록(수정한 사람 이름 포함)을 누구나 볼 수 있으니 비공개 정보는 넣지 마세요.
- 한도(GitHub Pages): 사이트 1GB 이하, 월 대역폭 약 100GB(소프트 한도). 지금 크기는 약 1MB예요. 사진을 많이 올릴 땐 한 장 2MB 이하로 줄여 올리세요.
- Cloudflare Workers 무료 요금제 한도는 [Cloudflare 요금 페이지](https://developers.cloudflare.com/workers/platform/pricing/)에서 확인하세요(로그인 중계용으로는 충분한 규모예요).
- **필요한 계정**: ① GitHub 계정(소유자 1명 + 편집할 사람 모두) ② Cloudflare 무료 계정 1개(소유자).
- 편집자는 GitHub 계정이 있어야 하고, 소유자가 저장소에 **협업자(쓰기 권한)** 로 초대해야 해요. 이메일만으로 로그인하는 방식은 이 무료 구성에서는 없어요.

---

## 1. 로컬 시험과 실제 배포 시험의 차이

| | 로컬 시험 | 실제 배포 시험 |
|---|---|---|
| 어디서 | 제 작업 환경(내 컴퓨터 안) | 인터넷의 GitHub Pages |
| 로그인 | "로컬 저장소로 작업" (계정 불필요) | GitHub 계정 로그인 (Cloudflare 중계 사용) |
| 저장 위치 | 컴퓨터 안 파일 | GitHub 저장소(커밋) |
| 공개 반영 | 내 컴퓨터에서만 | 게시 후 1~2분 뒤 공개 주소 |
| 상태 | **제가 완료** | **직접 해 주실 차례 (2~5번)** |

---

## 2. GitHub 저장소 만들고 올리기 (소유자 1명)

1. [github.com](https://github.com) 가입/로그인. (연구실 공용 계정을 새로 만들면 권한 관리가 편해요.)
2. 오른쪽 위 **+ → New repository**
   - Repository name: 예) `parklab-site` (아래 `저장소이름`)
   - **Public** 선택, "Add a README" 체크 **해제** → **Create repository**
3. 받은 zip을 **내 컴퓨터에서 압축 해제**한 뒤, 만들어진 화면의 **uploading an existing file** 링크를 눌러요.
4. 압축을 푼 폴더 **안의 내용물**(`index.html`, `admin`, `content`, `css`, `js`, `images`, `fonts`, `scripts`, `extras`, `SETUP-KO.md`)을 전부 끌어다 놓고 **Commit changes**
   - 폴더째가 아니라 *안에 든 것들*을 올려야 주소가 `…/저장소이름/index.html`이 돼요.
   - 올라간 뒤 저장소 첫 화면에 `index.html`과 `admin` 폴더가 보이면 성공이에요.
5. **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main**, 폴더 **/(root)** → **Save**
6. 1~2분 뒤 **`https://계정명.github.io/저장소이름/`** 에서 Home이 보이는지 확인해요. (여기까지가 임시 사이트예요. 아직 관리자 로그인은 안 돼요.)

> 화면 이름은 GitHub가 바꿀 수 있어요. 비슷한 메뉴를 찾아 진행하세요.

---

## 3. 로그인 중계 설정 (Cloudflare 무료) — 소유자 1명

관리자 화면이 GitHub 로그인을 하려면 작은 중계 프로그램이 필요해요. Cloudflare Workers에 올려서 씁니다. 사용하는 프로그램은 오픈소스 [`sveltia/sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth)이고 Decap CMS와도 같은 방식으로 동작한다고 안내돼 있어요.

### 3-1. Cloudflare 가입과 중계 배포
1. [cloudflare.com](https://www.cloudflare.com) 무료 계정을 만들어요.
2. 위 GitHub 페이지(`sveltia-cms-auth`) 설명의 **Deploy to Cloudflare Workers** 버튼을 눌러 안내대로 진행해요(GitHub 연결을 허락해야 해요).
3. 배포가 끝나면 Cloudflare 대시보드 → **Workers & Pages** → `sveltia-cms-auth` 에서 주소 `https://sveltia-cms-auth.○○○.workers.dev` 를 복사해 둬요. (`워커주소`)

### 3-2. GitHub OAuth 앱 등록 (로그인 허용 증명서)
1. GitHub → 오른쪽 위 프로필 → **Settings → Developer settings → OAuth Apps → New OAuth App**
2. 입력
   - Application name: `Park Group CMS`
   - Homepage URL: `https://계정명.github.io/저장소이름/`
   - Authorization callback URL: `워커주소/callback` (예: `https://sveltia-cms-auth.○○○.workers.dev/callback`)
3. **Register application** → **Generate a new client secret** → **Client ID** 와 **Client Secret** 을 복사해 둬요. (Secret은 다시 볼 수 없고, 남에게 보여주면 안 돼요.)

### 3-3. Cloudflare에 값 넣기
Cloudflare → Workers & Pages → `sveltia-cms-auth` → **Settings → Variables and Secrets** 에 추가하고 **Deploy**:

| 이름 | 값 |
|---|---|
| `GITHUB_CLIENT_ID` | 위의 Client ID |
| `GITHUB_CLIENT_SECRET` | 위의 Client Secret (**Secret** 형식으로) |
| `ALLOWED_DOMAINS` | `계정명.github.io` |

### 3-4. 보안 참고
- 편집자가 로그인할 때 GitHub가 "이 앱이 저장소 접근 권한을 요청한다(repo)"고 물어요. 이 권한은 **그 사람 계정의 저장소 전체**에 걸리는 넓은 권한이에요. 그래서 **연구실 편집용 GitHub 계정(또는 무료 GitHub 조직)을 따로 만들어 쓰는 것**을 권해요. 개인 계정으로 할 땐 이 점을 알고 허락하세요.

---

## 4. 설정 파일 고치고 편집자 초대

### 4-1. `admin/config.yml` 세 곳 수정
GitHub 저장소에서 `admin/config.yml` 열기 → 연필(✏️) → 아래 3곳(`★ 수정 필요`)을 바꾸고 **Commit changes**:

```yaml
backend:
  repo: 계정명/저장소이름                  # 예: parklab-kaist/parklab-site
  base_url: 워커주소                       # 예: https://sveltia-cms-auth.○○○.workers.dev
site_url: https://계정명.github.io/저장소이름/
```

### 4-2. 편집자 초대
저장소 **Settings → Collaborators → Add people** → 편집할 사람의 GitHub 아이디 입력 → 권한은 쓰기(Write). 초대받은 사람은 이메일/GitHub 알림에서 **수락**해야 해요.

---

## 5. 실제 배포 시험 체크리스트 (여기가 통과해야 "이전 완료"예요)

주소: `https://계정명.github.io/저장소이름/admin/` (소유자 계정으로 먼저, 이후 편집자 계정으로)

| # | 할 일 | 통과 기준 | 결과 |
|---|---|---|---|
| 1 | 관리자 주소 열기 → **GitHub로 로그인** | 팝업에서 GitHub 승인 후 관리자 화면이 열림 | ☐ |
| 2 | 페이지 → Home → 배너 "큰 제목"을 `시험 제목`으로 수정 | 오른쪽 미리보기에 바로 바뀜 | ☐ |
| 3 | **블록 추가 → 사진 + 글** → "이미지 선택 → 업로드"로 사진 올리기 | 사진이 블록에 보임 | ☐ |
| 4 | 그 블록에서 사진 위치 **오른쪽**, 너비 **50**, 글자 크기 **24**, 글자색 `#cc0000`, 배경색 `#fff3e0`, 위 여백 **80** | 미리보기에 반영 | ☐ |
| 5 | 블록 `=` 를 끌어 **뉴스 목록 위로 이동** | 순서가 바뀜 | ☐ |
| 6 | 뉴스 목록에서 **뉴스 추가**(오늘 날짜) | 뉴스 맨 위에 나옴 | ☐ |
| 7 | 오른쪽 위 **게시 → 지금 게시** | "게시됨" 표시 | ☐ |
| 8 | GitHub 저장소 **Commits** 확인 | "관리자 화면에서 수정…" 커밋과 `images/uploads/` 사진이 보임 | ☐ |
| 9 | 1~2분 뒤 **공개 주소**(`…github.io/저장소이름/`) 새로고침(Ctrl+Shift+R) | 시험 제목, 사진(오른쪽·50%), 색·크기·여백, 순서, 새 뉴스가 모두 보임 | ☐ |
| 10 | **휴대폰**으로 같은 공개 주소 열기 | 메뉴 버튼(☰)이 열리고, 사진+글이 위아래로 쌓여 보임 | ☐ |
| 11 | **편집자 계정**으로 1~9 반복 | 편집자도 게시되고 반영됨 | ☐ |
| 12 | 초대하지 않은 GitHub 계정으로 로그인 시도 | 게시/저장이 거부됨(권한 없음) | ☐ |
| 13 | 저장소에서 시험 커밋 되돌리기(또는 관리자에서 시험 항목 삭제 후 게시) | 공개 사이트가 원래대로 돌아옴 | ☐ |

**전부 ☑ 가 되면** 알려 주세요. 그때 나머지 7페이지를 같은 방식으로 만들고, 마지막에 도메인 전환을 진행해요.

### 막혔을 때
| 증상 | 확인할 것 |
|---|---|
| 로그인 팝업이 "Authentication aborted" | 3-2의 callback 주소(`워커주소/callback`), 3-3의 `ALLOWED_DOMAINS`, `config.yml`의 `base_url` 오타 |
| 관리자 화면이 하얗게 비어 있음 | 인터넷 연결(관리자 프로그램을 unpkg에서 불러와요), 주소 끝 `/admin/` |
| "repo를 찾을 수 없음" | `config.yml`의 `repo: 계정명/저장소이름`, 저장소가 Public인지 |
| 게시 때 권한 오류 | 저장소 Collaborators에 **Write** 권한으로 있고 초대를 수락했는지 |
| 게시했는데 공개 사이트가 그대로 | 저장소 **Actions** 탭의 "pages build and deployment"가 끝났는지(1~3분), 새로고침(Ctrl+Shift+R) |
| 사진이 안 보임 | 사진 용량/형식(JPG·PNG·WEBP), 업로드 후 게시까지 눌렀는지 |

---

## 6. (선택) 사진 자동 축소
스마트폰 원본 사진은 크니까, 올리면 가로세로 2000px 이하로 자동으로 줄이는 기능을 넣을 수 있어요.
1. 저장소 **Add file → Create new file**, 파일 이름에 `.github/workflows/optimize-images.yml` 입력(슬래시를 치면 폴더가 만들어져요).
2. `extras/optimize-images.yml` 내용을 붙여 넣고 **Commit**.
- 줄이는 프로그램(`scripts/optimize-images.mjs`)은 제 환경에서 동작을 확인했지만, **GitHub에서 자동 실행되는 부분은 아직 확인하지 못했어요.** 줄어든 사진이 공개 사이트에 반영되려면 다음 게시 때까지 기다려야 할 수도 있어요. 문제가 생기면 이 파일만 삭제하면 돼요(사이트에는 영향 없음).

## 7. 도메인·Squarespace는?
**아직 아무것도 바꾸지 않아요.** 5번이 통과한 뒤 나머지 페이지를 완성하고, 그다음 KAIST 전산 담당에 `parklab.kaist.ac.kr`의 DNS 변경을 요청하는 단계로 가요. 그 전까지 Squarespace 구독과 기존 주소는 그대로 두세요.
