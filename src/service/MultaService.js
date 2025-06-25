const API_BASE_URL = 'http://localhost:5000';

export default class MultaService {
  async insert(multa) {
    try {
      const response = await fetch(`${API_BASE_URL}/multa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(multa),
      });
      
      const result = await response.json();
      return { status: response.status, ...result };
    } catch (error) {
      console.error('Erro ao inserir multa:', error);
      return { status: 500, message: error.message };
    }
  }

  async get(id = '') {
    try {
      const url = id ? `${API_BASE_URL}/multa/${id}` : `${API_BASE_URL}/multa`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error('Erro ao buscar multas:', error);
      return [];
    }
  }

  async update(multa) {
    try {
      const response = await fetch(`${API_BASE_URL}/multa`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(multa),
      });
      
      const result = await response.json();
      return { status: response.status, ...result };
    } catch (error) {
      console.error('Erro ao atualizar multa:', error);
      return { status: 500, message: error.message };
    }
  }

  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/multa/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      return { status: response.status, ...result };
    } catch (error) {
      console.error('Erro ao excluir multa:', error);
      return { status: 500, message: error.message };
    }
  }
}