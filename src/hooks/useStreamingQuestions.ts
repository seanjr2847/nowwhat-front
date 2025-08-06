import { useCallback, useRef, useState } from 'react'
import { generateQuestionsStream, type Question, type StreamResponse } from '../lib/api'

export interface UseStreamingQuestionsReturn {
  /** 현재 스트리밍 텍스트 */
  streamingText: string
  /** 스트리밍 진행 중 여부 */
  isStreaming: boolean
  /** 에러 메시지 */
  error: string | null
  /** 완료된 질문들 */
  questions: Question[]
  /** 현재 생성 중인 질문 인덱스 */
  currentQuestionIndex: number
  /** 스트리밍 시작 함수 */
  startStreaming: (sessionId: string, goal: string, intentTitle: string) => Promise<void>
  /** 스트리밍 중단 함수 */
  stopStreaming: () => void
  /** 상태 초기화 함수 */
  resetStreaming: () => void
  /** 현재 스트리밍 상태 */
  streamingStatus: StreamResponse['status'] | null
}

/**
 * 스트리밍 질문 생성을 위한 React Hook
 * ChatGPT 스타일의 실시간 타이핑 효과 제공
 */
export function useStreamingQuestions(): UseStreamingQuestionsReturn {
  const [streamingText, setStreamingText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [streamingStatus, setStreamingStatus] = useState<StreamResponse['status'] | null>(null)

  // 스트리밍 중단을 위한 AbortController
  const abortControllerRef = useRef<AbortController | null>(null)
  // 질문을 순차적으로 추가하기 위한 타이머
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null)
  // 최신 streamingText 값을 참조하기 위한 ref
  const streamingTextRef = useRef<string>('')
  // 중복 처리 방지를 위한 플래그
  const isProcessingRef = useRef<boolean>(false)

  const handleStreamData = useCallback((data: StreamResponse) => {
    setStreamingStatus(data.status)

    switch (data.status) {
      case 'started':
        console.log('🚀 스트리밍 시작:', data.message)
        setStreamingText('')
        streamingTextRef.current = ''
        break

      case 'generating':
        if (data.chunk) {
          setStreamingText(prev => {
            const newText = prev + data.chunk
            streamingTextRef.current = newText
            return newText
          })
        }
        // generating 단계에서는 절대 파싱하지 않음
        break

      case 'completed':
        console.log('✅ 스트리밍 상태 완료:', data.message)
        // completed 상태에서는 data.questions가 완전히 제공된 경우만 처리
        if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          console.log('🎉 서버에서 완성된 질문 데이터 수신:', data.questions.length, '개')
          handleStreamComplete(data.questions)
        } else {
          console.log('⏳ 완전한 질문 데이터가 없으므로 [DONE] 신호를 기다립니다...')
        }
        break

      case 'error':
        console.error('❌ 스트리밍 에러:', data.error)
        setError(data.error || 'Unknown streaming error')
        setIsStreaming(false)
        break
    }
  }, [])

  const handleStreamComplete = useCallback((completedQuestions: Question[] | undefined) => {
    console.log('🎉 [DONE] 신호 수신 - 최종 처리 시작')

    // 이미 처리 중이면 중복 처리 방지
    if (isProcessingRef.current) {
      console.log('⚠️ 이미 처리 중이므로 중복 처리 방지')
      return
    }
    isProcessingRef.current = true

    // 이미 완성된 질문 데이터가 있으면 바로 사용 (최우선)
    if (completedQuestions && Array.isArray(completedQuestions) && completedQuestions.length > 0) {
      console.log('✅ [DONE] 신호와 함께 전달받은 완성된 질문 데이터 사용:', completedQuestions.length, '개')
      processQuestions(completedQuestions)
      return
    }

    // 완성된 데이터가 없는 경우에만 마지막 수단으로 텍스트 파싱 시도
    console.log('⚠️ [DONE] 신호 수신했지만 완성된 질문 데이터가 없음 - 텍스트 파싱 시도')
    console.log('📄 전체 누적 텍스트 길이:', streamingTextRef.current.length)
    
    // 텍스트가 충분히 누적되었는지 확인
    if (streamingTextRef.current.length < 50) {
      console.error('❌ 누적된 텍스트가 너무 짧아서 파싱 불가:', streamingTextRef.current.length, '글자')
      setError('스트리밍 데이터가 충분하지 않습니다. 다시 시도해주세요.')
      setIsStreaming(false)
      isProcessingRef.current = false
      return
    }

    console.log('📄 텍스트 샘플 (첫 300자):', streamingTextRef.current.substring(0, 300))
    console.log('📄 텍스트 샘플 (마지막 300자):', streamingTextRef.current.substring(Math.max(0, streamingTextRef.current.length - 300)))

    try {
      // 더 정확한 JSON 블록 패턴 시도
      let jsonText = ''
      
      // 1. 완전한 ```json...``` 패턴 (개행 포함)
      let jsonMatch = streamingTextRef.current.match(/```json\n([\s\S]*?)\n```/)
      if (jsonMatch) {
        jsonText = jsonMatch[1].trim()
        console.log('🔍 완전한 JSON 블록 패턴으로 추출 성공:', jsonText.length, '글자')
      } else {
        // 2. 불완전한 ```json...``` 패턴 (```이 끝에 없을 수 있음)
        jsonMatch = streamingTextRef.current.match(/```json\n?([\s\S]*)/)
        if (jsonMatch) {
          let rawJson = jsonMatch[1]
          // 끝의 ``` 제거
          if (rawJson.endsWith('```')) {
            rawJson = rawJson.slice(0, -3)
          }
          jsonText = rawJson.trim()
          console.log('🔍 불완전한 JSON 블록 패턴으로 추출 성공:', jsonText.length, '글자')
        } else {
          // 3. questions 키워드로 시작하는 JSON 찾기
          const questionsStart = streamingTextRef.current.indexOf('{\n  "questions"')
          if (questionsStart === -1) {
            // 다른 형태의 questions 찾기
            const altQuestionsStart = streamingTextRef.current.indexOf('{"questions"')
            if (altQuestionsStart !== -1) {
              // 여기서부터 끝까지 가져와서 완전한 JSON 구성 시도
              let candidateJson = streamingTextRef.current.substring(altQuestionsStart).trim()
              // 끝의 ``` 제거
              if (candidateJson.endsWith('```')) {
                candidateJson = candidateJson.slice(0, -3).trim()
              }
              jsonText = candidateJson
              console.log('🔍 대체 questions 패턴으로 추출 성공:', jsonText.length, '글자')
            }
          } else {
            // 여기서부터 끝까지 또는 ``` 까지
            const remaining = streamingTextRef.current.substring(questionsStart)
            const endMarker = remaining.indexOf('\n```')
            if (endMarker !== -1) {
              jsonText = remaining.substring(0, endMarker).trim()
            } else {
              jsonText = remaining.trim()
              // 끝의 ``` 제거
              if (jsonText.endsWith('```')) {
                jsonText = jsonText.slice(0, -3).trim()
              }
            }
            console.log('🔍 questions 시작 패턴으로 추출 성공:', jsonText.length, '글자')
          }
        }
      }

      if (jsonText) {
        console.log('🔍 최종 추출된 JSON 길이:', jsonText.length)
        console.log('🔍 JSON 앞부분:', jsonText.substring(0, 300))
        console.log('🔍 JSON 뒷부분:', jsonText.substring(Math.max(0, jsonText.length - 300)))

        // JSON이 완전한지 엄격하게 검증 ([DONE] 신호 후에만 호출되므로)
        const openBraces = (jsonText.match(/{/g) || []).length
        const closeBraces = (jsonText.match(/}/g) || []).length
        const openBrackets = (jsonText.match(/\[/g) || []).length
        const closeBrackets = (jsonText.match(/\]/g) || []).length

        console.log('🔍 [DONE] 후 JSON 완전성 검사:', { 
          openBraces, closeBraces, openBrackets, closeBrackets,
          braceMatch: openBraces === closeBraces,
          bracketMatch: openBrackets === closeBrackets
        })

        // JSON이 불완전한 경우 복구 시도
        if (openBraces !== closeBraces || openBrackets !== closeBrackets) {
          console.warn('⚠️ JSON 괄호 불일치 감지 - 복구 시도 중...')
          console.log('🔧 복구 전 JSON 끝부분:', jsonText.substring(Math.max(0, jsonText.length - 200)))
          
          // 부족한 닫는 괄호 개수 계산
          const missingBraces = openBraces - closeBraces
          const missingBrackets = openBrackets - closeBrackets
          
          // 적절한 닫는 괄호 추가
          let fixedJson = jsonText
          for (let i = 0; i < missingBrackets; i++) {
            fixedJson += ']'
          }
          for (let i = 0; i < missingBraces; i++) {
            fixedJson += '}'
          }
          
          console.log('🔧 복구 후 JSON 끝부분:', fixedJson.substring(Math.max(0, fixedJson.length - 200)))
          console.log('🔧 추가된 괄호:', { 추가된_중괄호: missingBraces, 추가된_대괄호: missingBrackets })
          
          jsonText = fixedJson
        }

        const parsed: unknown = JSON.parse(jsonText)

        // 타입 가드로 안전하게 검증
        if (
          parsed !== null &&
          typeof parsed === 'object' &&
          'questions' in parsed &&
          Array.isArray(parsed.questions)
        ) {
          // questions 배열의 각 요소가 Question 타입인지 검증
          const questions = parsed.questions as unknown[]
          const validQuestions: Question[] = []

          for (const q of questions) {
            if (
              q !== null &&
              typeof q === 'object' &&
              'id' in q &&
              'text' in q &&
              'type' in q &&
              'required' in q &&
              typeof q.id === 'string' &&
              typeof q.text === 'string' &&
              typeof q.type === 'string' &&
              typeof q.required === 'boolean'
            ) {
              validQuestions.push(q as Question)
            }
          }

          if (validQuestions.length > 0) {
            console.log('✅ JSON 파싱 성공:', validQuestions.length, '개 질문')
            processQuestions(validQuestions)
          } else {
            console.error('❌ 유효한 질문 데이터가 없음')
            setError('질문 데이터가 올바른 형식이 아닙니다.')
            setIsStreaming(false)
            isProcessingRef.current = false
          }
        } else {
          console.error('❌ 파싱된 데이터에 questions 배열이 없음:', parsed)
          setError('질문 데이터 형식이 올바르지 않습니다.')
          setIsStreaming(false)
          isProcessingRef.current = false
        }
      } else {
        console.error('❌ JSON 블록을 찾을 수 없음')
        console.log('🔍 텍스트 패턴 검색 결과:')
        console.log('  - ```json 패턴:', streamingTextRef.current.includes('```json'))
        console.log('  - ``` 패턴:', streamingTextRef.current.includes('```'))
        console.log('  - questions 키워드:', streamingTextRef.current.includes('"questions"'))
        console.log('  - { 패턴:', streamingTextRef.current.includes('{'))
        console.log('  - } 패턴:', streamingTextRef.current.includes('}'))
        setError('질문 생성 데이터를 찾을 수 없습니다.')
        setIsStreaming(false)
        isProcessingRef.current = false
      }
    } catch (parseError) {
      console.error('❌ JSON 파싱 에러:', parseError)
      setError(`질문 생성 데이터를 파싱할 수 없습니다: ${parseError instanceof Error ? parseError.message : String(parseError)}`)
      setIsStreaming(false)
      isProcessingRef.current = false
    }
  }, [])

  // 질문들을 순차적으로 추가하는 헬퍼 함수
  const processQuestions = useCallback((questionsToProcess: Question[]) => {
    console.log('🔄 질문 순차 추가 시작:', questionsToProcess.length, '개')

    // 질문을 하나씩 순차적으로 추가
    let currentIndex = 0
    const addQuestionSequentially = () => {
      if (currentIndex < questionsToProcess.length) {
        setQuestions(prev => [...prev, questionsToProcess[currentIndex]])
        setCurrentQuestionIndex(currentIndex)
        currentIndex++

        // 다음 질문을 500ms 후에 추가
        questionTimerRef.current = setTimeout(addQuestionSequentially, 500)
      } else {
        // 모든 질문 추가 완료
        console.log('🎉 모든 질문 순차 추가 완료')
        setIsStreaming(false)
        setStreamingStatus('completed')
        setCurrentQuestionIndex(questionsToProcess.length - 1)
      }
    }

    // 기존 질문 초기화 후 순차적 추가 시작
    setQuestions([])
    setCurrentQuestionIndex(0)
    addQuestionSequentially()
  }, [])

  const handleStreamError = useCallback((errorMessage: string) => {
    console.error('💥 스트리밍 에러:', errorMessage)
    setError(errorMessage)
    setIsStreaming(false)
    setStreamingStatus('error')
  }, [])

  const startStreaming = useCallback(async (
    sessionId: string,
    goal: string,
    intentTitle: string
  ) => {
    // 이전 상태 초기화
    setStreamingText('')
    streamingTextRef.current = ''
    setError(null)
    setQuestions([])
    setCurrentQuestionIndex(0)
    setIsStreaming(true)
    setStreamingStatus('started')
    isProcessingRef.current = false

    // 기존 타이머 정리
    if (questionTimerRef.current) {
      clearTimeout(questionTimerRef.current)
      questionTimerRef.current = null
    }

    // 새로운 AbortController 생성
    abortControllerRef.current = new AbortController()

    try {
      await generateQuestionsStream(
        sessionId,
        goal,
        intentTitle,
        handleStreamData,
        handleStreamComplete,
        handleStreamError
      )
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        handleStreamError(err.message)
      }
    }
  }, [handleStreamData, handleStreamComplete, handleStreamError])

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    if (questionTimerRef.current) {
      clearTimeout(questionTimerRef.current)
      questionTimerRef.current = null
    }
    setIsStreaming(false)
    setStreamingStatus(null)
    console.log('⏹️ 스트리밍 중단됨')
  }, [])

  const resetStreaming = useCallback(() => {
    stopStreaming()
    setStreamingText('')
    streamingTextRef.current = ''
    setError(null)
    setQuestions([])
    setCurrentQuestionIndex(0)
    setStreamingStatus(null)
    isProcessingRef.current = false
    console.log('🔄 스트리밍 상태 초기화됨')
  }, [stopStreaming])

  return {
    streamingText,
    isStreaming,
    error,
    questions,
    currentQuestionIndex,
    startStreaming,
    stopStreaming,
    resetStreaming,
    streamingStatus
  }
}

export default useStreamingQuestions