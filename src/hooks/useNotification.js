"use client"

import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { addNotification, removeNotification } from "../store/slices/uiSlice"

export const useNotification = () => {
  const dispatch = useDispatch()

  const showNotification = useCallback(
    ({ message, type = "info", duration = 5000 }) => {
      const id = Date.now()
      dispatch(addNotification({ id, message, type }))

      if (duration > 0) {
        setTimeout(() => {
          dispatch(removeNotification(id))
        }, duration)
      }

      return id
    },
    [dispatch],
  )

  const hideNotification = useCallback(
    (id) => {
      dispatch(removeNotification(id))
    },
    [dispatch],
  )

  return { showNotification, hideNotification }
}
