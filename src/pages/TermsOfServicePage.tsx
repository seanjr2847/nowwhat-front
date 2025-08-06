import { FileText, Clock, Users, Shield, Settings, AlertTriangle, Scale, Phone, Eye, CheckCircle, XCircle, BookOpen, Gavel } from "lucide-react"

export function TermsOfServicePage() {
    const sections = [
        { id: "purpose", title: "목적", icon: FileText },
        { id: "definitions", title: "정의", icon: BookOpen },
        { id: "terms", title: "약관의 효력과 변경", icon: Eye },
        { id: "service", title: "서비스의 제공 및 변경", icon: Settings },
        { id: "interruption", title: "서비스의 중단", icon: AlertTriangle },
        { id: "membership", title: "회원가입", icon: Users },
        { id: "withdrawal", title: "회원탈퇴 및 자격상실", icon: XCircle },
        { id: "notice", title: "회원에 대한 통지", icon: Clock },
        { id: "user-duties", title: "이용자의 의무", icon: CheckCircle },
        { id: "company-duties", title: "회사의 의무", icon: Shield },
        { id: "privacy", title: "개인정보보호", icon: Shield },
        { id: "copyright", title: "저작권의 귀속 및 이용제한", icon: FileText },
        { id: "liability", title: "손해배상 및 면책조항", icon: AlertTriangle },
        { id: "dispute", title: "분쟁해결", icon: Scale },
        { id: "jurisdiction", title: "재판권 및 준거법", icon: Gavel },
        { id: "support", title: "고객센터", icon: Phone }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20">
            {/* 네비게이션 바 */}
            <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">서비스 이용약관</h1>
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
                                    <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    <h2 className="font-semibold text-slate-900 dark:text-slate-100">목차</h2>
                                </div>
                                <nav className="space-y-1">
                                    {sections.map((section, index) => (
                                        <a
                                            key={section.id}
                                            href={`#${section.id}`}
                                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                                        >
                                            <div className="flex items-center justify-center w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-md group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                                                {section.title}
                                            </span>
                                        </a>
                                    ))}
                                </nav>
                            </div>

                            {/* 빠른 정보 */}
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50 p-6">
                                <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-3">빠른 정보</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        <span className="text-emerald-800 dark:text-emerald-200">시행일: 2025.01.01</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                        <span className="text-emerald-800 dark:text-emerald-200">최종수정: 2025.01.06</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Phone className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                        <span className="text-emerald-800 dark:text-emerald-200">문의: support@nowwhat.co.kr</span>
                                    </div>
                                </div>
                            </div>

                            {/* AI 서비스 특별 안내 */}
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl border border-amber-200/50 dark:border-amber-800/50 p-6">
                                <div className="flex items-center space-x-2 mb-3">
                                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                    <h3 className="font-semibold text-amber-900 dark:text-amber-100">AI 서비스 안내</h3>
                                </div>
                                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                                    본 서비스는 AI 기반 콘텐츠 생성을 포함하며, 
                                    생성된 결과는 참고용으로만 활용하시기 바랍니다.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 메인 콘텐츠 */}
                    <div className="lg:col-span-3">
                        <div className="space-y-8">
                            {/* 헤더 */}
                            <div className="text-center space-y-6 py-8">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl mb-6">
                                    <FileText className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 dark:from-slate-100 dark:via-emerald-100 dark:to-teal-100 bg-clip-text text-transparent">
                                    서비스 이용약관
                                </h1>
                                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                                    NowWhat 서비스를 이용해 주셔서 감사합니다.<br />
                                    본 약관을 자세히 읽어보신 후 동의하여 주시기 바랍니다.
                                </p>
                            </div>

                            {/* 콘텐츠 카드들 */}
                            <div className="space-y-6">
                                {/* 제1조 목적 */}
                                <section id="purpose" className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-6 border-b border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">제1조 (목적)</h2>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm">약관의 적용 범위와 목적</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                            이 약관은 NowWhat(이하 "회사"라 함)이 제공하는 AI 기반 체크리스트 생성 서비스(이하 "서비스"라 함)의
                                            이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                                        </p>
                                    </div>
                                </section>

                                {/* 제2조 정의 */}
                                <section id="definitions" className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 border-b border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">제2조 (정의)</h2>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm">주요 용어의 정의</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">이 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
                                        <div className="space-y-3">
                                            {[
                                                { term: "서비스", def: "회사가 제공하는 AI 기반 체크리스트 생성, 질문 생성, 개인화된 콘텐츠 제공 등의 온라인 서비스" },
                                                { term: "이용자", def: "회사의 약관에 따라 서비스를 이용하는 회원 및 비회원" },
                                                { term: "회원", def: "회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 서비스를 계속 이용할 수 있는 자" },
                                                { term: "콘텐츠", def: "회사가 서비스에서 제공하는 체크리스트, 질문, 답변, 설명 등 일체의 정보" }
                                            ].map((item, index) => (
                                                <div key={index} className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                                                    <div className="flex items-start space-x-3">
                                                        <div className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-md mt-0.5">
                                                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{index + 1}</span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">"{item.term}"</h4>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400">{item.def}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                {/* 주요 조항들 간소화 */}
                                {[
                                    {
                                        id: "service",
                                        title: "제4조 (서비스의 제공 및 변경)",
                                        icon: Settings,
                                        color: "from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
                                        iconBg: "bg-green-100 dark:bg-green-900/30",
                                        iconColor: "text-green-600 dark:text-green-400",
                                        content: "AI 기반 체크리스트 생성, 개인화된 질문 생성, 체크리스트 저장 및 관리, 사용자 맞춤형 콘텐츠 추천 서비스 등을 제공합니다. 서비스 품질 향상을 위해 내용을 변경할 수 있으며, 변경 시 7일 전 공지합니다."
                                    },
                                    {
                                        id: "membership",
                                        title: "제6조 (회원가입)",
                                        icon: Users,
                                        color: "from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30",
                                        iconBg: "bg-purple-100 dark:bg-purple-900/30",
                                        iconColor: "text-purple-600 dark:text-purple-400",
                                        content: "Google OAuth를 통한 간편 회원가입이 가능합니다. 만 14세 미만, 허위정보 기재, 이전 자격상실자는 가입이 제한될 수 있습니다."
                                    },
                                    {
                                        id: "user-duties",
                                        title: "제9조 (이용자의 의무)",
                                        icon: CheckCircle,
                                        color: "from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30",
                                        iconBg: "bg-red-100 dark:bg-red-900/30",
                                        iconColor: "text-red-600 dark:text-red-400",
                                        content: "허위정보 등록, 타인정보 도용, 저작권 침해, 공서양속 위반, 영리목적 이용, 서비스 운영 방해 등의 행위를 금지합니다."
                                    },
                                    {
                                        id: "liability",
                                        title: "제13조 (손해배상 및 면책조항)",
                                        icon: AlertTriangle,
                                        color: "from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30",
                                        iconBg: "bg-orange-100 dark:bg-orange-900/30",
                                        iconColor: "text-orange-600 dark:text-orange-400",
                                        content: "무료 서비스에 대해서는 고의·중과실을 제외하고 책임을 지지 않습니다. AI 생성 콘텐츠는 참고용으로만 활용하시기 바라며, 최종 의사결정은 이용자 책임입니다."
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

                                {/* 고객센터 */}
                                <section id="support" className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 p-6 border-b border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
                                                <Phone className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">제16조 (고객센터)</h2>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm">문의사항 및 불만 접수</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 rounded-xl border border-teal-200/50 dark:border-teal-800/50 p-6">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <Phone className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                                                <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-100">NowWhat 고객센터</h3>
                                            </div>
                                            <div className="grid gap-3 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-16 text-teal-700 dark:text-teal-300 font-medium">이메일:</span>
                                                    <span className="text-teal-800 dark:text-teal-200 font-mono">support@nowwhat.co.kr</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-16 text-teal-700 dark:text-teal-300 font-medium">운영:</span>
                                                    <span className="text-teal-800 dark:text-teal-200">평일 09:00 - 18:00 (주말 및 공휴일 제외)</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-teal-600 dark:text-teal-400 mt-4">
                                                ※ 빠르고 정확한 상담을 위해 이메일로 문의해 주시기 바랍니다.
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* 푸터 */}
                            <div className="text-center pt-12 pb-8">
                                <div className="bg-gradient-to-r from-slate-50 to-emerald-50 dark:from-slate-800 dark:to-emerald-950/30 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                                    <div className="flex items-center justify-center space-x-2 mb-6">
                                        <FileText className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                                        <Scale className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">이용약관 문의</h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
                                        본 이용약관에 대한 문의가 있으시면 언제든지 연락해 주시기 바랍니다.<br />
                                        <strong>시행일:</strong> 2025년 1월 1일 | <strong>최종 수정일:</strong> 2025년 1월 6일
                                    </p>
                                    <div className="flex items-center justify-center space-x-2 text-sm">
                                        <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">support@nowwhat.co.kr</span>
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