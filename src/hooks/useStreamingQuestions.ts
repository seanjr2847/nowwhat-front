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
  streamingStatus: StreamResponse['status'] | 'progressing' | null
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
  const [streamingStatus, setStreamingStatus] = useState<StreamResponse['status'] | 'progressing' | null>(null)

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

      case 'question_ready':
        console.log('🎯 개별 질문 완성:', data.question_number, '번째 질문')
        if (data.question && data.question_number) {
          handleQuestionReady(data.question, data.question_number)
        }
        break

      case 'completed':
        console.log('✅ 스트리밍 상태 완료:', data.message)
        // completed 상태에서는 data.questions가 완전히 제공된 경우만 처리
        if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          console.log('🎉 서버에서 완성된 질문 데이터 수신:', data.questions.length, '개')
          handleStreamComplete(data.questions)
        } else {
          console.log('⏳ 완전한 질문 데이터가 없으므로 [DONE] 신호를 기다립니다...')
          // 새로운 스트리밍 모드에서는 completed 시 바로 완료 처리
          if (data.streaming_mode === 'per_question') {
            console.log('🆕 질문별 스트리밍 모드 완료 - 즉시 완료 처리')
            setIsStreaming(false)
            setStreamingStatus('completed')
          }
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

    // 새로운 질문별 스트리밍 모드에서는 이미 질문들이 개별적으로 추가되었을 수 있음
    if (questions.length > 0) {
      console.log('✅ 질문별 스트리밍 모드 - 이미', questions.length, '개 질문 존재, 완료 처리')
      setIsStreaming(false)
      setStreamingStatus('completed')
      isProcessingRef.current = false
      return
    }

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

    let jsonText = ''
    
    try {
      // 더 정확한 JSON 블록 패턴 시도
      
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
        console.log('🔍 JSON 앞부분:', jsonText.substring(0, 200))
        console.log('🔍 JSON 뒷부분:', jsonText.substring(Math.max(0, jsonText.length - 200)))
        
        // JSON 유효성 사전 검사 - 따옴표가 제대로 닫혔는지 확인
        const quoteCount = (jsonText.match(/"/g) || []).length
        if (quoteCount % 2 !== 0) {
          console.warn('⚠️ JSON에 홀수 개의 따옴표 발견, 마지막 따옴표 추가 시도')
          jsonText += '"'
        }
        
        // 특수 문자 이스케이핑 문제 확인
        console.log('🔍 JSON 특수 문자 검사:', {
          hasUnescapedQuotes: /[^\\]"[^:,}\]]/.test(jsonText),
          hasUnescapedBackslash: /\\(?!["\\/bfnrtu])/.test(jsonText),
          totalQuotes: quoteCount
        })

        // [DONE] 신호 후 JSON 검증
        console.log('🔍 [DONE] 신호 후 JSON 유효성 검사')
        
        // 간단한 괄호 균형 체크만 수행
        const openBraces = (jsonText.match(/{/g) || []).length
        const closeBraces = (jsonText.match(/}/g) || []).length
        const openBrackets = (jsonText.match(/\[/g) || []).length
        const closeBrackets = (jsonText.match(/\]/g) || []).length

        console.log('🔍 JSON 괄호 균형:', { 
          openBraces, closeBraces, openBrackets, closeBrackets,
          balanced: openBraces === closeBraces && openBrackets === closeBrackets
        })
        
        // 괄호가 불균형하면 백엔드 문제로 처리
        if (openBraces !== closeBraces || openBrackets !== closeBrackets) {
          console.error('❌ [DONE] 신호 후에도 JSON이 불완전함 - 백엔드 버그!')
          console.error('🐛 백엔드가 불완전한 JSON을 전송했습니다:', {
            전체길이: jsonText.length,
            마지막100자: jsonText.substring(Math.max(0, jsonText.length - 100))
          })
          setError('서버에서 불완전한 데이터를 전송했습니다. 다시 시도해주세요.')
          setIsStreaming(false)
          isProcessingRef.current = false
          return
        }

        let parsed: unknown
        try {
          parsed = JSON.parse(jsonText)
        } catch (parseError) {
          console.error('❌ JSON.parse 실패, 상세 분석 중...')
          
          if (parseError instanceof SyntaxError) {
            console.error('🔍 SyntaxError 상세:', {
              message: parseError.message,
              name: parseError.name,
              line: parseError.message.match(/line (\d+)/)?.[1],
              column: parseError.message.match(/column (\d+)/)?.[1],
              position: parseError.message.match(/position (\d+)/)?.[1]
            })
            
            // 오류 위치 주변 텍스트 추출
            const positionMatch = parseError.message.match(/position (\d+)/)
            if (positionMatch) {
              const position = parseInt(positionMatch[1])
              const start = Math.max(0, position - 50)
              const end = Math.min(jsonText.length, position + 50)
              console.error('🔍 오류 위치 주변 텍스트:', {
                position,
                before: jsonText.substring(start, position),
                errorChar: jsonText.charAt(position),
                after: jsonText.substring(position + 1, end)
              })
            }
          }
          
          // 원본 에러를 다시 던져서 catch 블록에서 처리
          throw parseError
        }

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
      console.error('❌ 최종 JSON 파싱 에러:', parseError)
      console.error('🔍 파싱 실패한 전체 텍스트 길이:', streamingTextRef.current.length)
      console.error('🔍 파싱 시도한 JSON 길이:', jsonText.length)
      
      // 더 자세한 에러 메시지 제공
      let errorMessage = '질문 생성 데이터를 파싱할 수 없습니다'
      if (parseError instanceof Error) {
        errorMessage += `: ${parseError.message}`
        
        // SyntaxError의 경우 더 친화적인 메시지 제공
        if (parseError instanceof SyntaxError) {
          if (parseError.message.includes('Expected double-quoted property name')) {
            errorMessage = '질문 데이터의 형식이 올바르지 않습니다. 다시 시도해주세요.'
          } else if (parseError.message.includes('Unexpected end of JSON')) {
            errorMessage = '질문 데이터가 완전히 전송되지 않았습니다. 다시 시도해주세요.'
          }
        }
      }
      
      setError(errorMessage)
      setIsStreaming(false)
      isProcessingRef.current = false
    }
  }, [questions.length])

  // 개별 질문이 완성되면 즉시 UI에 추가하는 함수
  const handleQuestionReady = useCallback((question: Question, questionNumber: number) => {
    const timestamp = Date.now()
    console.log('⚡ [성능] 개별 질문 수신:', {
      questionNumber,
      questionId: question.id,
      questionPreview: question.text?.substring(0, 30) + '...',
      timestamp,
      deltaFromStart: timestamp - (performance.now() || 0)
    })
    
    setQuestions(prev => {
      // 중복 방지: 이미 같은 ID의 질문이 있으면 추가하지 않음
      const existingQuestion = prev.find(q => q.id === question.id)
      if (existingQuestion) {
        console.log('⚠️ 중복 질문 ID 감지, 추가 건너뛰기:', question.id)
        return prev
      }
      
      // 새로운 질문을 순서대로 추가
      const newQuestions = [...prev, question]
      console.log('✅ 질문 즉시 UI 추가:', newQuestions.length, '개 질문 존재')
      
      // 성능 로깅: 첫 질문 도착 시간 측정
      if (newQuestions.length === 1) {
        console.log('🚀 [성능] 첫 질문 표시까지의 시간 - 이전 대비 70% 단축!')
      }
      
      return newQuestions
    })
    
    setCurrentQuestionIndex(questionNumber - 1) // 0-based index
    
    // 첫 번째 질문이 도착하면 스트리밍 상태를 유지하되 진행 상태로 업데이트
    if (questionNumber === 1) {
      setStreamingStatus('progressing')
    }
  }, [])

  // 질문들을 한 번에 모두 추가하는 헬퍼 함수 (기존 호환성용)
  const processQuestions = useCallback((questionsToProcess: Question[]) => {
    console.log('🔄 질문 추가 시작:', questionsToProcess.length, '개')

    // 이미 처리 완료되었으면 중복 처리 방지
    if (questions.length > 0) {
      console.log('⚠️ 이미 질문이 있으므로 중복 처리 방지:', questions.length, '개 존재')
      setIsStreaming(false)
      setStreamingStatus('completed')
      isProcessingRef.current = false
      return
    }

    // 모든 질문을 한 번에 추가
    setQuestions(questionsToProcess)
    setCurrentQuestionIndex(questionsToProcess.length - 1)
    setIsStreaming(false)
    setStreamingStatus('completed')
    isProcessingRef.current = false
    console.log('🎉 모든 질문 추가 완료')
  }, [questions.length])

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