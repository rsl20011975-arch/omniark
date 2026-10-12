// Authored teaching notes and contexts. All exercise data is explicitly fictional.
const pair=(en,ko)=>({en,ko});
export const topics=[
 ['도서관 대출','전자책','종이책','오디오북','건'],
 ['체육 강좌 신청','수영','배드민턴','요가','건'],
 ['문화시설 방문','박물관','미술관','과학관','회'],
 ['공원 프로그램 참여','생태 관찰','산책 모임','정원 가꾸기','회'],
 ['교통수단 이용','버스','지하철','공유 자전거','회'],
 ['평생교육 신청','언어 수업','컴퓨터 수업','요리 수업','건'],
 ['배달 주문','한식','양식','분식','건'],
 ['재활용품 수거','종이','플라스틱','유리','kg'],
 ['문화 강좌 신청','음악','미술','사진','건'],
 ['관광시설 입장','전망대','식물원','수족관','건'],
 ['운동 프로그램 신청','달리기','걷기','자전거 타기','건'],
 ['공공시설 예약','회의실','강의실','연습실','건'],
 ['진로 체험 신청','과학 체험','방송 체험','공예 체험','건'],
 ['지역 행사 방문','음악 축제','책 축제','음식 축제','회'],
 ['민원 접수','온라인 접수','방문 접수','전화 접수','건'],
 ['시장 결제','카드 결제','현금 결제','간편 결제','건'],
 ['환경 교육 신청','학생 과정','성인 과정','가족 과정','건'],
 ['공유 물품 대여','공구','캠핑 용품','행사 용품','건'],
 ['도서 구입','문학','과학','역사','권'],
 ['식품 판매','쌀','과일','채소','kg'],
 ['온라인 상담','학습 상담','취업 상담','생활 상담','건'],
 ['생활용품 판매','컵','수건','가방','개'],
 ['공연 관람','연극','음악회','무용','회'],
 ['봉사활동 참여','환경 정화','학습 지원','급식 지원','회'],
 ['한국어 학습 자료 이용','단어 자료','문법 자료','쓰기 자료','회'],
 ['취미 강좌 신청','도예','서예','뜨개질','건'],
 ['문화행사 책자 배포','전시 안내','공연 안내','축제 안내','부'],
 ['체험 도구 대여','망원경','쌍안경','현미경','건'],
 ['온라인 전시 관람','사진전','회화전','공예전','회'],
 ['지역 상품 주문','공예품','문구류','기념품','건']
].map(([title,a,b,c,unit],index)=>({id:index+1,title,names:[a,b,c],unit}));

export const families=[
 {id:'change',name:pair('Two changes','두 대상의 변화'),skills:['numbers','direction','period','coverage'],prerequisite:null,
 notes:[pair('Read each row separately. Attach the starting value to the starting year and the ending value to the ending year.','한 행씩 읽으세요. 처음 수치는 처음 연도에, 마지막 수치는 마지막 연도에 연결합니다.'),pair('Choose 증가했다 when the ending value is larger and 감소했다 when it is smaller. Give both values so the reader can check the change.','끝값이 크면 증가했다, 작으면 감소했다를 씁니다. 두 수치를 함께 제시하면 변화가 분명해집니다.'),pair('A correct number with the wrong year is still a factual error. 같은 기간 works only after you have introduced the years.','수치가 맞아도 연도가 바뀌면 사실 오류입니다. 같은 기간은 앞에서 두 시점을 밝혔을 때만 쓸 수 있습니다.'),pair('Describe a different topic without looking at the example. Check both subjects, both years and both directions yourself.','새 주제를 예시 없이 설명하세요. 두 대상, 두 시점, 각각의 방향을 스스로 확인합니다.')],
 expressions:pair('…년 …에서 …년 …으로 증가했다 / 감소했다','…년 …에서 …년 …으로 증가했다 / 감소했다'),trap:pair('Do not assume the two rows move in opposite directions.','두 대상이 반드시 반대 방향으로 움직인다고 생각하지 마세요.')},
 {id:'ranking',name:pair('Rank and extremes','순위와 최고·최저'),skills:['numbers','relation','period','coverage'],prerequisite:null,
 notes:[pair('Compare every value before choosing the highest and lowest. The first row is not necessarily the largest.','모든 수치를 비교한 뒤 최고와 최저를 고르세요. 첫 번째 행이 항상 가장 크지는 않습니다.'),pair('Name the item, state its value, then state its rank. Use 가장 높았다 and 가장 낮았다 to make the comparison explicit.','항목, 수치, 순위 순으로 씁니다. 가장 높았다와 가장 낮았다로 비교 관계를 분명하게 만드세요.'),pair('높았다 alone says a value was high; it does not identify the highest of the three. Do not give a second item the same top rank.','높았다는 표현만으로 세 항목 중 최고라는 뜻이 되지는 않습니다. 다른 항목에 같은 최고 순위를 붙이지 마세요.'),pair('In a new table, locate the extremes before writing. Middle values can be omitted when the task asks only for the two extremes.','새 표에서 양 끝 항목을 찾고 쓰세요. 최고·최저만 요구하는 과제에서는 중간 항목을 생략할 수 있습니다.')],expressions:pair('…이/가 …로 가장 높았다. …은/는 …로 가장 낮았다.','…이/가 …로 가장 높았다. …은/는 …로 가장 낮았다.'),trap:pair('Keep each value attached to its own item.','수치를 해당 항목과 바꾸어 연결하지 마세요.')},
 {id:'share',name:pair('Parts of a whole','전체와 구성 비율'),skills:['numbers','relation','coverage','period'],prerequisite:'ranking',
 notes:[pair('These categories divide one whole. Their percentages add up to 100. Identify the largest and smallest shares.','세 항목이 하나의 전체를 나눕니다. 비율의 합은 100%입니다. 가장 큰 비중과 작은 비중을 찾으세요.'),pair('Use 차지하는 비율 or 비중 to show that you are describing a share, not a head count. Keep the % unit.','차지하는 비율이나 비중으로 전체 중 몫을 표현합니다. 인원수와 혼동하지 않고 % 단위를 유지하세요.'),pair('A 40% share does not tell you the number of people unless the total is provided. Do not invent a total.','40%라는 비율만으로 몇 명인지 알 수는 없습니다. 전체 인원수가 없으면 인원수를 만들어 쓰지 마세요.'),pair('Explain a new composition using two key shares. Check that the item names, percentages and comparisons agree.','다른 구성 자료에서 핵심 비율 두 개를 설명하세요. 항목, 비율, 비교 관계가 일치하는지 확인합니다.')],expressions:pair('…의 비율은 …%로 가장 컸다 / 작았다.','…의 비율은 …%로 가장 컸다 / 작았다.'),trap:pair('The largest share can be below 50%; largest does not always mean a majority.','가장 큰 비중이 50% 미만일 수도 있습니다. 최고 비중과 과반은 다릅니다.')},
 {id:'trend',name:pair('Three time points','세 시점의 추세'),skills:['numbers','direction','period','coverage'],prerequisite:'change',
 notes:[pair('Read all three years in order. Comparing only the first and last can hide a rise followed by a fall.','세 연도를 순서대로 읽으세요. 처음과 끝만 비교하면 중간에 올랐다가 내려간 흐름을 놓칠 수 있습니다.'),pair('Use one sentence for each interval. Then identify the peak with its year and value.','구간마다 한 문장으로 설명한 뒤, 최고 시점과 수치를 한 문장으로 밝히세요.'),pair('The second interval starts at the middle year, not the first year. Check that the two sentences share the same middle value.','둘째 구간은 첫해가 아닌 중간 연도부터 시작합니다. 두 문장에 등장하는 중간 수치가 일치하는지 확인하세요.'),pair('Try a rising, falling or turning pattern without a model. The overall direction alone is not enough.','상승·하락·반전 흐름을 예시 없이 설명하세요. 전체 방향만 쓰는 것으로는 충분하지 않습니다.')],expressions:pair('…에서 …으로 증가했다. …에서 …으로 감소했다. …년이 가장 높았다.','…에서 …으로 증가했다. …에서 …으로 감소했다. …년이 가장 높았다.'),trap:pair('Do not call the last year the peak without comparing all three.','세 시점을 비교하지 않고 마지막 연도를 최고라고 쓰지 마세요.')},
 {id:'gap',name:pair('The gap between values','수치의 격차'),skills:['numbers','relation','coverage','period'],prerequisite:'ranking',
 notes:[pair('Read the two item values in the same year and with the same unit. A gap compares like with like.','같은 연도, 같은 단위의 두 항목을 읽으세요. 격차는 같은 기준의 수치끼리 비교합니다.'),pair('State both values, then subtract the smaller from the larger to report the gap. Keep the original unit.','두 수치를 제시한 뒤 큰 값에서 작은 값을 빼서 차이를 씁니다. 원래 단위를 그대로 사용합니다.'),pair('A difference of 30 is not a 30% increase. Difference and growth rate answer different questions.','30의 차이는 30% 증가와 다릅니다. 격차와 증가율은 서로 다른 질문에 답합니다.'),pair('With a new table, write the two values and their gap. Check the arithmetic once before submitting.','새 표의 두 수치와 격차를 쓰세요. 제출하기 전에 뺄셈을 한 번 확인합니다.')],expressions:pair('두 항목의 차이는 …이었다.','두 항목의 차이는 …이었다.'),trap:pair('Do not change the unit when reporting a difference.','차이를 쓸 때 단위를 바꾸지 마세요.')},
 {id:'reverse',name:pair('A change in leadership','순위의 역전'),skills:['numbers','relation','period','coverage'],prerequisite:'change',
 notes:[pair('Compare the two items in the first year, then compare them again in the last year. Notice which item leads each time.','첫해의 두 항목을 비교하고 마지막 해에도 비교하세요. 각 시점에 어느 항목이 앞서는지 봅니다.'),pair('Show the before-and-after comparisons, then state that the leading item changed.','처음과 마지막의 비교를 제시한 뒤 순위가 역전되었다고 정리하세요.'),pair('An item increasing does not automatically mean it overtook the other. Both pairs of values must support the reversal.','한 항목의 증가만으로 추월했다고 할 수 없습니다. 두 시점의 비교가 모두 역전을 뒷받침해야 합니다.'),pair('Explain a new reversal in three sentences: first year, last year, and the changed leader.','새 역전 자료를 첫해, 마지막 해, 바뀐 우위의 세 문장으로 설명하세요.')],expressions:pair('…보다 …이/가 높았다. 두 항목의 순위가 역전되었다.','…보다 …이/가 높았다. 두 항목의 순위가 역전되었다.'),trap:pair('Keep the subject of 높았다 clear; reversing A and B reverses the claim.','높았다는 서술의 주어를 분명히 하세요. A와 B를 바꾸면 주장도 반대가 됩니다.')},
 {id:'stable',name:pair('No change','정체와 변화'),skills:['numbers','direction','period','coverage'],prerequisite:'change',
 notes:[pair('Equal starting and ending values mean no net change for that item. Read the other row separately.','처음과 끝의 값이 같으면 그 항목의 변화가 없습니다. 다른 행의 방향은 따로 읽으세요.'),pair('Use 동일했다 or 변화가 없었다 for the unchanged row. Use an increase or decrease expression only for the changing row.','같은 값에는 동일했다나 변화가 없었다를 씁니다. 변한 행에만 증가·감소 표현을 사용하세요.'),pair('A flat pair of endpoints cannot prove that nothing happened between them. Describe only the two shown years.','양 끝의 수치가 같아도 중간에 변화가 전혀 없었다고 증명할 수는 없습니다. 표시된 두 시점만 설명하세요.'),pair('In a new example, identify the unchanged row without assuming it is always the first.','새 자료에서 변하지 않은 행을 찾으세요. 언제나 첫 번째 행이라고 가정하지 마세요.')],expressions:pair('두 시점의 수치는 …으로 동일했다.','두 시점의 수치는 …으로 동일했다.'),trap:pair('Do not force every item into 증가했다 or 감소했다.','모든 항목에 증가했다나 감소했다를 억지로 붙이지 마세요.')},
 {id:'groups',name:pair('Comparing two groups','집단별 비교'),skills:['numbers','relation','coverage','period'],prerequisite:'ranking',
 notes:[pair('Here the columns are two groups in the same year, not two different years. Read the column headings first.','이 표의 열은 서로 다른 연도가 아니라 같은 해의 두 집단입니다. 먼저 열 제목을 읽으세요.'),pair('For each item, give both group values and state which group has the larger value.','각 항목에서 두 집단의 수치를 제시하고 어느 집단의 값이 더 큰지 쓰세요.'),pair('Differences between groups do not show an increase over time. Avoid 증가했다 when there is no time comparison.','집단 사이의 차이는 시간에 따른 증가가 아닙니다. 시점 비교가 없는데 증가했다고 쓰지 마세요.'),pair('Compare both rows in a fresh table. The group with the larger value can differ between rows.','새 표의 두 행을 비교하세요. 항목마다 더 큰 값을 가진 집단이 달라질 수 있습니다.')],expressions:pair('…은/는 A집단이 …, B집단이 …으로 A집단이 높았다.','…은/는 A집단이 …, B집단이 …으로 A집단이 높았다.'),trap:pair('Always name the group when you attach a number.','수치를 쓸 때 어느 집단의 값인지 함께 밝히세요.')},
 {id:'delta',name:pair('Comparing increases','증가 폭 비교'),skills:['numbers','direction','relation','period'],prerequisite:'change',
 notes:[pair('Calculate each increase from its own starting and ending value. The largest final value may not have the largest increase.','항목마다 끝값에서 시작값을 빼세요. 마지막 값이 가장 큰 항목의 증가 폭이 가장 큰 것은 아닙니다.'),pair('Report each change with its endpoints. Then name the item with the larger absolute increase and give that increase.','각 항목의 양 끝 수치를 설명한 뒤, 증가 폭이 큰 항목과 증가량을 정리하세요.'),pair('Do not compare only the final columns. Also distinguish an absolute increase from a percentage growth rate.','마지막 열만 비교하지 마세요. 절대 증가량과 증가율도 구분해야 합니다.'),pair('Repeat with different starting values. Verify both subtractions before choosing the larger increase.','시작값이 다른 자료로 다시 연습하세요. 두 뺄셈을 확인한 뒤 더 큰 증가 폭을 선택합니다.')],expressions:pair('…의 증가 폭은 …으로 더 컸다.','…의 증가 폭은 …으로 더 컸다.'),trap:pair('The word 더 needs a comparison supported by both rows.','더라는 표현에는 두 행의 비교 근거가 필요합니다.')},
 {id:'paragraph',name:pair('A connected short paragraph','짧은 문단 구성'),skills:['numbers','relation','period','coverage','connection'],prerequisite:'gap',
 notes:[pair('Plan three roles: introduce the chart, report its main facts, and close with a supported comparison.','자료 소개, 핵심 사실, 근거 있는 비교라는 세 역할을 먼저 계획하세요.'),pair('Use four sentences: a brief introduction, the highest value, the lowest value, and their gap. Every sentence has a job.','짧은 소개, 최고값, 최저값, 두 값의 격차를 네 문장으로 씁니다. 각 문장에 역할이 있습니다.'),pair('Do not add a cause or prediction just to make the paragraph sound complete. The ending can summarize a numerical relationship.','문단을 마무리하려고 원인이나 전망을 만들어 넣지 마세요. 수치 관계를 정리하는 것으로도 끝맺을 수 있습니다.'),pair('Write a fresh paragraph without the example. Check whether the facts and the final comparison tell the same story.','새 문단을 예시 없이 쓰세요. 핵심 사실과 마지막 비교가 서로 일치하는지 확인합니다.')],expressions:pair('이 자료는 …년의 … 현황을 보여준다. … 두 항목의 차이는 …이었다.','이 자료는 …년의 … 현황을 보여준다. … 두 항목의 차이는 …이었다.'),trap:pair('Longer is not automatically clearer. Include only what the chart supports.','길다고 더 명확한 것은 아닙니다. 자료로 뒷받침되는 내용만 포함하세요.')}
];
export const phases=[pair('Read the evidence','근거 읽기'),pair('Build the explanation','설명 만들기'),pair('Repair a common mistake','오류 고치기'),pair('Apply independently','혼자 적용하기')];
export const coreLessons=families.flatMap(f=>phases.map((phase,i)=>({id:`${f.id}-step-${i+1}`,family:f.id,stage:i,title:phase,note:f.notes[i],skill:f.skills[Math.min(i,f.skills.length-1)]})));
export const familyById=Object.fromEntries(families.map(f=>[f.id,f]));
