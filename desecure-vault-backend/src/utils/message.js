export const responseMessage = (
  status,
  message,
  data = null
) => ({
  status,
  message,
  data,
  timestamp: new Date().toISOString()
});

export const successMessage = (
  message = "Action done successfully",
  data = null
) => ({
  status: 200,
  message,
  data,
  timestamp: new Date().toISOString()
});

export const errorMessage = (
  message = "Internal Server Error",
  data = null
) => ({
  status: 500,
  message,
  data,
  timestamp: new Date().toISOString()
});

export const clientErrorMessage = (
  message = "Something went wrong!",
  data = null
) => ({
  status: 400,
  message,
  data,
  timestamp: new Date().toISOString()
});

