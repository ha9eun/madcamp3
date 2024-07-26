## ME!

가끔 자기 자신이 무엇을 좋아하는지, 어떤 순간을 즐기는지 잘 떠오르지 않을 때가 있습니다.

매일 하나씩 질문에 답해가며 나 자신을 온전히 알아가봅시다. 당신의 답변 나무가 자라날 것입니다!

---

### 개발 환경

**Front-end:** React, css

**Back-end:** AWS API gateway, AWS Lambda

---

### 팀원

하은수(숙명여대)

강지우(KAIST)

---

### 회원가입 및 로그인

<aside>
💡 아이디, 비밀번호, 닉네임만으로 간편하게 가입할 수 있습니다. 비밀번호는 `SHA256` 함수로 암호화하여 안전하게 저장합니다. 또한 데이터압축 및 서명을 위하여 `JWT(Json Web Token)`을 사용하였습니다.

</aside>

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/b9c68210-97a3-49c1-8cf9-20405efc716d/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/0cbdc062-083b-42ab-8bd5-fcdab9289ab2/Untitled.png)

### 홈 화면

<aside>
❓ 최근 질문과 답변을 볼 수 있습니다. ‘기록 더보기’와 ‘친구 답변도 보기’를 누르면 각각 기록 탭과 소셜 탭으로 이동합니다.

</aside>

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/2c180ae9-fab8-4017-8d73-bf9ae215477c/Untitled.png)

---

### “기록”

<aside>
🎨 오늘의 질문에 답변을 기록할 수 있습니다. 기록을 할 때는 구체적인 답변과 어울리는 색을 함께 기록합니다.

</aside>

<aside>
💡 기록 탭의 초기 화면입니다. 캘린더에서 기록한 날과 답변의 색을 한눈에 볼 수 있습니다. 날짜를 클릭하면 상세한 답변을 볼 수 있습니다.

</aside>

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/2f26d7c6-1960-4c46-b2e5-45df2803d71f/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/1e09360f-759a-467e-90cb-0bbea3b1b9f2/Untitled.png)

<aside>
💡 답변을 작성하고 나면, AI가 핵심 키워드 세 가지를 선정해줍니다. `Gemini API`를 사용하였습니다

</aside>

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/3e93093a-0dba-445e-a9bf-50492b0e5ce9/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/b3a9e960-ac18-4e4a-92bc-f6f47737a3e9/Untitled.png)

---

### “나무”

<aside>
🌳 나의 답변들을 나무의 형태로 시각화합니다. 나의 답변에서 키워드를 추출하여 나무의 가지와 잎이 되고, 내가 고른 색은 나의 단어들의 뿌리가 되어 땅 아래 자리 잡습니다. 각 단어를 누르면 해당 키워드를 만든 질문과 답변을 볼 수 있습니다.

</aside>

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/12921599-f30c-4139-a74c-93cb0818580f/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/65ed7b38-842f-44c9-8259-9ecfb76ca33e/Untitled.png)

---

### “소셜”

<aside>
👥 내 친구와 다른 유저들의 답변을 볼 수 있습니다. 내 친구들이 적은 오늘의 답변을 볼 수 있고, 프로필을 클릭하면 친구의 나무와 답변들을 볼 수 있습니다. 새로 친구를 만들고 싶다면, 검색기능으로 유저를 찾아 팔로우를 할 수 있습니다. 내가 팔로우하는 사람들은 한눈에 볼 수 있습니다.

</aside>

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/389cf6bd-1368-4be8-b34b-0fc5aca8df5b/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/d1388b28-ffc2-4bf7-8d0a-65dd821328b9/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/58d15b94-adbf-4101-b7e7-da4df22a820e/Untitled.png)

---

### “프로필”

<aside>
📎 나의 닉네임과 아이디를 볼 수 있습니다. 수정 버튼을 누르면 닉네임과 비밀번호를 수정할 수 있습니다. 현재 비밀번호를 정확히 입력해야 회원정보를 수정할 수 있습니다.

</aside>

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/94bce3d6-6c03-4a2c-952f-65094f3b97cd/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/1dded21f-7c63-427c-9db3-f99b28b13421/Untitled.png)
