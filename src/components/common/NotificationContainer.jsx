"use client"

import { useSelector, useDispatch } from "react-redux"
import { Snackbar, Alert } from "@mui/material"
import { removeNotification } from "../../store/slices/uiSlice"

export default function NotificationContainer() {
  const notifications = useSelector((state) => state.ui.notifications)
  const dispatch = useDispatch()

  const handleClose = (id) => {
    dispatch(removeNotification(id))
  }

  return (
    <>
      {notifications.map((notification, index) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={5000}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{ top: `${80 + index * 70}px !important` }}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.type}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  )
}
