import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export function useDataFetch(url, options = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(url, options)
      setData(res.data?.data || res.data || [])
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load data')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

