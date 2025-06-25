const API_BASE_URL = 'http://localhost:5000';

export default class OficinaService {
  async insert(servico) {
    try {
      const response = await fetch(`${API_BASE_URL}/oficina`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(servico),
      });
      
      const result = await response.json();
      return { status: response.status, ...result };
    } catch (error) {
      console.error('Erro ao inserir serviço:', error);
      return { status: 500, message: error.message };
    }
  }

  async get(id = '') {
    try {
      const url = id ? `${API_BASE_URL}/oficina/${id}` : `${API_BASE_URL}/oficina`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      return [];
    }
  }

  async update(servico) {
    try {
      const response = await fetch(`${API_BASE_URL}/oficina`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(servico),
      });
      
      const result = await response.json();
      return { status: response.status, ...result };
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      return { status: 500, message: error.message };
    }
  }

  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/oficina/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      return { status: response.status, ...result };
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      return { status: 500, message: error.message };
    }
  }
}