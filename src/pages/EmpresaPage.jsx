import React, { useState, useEffect } from 'react';
import { UserPlus, Users, Edit2, Trash2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import EmpresaService from '../service/EmpresaService.js';

const initialFormState = {
    razaoSocial: "",
    cnpj: "",
    inscricaoEstadual: "",
    endereco: "",
    email: "",
    telefone: "",
    contato: ""
};

function EmpresaPage() {
    const [empresas, setEmpresas] = useState([]);
    const [formData, setFormData] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const service = new EmpresaService();
    const navigate = useNavigate();

    // Função para formatar CNPJ
    const formatCNPJ = (value) => {
        const numericValue = value.replace(/\D/g, '');
        if (numericValue.length <= 14) {
            return numericValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
        return value;
    };

    // Função para formatar telefone
    const formatTelefone = (value) => {
        const numericValue = value.replace(/\D/g, '');
        if (numericValue.length <= 11) {
            if (numericValue.length <= 10) {
                return numericValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            } else {
                return numericValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            }
        }
        return value;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cnpj') {
            formattedValue = formatCNPJ(value);
        } else if (name === 'telefone') {
            formattedValue = formatTelefone(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));
    };

    const handleSubmit = async () => {
        try {
            if (isEditing) {
                // Atualizar empresa existente
                const res = await service.update(formData);
                if (res.status === 200) {
                    alert('Empresa atualizada com sucesso!');
                    setFormData(initialFormState);
                    setIsEditing(false);
                    setEditingId(null);
                    // Recarregar a lista de empresas
                    const emps = await fetchEmpresas();
                    setEmpresas(emps);
                } else {
                    alert(`Erro ao atualizar empresa: ${res.message}`);
                }
            } else {
                // Cadastrar nova empresa
                const res = await service.insert(formData);
                if (res.status === 200) {
                    alert('Empresa cadastrada com sucesso!');
                    setFormData(initialFormState);
                    // Recarregar a lista de empresas
                    const emps = await fetchEmpresas();
                    setEmpresas(emps);
                } else {
                    alert(`Não foi possível cadastrar empresa: ${res.message}`);
                }
            }
        } catch (error) {
            alert(`Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} empresa: ${error.message}`);
        }
    };

    const handleEdit = (index) => {
        const empresa = empresas[index];
        setFormData({
            razaoSocial: empresa.razaoSocial,
            cnpj: empresa.cnpj,
            inscricaoEstadual: empresa.inscricaoEstadual,
            endereco: empresa.endereco,
            email: empresa.email,
            telefone: empresa.telefone,
            contato: empresa.contato
        });
        setIsEditing(true);
        setEditingId(empresa.cnpj); // Usando CNPJ como ID único
        
        // Scroll para o formulário
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setEditingId(null);
    };

    const handleDelete = async (cnpj) => {
        if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
            try {
                const res = await service.delete(cnpj);
                if (res.status === 200) {
                    alert('Empresa excluída com sucesso!');
                    // Se estava editando a empresa que foi excluída, cancelar edição
                    if (editingId === cnpj) {
                        handleCancelEdit();
                    }
                    // Recarregar a lista de empresas
                    const emps = await fetchEmpresas();
                    setEmpresas(emps);
                } else {
                    alert(`Erro ao excluir empresa: ${res.message}`);
                }
            } catch (error) {
                alert(`Erro ao excluir empresa: ${error.message}`);
            } finally { 
                window.location.reload();
            }
        }
    };

    const fetchEmpresas = async () => {
        try {
            const emps = await service.get();
            return emps;
        } catch (error) {
            console.error('Erro ao buscar empresas:', error);
            return [];
        }
    };

    useEffect(() => {
        const carregarEmpresas = async () => {
            const emps = await fetchEmpresas();
            setEmpresas(emps);
        };

        carregarEmpresas();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center">
                    <button
                        onClick={() => navigate('/cadastros')}
                        className="mr-4 hover:bg-blue-700 p-2 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-2">
                        <Users className="h-8 w-8" />
                        Sistema de Cadastro de Empresas
                    </h1>
                </div>

                {/* Formulário de Cadastro/Edição */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-blue-600 flex items-center gap-2">
                            <UserPlus className="h-6 w-6" />
                            {isEditing ? 'Editar Empresa' : 'Nova Empresa'}
                        </h2>
                        {isEditing && (
                            <button
                                onClick={handleCancelEdit}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <X className="h-4 w-4" />
                                Cancelar Edição
                            </button>
                        )}
                    </div>

                    {isEditing && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-700">
                                ℹ️ Você está editando a empresa: <strong>{formData.razaoSocial}</strong>
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Razão Social *
                            </label>
                            <input
                                type="text"
                                name="razaoSocial"
                                required
                                maxLength="45"
                                value={formData.razaoSocial}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                placeholder="Informe a razão social"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                CNPJ *
                            </label>
                            <input
                                type="text"
                                name="cnpj"
                                required
                                maxLength="19"
                                value={formData.cnpj}
                                onChange={handleInputChange}
                                disabled={isEditing} // CNPJ não pode ser alterado
                                className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none ${
                                    isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                                placeholder="00.000.000/0000-00"
                            />
                            {isEditing && (
                                <p className="mt-1 text-xs text-gray-500">
                                    CNPJ não pode ser alterado
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Inscrição Estadual *
                            </label>
                            <input
                                type="text"
                                name="inscricaoEstadual"
                                required
                                maxLength="15"
                                value={formData.inscricaoEstadual}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                placeholder="Inscrição estadual"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Nome do Contato *
                            </label>
                            <input
                                type="text"
                                name="contato"
                                required
                                maxLength="25"
                                value={formData.contato}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                placeholder="Nome da pessoa de contato"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                maxLength="45"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                placeholder="email@exemplo.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Telefone *
                            </label>
                            <input
                                type="text"
                                name="telefone"
                                required
                                maxLength="15"
                                value={formData.telefone}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                placeholder="(00) 00000-0000"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Endereço *
                            </label>
                            <input
                                type="text"
                                name="endereco"
                                required
                                maxLength="45"
                                value={formData.endereco}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                placeholder="Endereço completo"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button
                                onClick={handleSubmit}
                                className={`w-full py-3 px-4 rounded-md font-medium transition-colors duration-200 ${
                                    isEditing
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                                }`}
                            >
                                {isEditing ? 'Atualizar Empresa' : 'Cadastrar Empresa'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista de Empresas */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-blue-600 mb-6">
                        Empresas Cadastradas ({empresas.length})
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Razão Social
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        CNPJ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Inscr. Estadual
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Endereço
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Telefone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contato
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {empresas.map((empresa, index) => (
                                    <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                                        editingId === empresa.cnpj ? 'ring-2 ring-blue-200 bg-blue-50' : ''
                                    }`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {empresa.razaoSocial}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {empresa.cnpj}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {empresa.inscricaoEstadual}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {empresa.endereco}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {empresa.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {empresa.telefone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {empresa.contato}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(index)}
                                                    disabled={isEditing && editingId === empresa.cnpj}
                                                    className={`${
                                                        isEditing && editingId === empresa.cnpj
                                                            ? 'text-blue-400 cursor-not-allowed'
                                                            : 'text-blue-600 hover:text-blue-800'
                                                    } transition-colors`}
                                                    title={isEditing && editingId === empresa.cnpj ? 'Em edição' : 'Editar'}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(empresa.cnpj)}
                                                    className="text-red-600 hover:text-red-800 transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {empresas.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                Nenhuma empresa cadastrada ainda.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmpresaPage;