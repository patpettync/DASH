"use client"

import { useState, useEffect, useCallback } from "react"
import { useLoading } from "@/contexts/loading-context"

interface UseDataFetchingOptions<T> {
  initialData?: T
  loadingKey?: string
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useDataFetching<T>(fetchFn: () => Promise<T>, options: UseDataFetchingOptions<T> = {}) {
  const { initialData, loadingKey, onSuccess, onError } = options
  const [data, setData] = useState<T | undefined>(initialData)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)
  const { startLoading, stopLoading, isLoading } = useLoading()

  // Track loading state changes from context
  useEffect(() => {
    if (loadingKey) {
      setLoading(isLoading(loadingKey))
    }
  }, [isLoading, loadingKey])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      if (loadingKey) {
        startLoading(loadingKey)
      }

      const result = await fetchFn()
      setData(result)
      setError(null)

      if (onSuccess) {
        onSuccess(result)
      }

      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)

      if (onError) {
        onError(error)
      }

      return undefined
    } finally {
      setLoading(false)
      if (loadingKey) {
        stopLoading(loadingKey)
      }
    }
  }, [fetchFn, loadingKey, onSuccess, onError, startLoading, stopLoading])

  // Fetch data on mount
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    error,
    isLoading: loading,
    refetch: fetchData,
  }
}
