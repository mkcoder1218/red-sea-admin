import { persistor } from './index'

/**
 * Utility functions for managing Redux persistence
 */

/**
 * Manually trigger persistence flush
 * Useful when you want to ensure data is saved immediately
 */
export const flushPersist = () => {
  return persistor.flush()
}

/**
 * Pause persistence
 * Useful during sensitive operations where you don't want state changes persisted
 */
export const pausePersist = () => {
  return persistor.pause()
}

/**
 * Resume persistence
 */
export const resumePersist = () => {
  return persistor.persist()
}

/**
 * Purge all persisted state
 * Useful for logout or reset functionality
 */
export const purgePersist = () => {
  return persistor.purge()
}

/**
 * Get the current persistence state
 */
export const getPersistState = () => {
  return persistor.getState()
}

/**
 * Clear specific parts of persisted state
 * This is a more targeted approach than purging everything
 */
export const clearPersistedAuth = async () => {
  try {
    // Pause persistence
    await pausePersist()
    
    // Clear auth-related items from localStorage
    localStorage.removeItem('persist:auth')
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    
    // Resume persistence
    await resumePersist()
    
    // Purge and rehydrate to ensure clean state
    await purgePersist()
    
    return true
  } catch (error) {
    console.error('Error clearing persisted auth:', error)
    return false
  }
}

/**
 * Reset app state to initial values
 * Useful for complete logout or app reset
 */
export const resetAppState = async () => {
  try {
    // Clear all persisted state
    await purgePersist()
    
    // Clear all localStorage items related to the app
    const keysToRemove = [
      'persist:root',
      'persist:auth',
      'persist:ui',
      'authToken',
      'refreshToken',
      'userPreferences',
    ]
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
    })
    
    // Reload the page to ensure clean state
    window.location.reload()
    
    return true
  } catch (error) {
    console.error('Error resetting app state:', error)
    return false
  }
}

/**
 * Check if persistence is working correctly
 */
export const checkPersistenceHealth = () => {
  const state = getPersistState()
  
  return {
    isBootstrapped: state.bootstrapped,
    isRehydrated: state.rehydrated,
    registry: state.registry,
  }
}

export default {
  flushPersist,
  pausePersist,
  resumePersist,
  purgePersist,
  getPersistState,
  clearPersistedAuth,
  resetAppState,
  checkPersistenceHealth,
}
