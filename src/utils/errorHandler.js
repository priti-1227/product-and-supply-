/**
 * Centralized error handling utility
 * Transforms API errors into user-friendly messages
 */

export const getErrorMessage = (error) => {
  // RTK Query error structure
  if (error?.data) {
    // Backend returned error message
    if (typeof error.data === "string") {
      return error.data
    }
    if (error.data.message) {
      return error.data.message
    }
    if (error.data.error) {
      return error.data.error
    }
  }

  // Network error
  if (error?.status === "FETCH_ERROR") {
    return "Network error. Please check your connection."
  }

  // Timeout error
  if (error?.status === "TIMEOUT_ERROR") {
    return "Request timeout. Please try again."
  }

  // HTTP status errors
  if (error?.status) {
    switch (error.status) {
      case 400:
        return "Invalid request. Please check your input."
      case 401:
        return "Unauthorized. Please login again."
      case 403:
        return "Access denied. You do not have permission."
      case 404:
        return "Resource not found."
      case 409:
        return "Conflict. Resource already exists."
      case 422:
        return "Validation error. Please check your input."
      case 500:
        return "Server error. Please try again later."
      case 503:
        return "Service unavailable. Please try again later."
      default:
        return `Error: ${error.status}`
    }
  }

  // Generic error
  return error?.message || "An unexpected error occurred."
}

export const handleApiError = (error, showNotification) => {
  const message = getErrorMessage(error)
  if (showNotification) {
    showNotification({ message, type: "error" })
  }
  console.error("[API Error]", error)
  return message
}
