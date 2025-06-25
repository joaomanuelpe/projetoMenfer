const API_BASE_URL = 'http://localhost:5000';

export default class DespesaService {
  async insert(despesa) {
    try {
      const response = await fetch(`${API_BASE_URL}/despesa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(despesa),
      });
      
      const result = await response.json();
      return { status: response.status, ...result };
    } catch (error) {
      console.error('Erro ao inserir despesa:', error);
      return { status: 500, message: error.message };
    }
  }

  async get(id = '') {
    try {
      const url = id ? `${API_BASE_URL}/despesa/${id}` : `${API_BASE_URL}/despesa`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
      return [];
    }
  }

  async update(despesa) {
    try {
      const response = await fetch(`${API_BASE_URL}/despesa`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(despesa),
      });
      
      const result = await response.json();
      return { status: response.status, ...result };
    } catch (error) {
      console.error('Erro ao atualizar despesa:', error);
      return { status: 500, message: error.message };
    }
  }

  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/despesa/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      return { status: response.status, ...result };
    } catch (error) {
      console.error('Erro ao excluir despesa:', error);
      return { status: 500, message: error.message };
    }
  }
}