import { ScrollArea } from "@/components/ui/scroll-area"

export function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="space-y-8">
                    {/* 헤더 */}
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl font-bold text-foreground">
                            개인정보처리방침
                        </h1>
                        <p className="text-muted-foreground">
                            NowWhat은 사용자의 개인정보 보호를 최우선으로 하며, 개인정보보호법 등 관련 법령을 준수합니다.
                        </p>
                        <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                            <p><strong>시행일:</strong> 2025년 1월 1일</p>
                            <p><strong>최종 수정일:</strong> 2025년 1월 6일</p>
                        </div>
                    </div>

                    {/* 본문 */}
                    <ScrollArea className="h-full">
                        <div className="space-y-8 text-foreground">
                            {/* 1. 개인정보의 처리목적 */}
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold border-b border-border pb-2">
                                    1. 개인정보의 처리목적
                                </h2>
                                <div className="space-y-3 text-sm leading-relaxed">
                                    <p>
                                        NowWhat('회사'라 함)은 다음의 목적을 위하여 개인정보를 처리합니다.
                                        처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
                                        이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라
                                        별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공, 본인확인</li>
                                        <li>서비스 제공: AI 기반 체크리스트 생성, 개인화된 질문 제공, 사용자 맞춤형 콘텐츠 제공</li>
                                        <li>서비스 개선: 이용 현황 분석, 서비스 품질 향상, 신규 서비스 개발</li>
                                        <li>고객 지원: 문의사항 처리, 공지사항 전달, 불만처리</li>
                                        <li>법적 의무 이행: 관련 법령에 따른 의무 이행</li>
                                    </ul>
                                </div>
                            </section>

                            {/* 2. 개인정보의 처리 및 보유기간 */}
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold border-b border-border pb-2">
                                    2. 개인정보의 처리 및 보유기간
                                </h2>
                                <div className="space-y-3 text-sm leading-relaxed">
                                    <p>
                                        회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
                                        개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                                    </p>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse border border-border">
                                            <thead>
                                                <tr className="bg-muted">
                                                    <th className="border border-border p-2 text-left">처리목적</th>
                                                    <th className="border border-border p-2 text-left">개인정보 항목</th>
                                                    <th className="border border-border p-2 text-left">보유기간</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="border border-border p-2">회원 관리</td>
                                                    <td className="border border-border p-2">이름, 이메일, 프로필 이미지</td>
                                                    <td className="border border-border p-2">회원 탈퇴 시까지</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-border p-2">서비스 제공</td>
                                                    <td className="border border-border p-2">체크리스트 데이터, 질문 답변</td>
                                                    <td className="border border-border p-2">회원 탈퇴 후 1년</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-border p-2">접속 기록</td>
                                                    <td className="border border-border p-2">IP 주소, 접속 시간, 이용 기록</td>
                                                    <td className="border border-border p-2">3개월</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-border p-2">고객 지원</td>
                                                    <td className="border border-border p-2">문의 내용, 답변 내용</td>
                                                    <td className="border border-border p-2">3년</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* 3. 개인정보의 제3자 제공 */}
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold border-b border-border pb-2">
                                    3. 개인정보의 제3자 제공
                                </h2>
                                <div className="space-y-3 text-sm leading-relaxed">
                                    <p>
                                        회사는 원칙적으로 정보주체의 개인정보를 수집·이용 목적으로 명시한 범위 내에서
                                        처리하며, 정보주체의 사전 동의 없이는 본래의 목적 범위를 초과하여
                                        처리하거나 제3자에게 제공하지 않습니다.
                                    </p>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                        <h4 className="font-medium mb-2">다만, 다음의 경우에는 예외로 합니다:</h4>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>정보주체가 사전에 동의한 경우</li>
                                            <li>법률에 특별한 규정이 있거나 법령상 의무를 준수하기 위하여 불가피한 경우</li>
                                            <li>공공기관이 법령 등에서 정하는 소관 업무의 수행을 위하여 불가피한 경우</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* 4. 개인정보처리의 위탁 */}
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold border-b border-border pb-2">
                                    4. 개인정보처리의 위탁
                                </h2>
                                <div className="space-y-3 text-sm leading-relaxed">
                                    <p>회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.</p>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse border border-border">
                                            <thead>
                                                <tr className="bg-muted">
                                                    <th className="border border-border p-2 text-left">위탁받는 업체</th>
                                                    <th className="border border-border p-2 text-left">위탁업무 내용</th>
                                                    <th className="border border-border p-2 text-left">위탁기간</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="border border-border p-2">Google LLC</td>
                                                    <td className="border border-border p-2">OAuth 인증 서비스</td>
                                                    <td className="border border-border p-2">회원 탈퇴 시까지</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-border p-2">Vercel Inc.</td>
                                                    <td className="border border-border p-2">웹 호스팅 서비스</td>
                                                    <td className="border border-border p-2">서비스 운영 기간</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-border p-2">OpenAI</td>
                                                    <td className="border border-border p-2">AI 기반 콘텐츠 생성</td>
                                                    <td className="border border-border p-2">서비스 운영 기간</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* 5. 정보주체의 권리·의무 및 행사방법 */}
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold border-b border-border pb-2">
                                    5. 정보주체의 권리·의무 및 행사방법
                                </h2>
                                <div className="space-y-3 text-sm leading-relaxed">
                                    <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>개인정보 처리현황 통지 요구</li>
                                        <li>개인정보 처리 정지 요구</li>
                                        <li>개인정보의 정정·삭제 요구</li>
                                        <li>손해배상 청구</li>
                                    </ul>
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                                        <h4 className="font-medium mb-2">권리 행사 방법:</h4>
                                        <p>위의 권리 행사는 서비스 내 설정 메뉴 또는 아래 연락처를 통해 요청하실 수 있습니다.</p>
                                    </div>
                                </div>
                            </section>

                            {/* 6. 처리하는 개인정보 항목 */}
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold border-b border-border pb-2">
                                    6. 처리하는 개인정보 항목
                                </h2>
                                <div className="space-y-3 text-sm leading-relaxed">
                                    <p>회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium mb-2">가. 필수항목</h4>
                                            <ul className="list-disc list-inside ml-4">
                                                <li>이름, 이메일 주소</li>
                                                <li>Google 계정 정보 (OAuth를 통해 제공되는 정보)</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-2">나. 선택항목</h4>
                                            <ul className="list-disc list-inside ml-4">
                                                <li>프로필 이미지</li>
                                                <li>서비스 이용 과정에서 생성되는 체크리스트 및 질문 답변</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-2">다. 자동 수집항목</h4>
                                            <ul className="list-disc list-inside ml-4">
                                                <li>IP 주소, 접속 시간, 서비스 이용 기록</li>
                                                <li>기기 정보 (브라우저 종류, OS)</li>
                                                <li>언어 설정, 지역 설정</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* 7. 개인정보의 파기 */}
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold border-b border-border pb-2">
                                    7. 개인정보의 파기
                                </h2>
                                <div className="space-y-3 text-sm leading-relaxed">
                                    <p>
                                        회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
                                        지체없이 해당 개인정보를 파기합니다.
                                    </p>
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-medium mb-2">가. 파기절차</h4>
                                            <p className="ml-4">
                                                이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져 내부 방침 및
                                                기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-2">나. 파기방법</h4>
                                            <ul className="list-disc list-inside ml-4 space-y-1">
                                                <li>전자적 파일 형태: 기록을 재생할 수 없도록 로우레벨 포맷 등의 방법 이용</li>
                                                <li>종이 문서: 분쇄하거나 소각하여 파기</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* 8. 개인정보 보호책임자 */}
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold border-b border-border pb-2">
                                    8. 개인정보 보호책임자
                                </h2>
                                <div className="space-y-3 text-sm leading-relaxed">
                                    <p>
                                        회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한
                                        정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                                    </p>
                                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                                        <h4 className="font-medium mb-3">개인정보 보호책임자</h4>
                                        <div className="space-y-1">
                                            <p><strong>성명:</strong> 개인정보보호책임자</p>
                                            <p><strong>직책:</strong> 개발팀장</p>
                                            <p><strong>연락처:</strong> privacy@nowwhat.co.kr</p>
                                        </div>
                                        <p className="mt-3 text-xs text-muted-foreground">
                                            ※ 개인정보 보호 관련 문의사항이 있으시면 언제든지 연락해 주시기 바랍니다.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* 9. 개인정보 처리방침의 변경 */}
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold border-b border-border pb-2">
                                    9. 개인정보 처리방침의 변경
                                </h2>
                                <div className="space-y-3 text-sm leading-relaxed">
                                    <p>
                                        이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가,
                                        삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
                                    </p>
                                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                        <h4 className="font-medium mb-2">이전 개인정보처리방침 이력</h4>
                                        <ul className="space-y-1 text-xs">
                                            <li>• 2025.01.01 - 최초 제정</li>
                                            <li>• 2025.01.06 - 개인정보 보호책임자 연락처 추가</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* 10. 권익침해 구제방법 */}
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold border-b border-border pb-2">
                                    10. 권익침해 구제방법
                                </h2>
                                <div className="space-y-3 text-sm leading-relaxed">
                                    <p>
                                        정보주체는 아래의 기관에 대해 개인정보 침해에 대한 신고나 상담을 하실 수 있습니다.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                            <h4 className="font-medium mb-2">개인정보보호위원회</h4>
                                            <div className="text-xs space-y-1">
                                                <p>• 신고전화: (국번없이) 182</p>
                                                <p>• 홈페이지: privacy.go.kr</p>
                                            </div>
                                        </div>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                            <h4 className="font-medium mb-2">대검찰청 사이버범죄수사단</h4>
                                            <div className="text-xs space-y-1">
                                                <p>• 신고전화: 02-3480-3573</p>
                                                <p>• 홈페이지: www.spo.go.kr</p>
                                            </div>
                                        </div>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                            <h4 className="font-medium mb-2">경찰청 사이버안전국</h4>
                                            <div className="text-xs space-y-1">
                                                <p>• 신고전화: (국번없이) 182</p>
                                                <p>• 홈페이지: cyberbureau.police.go.kr</p>
                                            </div>
                                        </div>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                            <h4 className="font-medium mb-2">개인정보 분쟁조정위원회</h4>
                                            <div className="text-xs space-y-1">
                                                <p>• 신고전화: (국번없이) 1833-6972</p>
                                                <p>• 홈페이지: www.kopico.go.kr</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </ScrollArea>

                    {/* 푸터 */}
                    <div className="text-center pt-8 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                            본 개인정보처리방침에 대한 문의가 있으시면 언제든지 연락해 주시기 바랍니다.
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                            © 2025 NowWhat. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}