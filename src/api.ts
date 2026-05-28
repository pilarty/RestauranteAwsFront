const base_url = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Helper para hacer peticiones con manejo de errores comunes
export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${base_url}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    // Agregar credentials si el backend usa cookies/sesiones
    // credentials: 'include',
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      // Intentar parsear el error del backend
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Si no se puede parsear como JSON, usar el mensaje por defecto
      }
      throw new Error(errorMessage);
    }

    // Manejar respuestas vacías (204 No Content)
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    // Manejar errores de red (CORS, timeout, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Error de conexión: verifica que el backend esté disponible y configurado para CORS');
    }
    throw error;
  }
};

export { base_url };