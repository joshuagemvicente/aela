import { useState, useCallback } from "react"

interface UseTogglePasswordReturn {
  isPasswordVisible: boolean
  isConfirmPasswordVisible: boolean
  togglePassword: () => void
  toggleConfirmPassword: () => void
  resetPasswordVisibility: () => void
  getPasswordInputType: () => "text" | "password"
  getConfirmPasswordInputType: () => "text" | "password"
}

export function useTogglePassword(): UseTogglePasswordReturn {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

  const togglePassword = useCallback(() => {
    setIsPasswordVisible(prev => !prev)
  }, [])
  
  const toggleConfirmPassword = useCallback(() => {
    setIsConfirmPasswordVisible(prev => !prev)
  }, [])

  const resetPasswordVisibility = useCallback(() => {
    setIsPasswordVisible(false)
    setIsConfirmPasswordVisible(false)
  }, [])

  const getPasswordInputType = useCallback((): "text" | "password" => {
    return isPasswordVisible ? "text" : "password"
  }, [isPasswordVisible])

  const getConfirmPasswordInputType = useCallback((): "text" | "password" => {
    return isConfirmPasswordVisible ? "text" : "password"
  }, [isConfirmPasswordVisible])

  return {
    isPasswordVisible,
    isConfirmPasswordVisible,
    togglePassword,
    toggleConfirmPassword,
    resetPasswordVisibility,
    getPasswordInputType,
    getConfirmPasswordInputType,
  }
}