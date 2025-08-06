import { Shield, Clock, FileText, Users, AlertTriangle, Database, Globe, UserCheck, Phone, Scale, Eye } from "lucide-react"

export function PrivacyPolicyPage() {
    const sections = [
        { id: "purpose", title: "개인정보의 처리목적", icon: Users },
        { id: "retention", title: "개인정보의 처리 및 보유기간", icon: Clock },
        { id: "third-party", title: "개인정보의 제3자 제공", icon: Globe },
        { id: "outsourcing", title: "개인정보처리의 위탁", icon: Database },
        { id: "rights", title: "정보주체의 권리·의무 및 행사방법", icon: UserCheck },
        { id: "items", title: "처리하는 개인정보 항목", icon: FileText },
        { id: "destruction", title: "개인정보의 파기", icon: AlertTriangle },
        { id: "officer", title: "개인정보 보호책임자", icon: Phone },
        { id: "changes", title: "개인정보 처리방침의 변경", icon: Eye },
        { id: "remedy", title: "권익침해 구제방법", icon: Scale }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20">
            {/* 네비게이션 바 */}
            <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">개인정보처리방침</h1>
                        <div className="text-sm text-slate-500 dark:text-slate-400">v2.0 • 2025.01.06</div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* 사이드바 목차 */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <h2 className="font-semibold text-slate-900 dark:text-slate-100">목차</h2>
                                </div>
                                <nav className="space-y-2">
                                    {sections.map((section, index) => (
                                        <a
                                            key={section.id}
                                            href={`#${section.id}`}
                                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                                        >
                                            <div className="flex items-center justify-center w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-md group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {section.title}
                                            </span>
                                        </a>
                                    ))}
                                </nav>
                            </div>

                            {/* 빠른 정보 */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 p-6">
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">빠른 정보</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        <span className="text-blue-800 dark:text-blue-200">시행일: 2025.01.01</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        <span className="text-blue-800 dark:text-blue-200">최종수정: 2025.01.06</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Phone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        <span className="text-blue-800 dark:text-blue-200">문의: privacy@nowwhat.co.kr</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 메인 콘텐츠 */}
                    <div className="lg:col-span-3">
                        <div className="space-y-8">
                            {/* 헤더 */}
                            <div className="text-center space-y-6 py-8">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl mb-6">
                                    <Shield className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                                    개인정보처리방침
                                </h1>
                                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                                    NowWhat은 사용자의 개인정보 보호를 최우선으로 하며,<br />
                                    개인정보보호법 등 관련 법령을 준수합니다.
                                </p>
                            </div>

                            {/* 콘텐츠 카드들 */}
                            <div className="space-y-8">
                                {/* 1. 개인정보의 처리목적 */}
                                <section id="purpose" className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 border-b border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">1. 개인정보의 처리목적</h2>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm">회사가 개인정보를 수집하고 이용하는 목적</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                            NowWhat('회사'라 함)은 다음의 목적을 위하여 개인정보를 처리합니다.
                                            처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
                                            이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                                        </p>
                                        <div className="grid gap-3">
                                            {[
                                                { title: "회원 가입 및 관리", desc: "회원 가입의사 확인, 회원제 서비스 제공, 본인확인", color: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/30" },
                                                { title: "서비스 제공", desc: "AI 기반 체크리스트 생성, 개인화된 질문 제공, 사용자 맞춤형 콘텐츠 제공", color: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800/30" },
                                                { title: "서비스 개선", desc: "이용 현황 분석, 서비스 품질 향상, 신규 서비스 개발", color: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/30" },
                                                { title: "고객 지원", desc: "문의사항 처리, 공지사항 전달, 불만처리", color: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800/30" },
                                                { title: "법적 의무 이행", desc: "관련 법령에 따른 의무 이행", color: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/30" }
                                            ].map((item, index) => (
                                                <div key={index} className={`p-4 rounded-xl border ${item.color}`}>
                                                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{item.title}</h4>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                {/* 2. 개인정보의 처리 및 보유기간 */}
                                <section id="retention" className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-6 border-b border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                                <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">2. 개인정보의 처리 및 보유기간</h2>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm">개인정보 보유 및 이용 기간</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                                            회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 
                                            동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                                        </p>
                                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6">
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-slate-200 dark:border-slate-700">
                                                            <th className="text-left p-3 font-semibold text-slate-800 dark:text-slate-200">처리목적</th>
                                                            <th className="text-left p-3 font-semibold text-slate-800 dark:text-slate-200">개인정보 항목</th>
                                                            <th className="text-left p-3 font-semibold text-slate-800 dark:text-slate-200">보유기간</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="text-sm">
                                                        <tr className="border-b border-slate-100 dark:border-slate-800">
                                                            <td className="p-3 text-slate-700 dark:text-slate-300">회원 관리</td>
                                                            <td className="p-3 text-slate-700 dark:text-slate-300">이름, 이메일, 프로필 이미지</td>
                                                            <td className="p-3"><span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-md text-xs font-medium">회원 탈퇴 시까지</span></td>
                                                        </tr>
                                                        <tr className="border-b border-slate-100 dark:border-slate-800">
                                                            <td className="p-3 text-slate-700 dark:text-slate-300">서비스 제공</td>
                                                            <td className="p-3 text-slate-700 dark:text-slate-300">체크리스트 데이터, 질문 답변</td>
                                                            <td className="p-3"><span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-md text-xs font-medium">회원 탈퇴 후 1년</span></td>
                                                        </tr>
                                                        <tr className="border-b border-slate-100 dark:border-slate-800">
                                                            <td className="p-3 text-slate-700 dark:text-slate-300">접속 기록</td>
                                                            <td className="p-3 text-slate-700 dark:text-slate-300">IP 주소, 접속 시간, 이용 기록</td>
                                                            <td className="p-3"><span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-2 py-1 rounded-md text-xs font-medium">3개월</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="p-3 text-slate-700 dark:text-slate-300">고객 지원</td>
                                                            <td className="p-3 text-slate-700 dark:text-slate-300">문의 내용, 답변 내용</td>
                                                            <td className="p-3"><span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded-md text-xs font-medium">3년</span></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* 간소화된 나머지 섹션들 */}
                                {[
                                    {
                                        id: "third-party",
                                        title: "3. 개인정보의 제3자 제공",
                                        icon: Globe,
                                        color: "from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30",
                                        iconBg: "bg-purple-100 dark:bg-purple-900/30",
                                        iconColor: "text-purple-600 dark:text-purple-400",
                                        content: "회사는 원칙적으로 정보주체의 개인정보를 수집·이용 목적으로 명시한 범위 내에서 처리하며, 정보주체의 사전 동의 없이는 본래의 목적 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다."
                                    },
                                    {
                                        id: "outsourcing",
                                        title: "4. 개인정보처리의 위탁",
                                        icon: Database,
                                        color: "from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30",
                                        iconBg: "bg-orange-100 dark:bg-orange-900/30",
                                        iconColor: "text-orange-600 dark:text-orange-400",
                                        content: "원활한 개인정보 업무처리를 위하여 Google LLC, Vercel Inc., OpenAI 등에 개인정보 처리업무를 위탁하고 있습니다."
                                    },
                                    {
                                        id: "rights",
                                        title: "5. 정보주체의 권리·의무 및 행사방법",
                                        icon: UserCheck,
                                        color: "from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30",
                                        iconBg: "bg-teal-100 dark:bg-teal-900/30",
                                        iconColor: "text-teal-600 dark:text-teal-400",
                                        content: "정보주체는 개인정보 처리현황 통지 요구, 처리 정지 요구, 정정·삭제 요구, 손해배상 청구 등의 권리를 행사할 수 있습니다."
                                    }
                                ].map((section) => (
                                    <section key={section.id} id={section.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                        <div className={`bg-gradient-to-r ${section.color} p-6 border-b border-slate-200 dark:border-slate-700`}>
                                            <div className="flex items-center space-x-3">
                                                <div className={`flex items-center justify-center w-10 h-10 ${section.iconBg} rounded-xl`}>
                                                    <section.icon className={`w-5 h-5 ${section.iconColor}`} />
                                                </div>
                                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{section.title}</h2>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{section.content}</p>
                                        </div>
                                    </section>
                                ))}
                            </div>

                            {/* 푸터 */}
                            <div className="text-center pt-12 pb-8">
                                <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-950/30 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                                    <Shield className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">개인정보 보호 문의</h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                                        본 개인정보처리방침에 대한 문의가 있으시면 언제든지 연락해 주시기 바랍니다.
                                    </p>
                                    <div className="flex items-center justify-center space-x-2 text-sm">
                                        <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        <span className="text-blue-600 dark:text-blue-400 font-medium">privacy@nowwhat.co.kr</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">
                                        © 2025 NowWhat. All rights reserved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}