import React, { useState, useEffect } from 'react';
import { UserPlus, Users, Edit2, Trash2, Save, X, Upload, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MotoristaService from '../service/MotoristaService.js';

const initialFormState = {
    name: "",
    phone: "",
    rg: "",
    cpf: "",
    registrationNumber: "",
    licenseExpiryDate: "",
    birthDate: "",
    address: "",
    arqCnh: null,
    comprovanteRs: null,
    arqCetpp: null,
    arqExamTox: null,
    arqAso: null
};

function MotoristaPage() {
    const [motoristas, setMotoristas] = useState([]);
    const [formData, setFormData] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const service = new MotoristaService();
    const navigate = useNavigate();

    // Função para formatar CPF
    const formatCPF = (value) => {
        const numericValue = value.replace(/\D/g, '');
        if (numericValue.length <= 11) {
            return numericValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        return value;
    };

    // Função para formatar RG
    const formatRG = (value) => {
        const numericValue = value.replace(/\D/g, '');
        if (numericValue.length <= 9) {
            return numericValue.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
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

        if (name === 'cpf') {
            formattedValue = formatCPF(value);
        } else if (name === 'rg') {
            formattedValue = formatRG(value);
        } else if (name === 'phone') {
            formattedValue = formatTelefone(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            if (isEditing) {
                // Atualizar motorista existente
                const res = await service.update(formData);
                if (res.status === 200) {
                    alert('Motorista atualizado com sucesso!');
                    setFormData(initialFormState);
                    setIsEditing(false);
                    setEditingId(null);
                    // Recarregar a lista de motoristas
                    const mots = await fetchMotoristas();
                    setMotoristas(mots);
                } else {
                    alert(`Erro ao atualizar motorista: ${res.message}`);
                }
            } else {
                // Cadastrar novo motorista
                const res = await service.insert(formData);
                if (res.status === 200) {
                    alert('Motorista cadastrado com sucesso!');
                    setFormData(initialFormState);
                    // Recarregar a lista de motoristas
                    const mots = await fetchMotoristas();
                    setMotoristas(mots);
                } else {
                    alert(`Não foi possível cadastrar motorista: ${res.message}`);
                }
            }
        } catch (error) {
            alert(`Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} motorista: ${error.message}`);
        }
    };

    const handleEdit = (index) => {
        const motorista = motoristas[index];
        setFormData({
            name: motorista.name,
            phone: motorista.phone,
            rg: motorista.rg,
            cpf: motorista.cpf,
            registrationNumber: motorista.registrationNumber,
            licenseExpiryDate: motorista.licenseExpiryDate,
            birthDate: motorista.birthDate,
            address: motorista.address,
            arqCnh: null, // Arquivos não são carregados para edição
            comprovanteRs: null,
            arqCetpp: null,
            arqExamTox: null,
            arqAso: null
        });
        setIsEditing(true);
        setEditingId(motorista.cpf); // Usando CPF como ID único
        
        // Scroll para o formulário
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setEditingId(null);
    };

    const handleDelete = async (cpf) => {
        if (window.confirm('Tem certeza que deseja excluir este motorista?')) {
            try {
                const res = await service.delete(cpf);
                if (res.status === 200) {
                    alert('Motorista excluído com sucesso!');
                    // Se estava editando o motorista que foi excluído, cancelar edição
                    if (editingId === cpf) {
                        handleCancelEdit();
                    }
                    // Recarregar a lista de motoristas
                    const mots = await fetchMotoristas();
                    setMotoristas(mots);
                } else {
                    alert(`Erro ao excluir motorista: ${res.message}`);
                }
            } catch (error) {
                alert(`Erro ao excluir motorista: ${error.message}`);
            }
        }
    };

    const fetchMotoristas = async () => {
        try {
            const mots = await service.get();
            return mots;
        } catch (error) {
            console.error('Erro ao buscar motoristas:', error);
            return [];
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    useEffect(() => {
        const carregarMotoristas = async () => {
            const mots = await fetchMotoristas();
            setMotoristas(mots);
        };

        carregarMotoristas();
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
                        Sistema de Cadastro de Motoristas
                    </h1>
                </div>

                {/* Formulário de Cadastro/Edição */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-blue-600 flex items-center gap-2">
                            <UserPlus className="h-6 w-6" />
                            {isEditing ? 'Editar Motorista' : 'Novo Motorista'}
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
                                ℹ️ Você está editando o motorista: <strong>{formData.name}</strong>
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Nome Completo *
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                maxLength="45"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                placeholder="Nome completo do motorista"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Telefone *
                            </label>
                            <input
                                type="text"
                                name="phone"
                                required
                                maxLength="15"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                placeholder="(00) 00000-0000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                RG *
                            </label>
                            <input
                                type="text"
                                name="rg"
                                required
                                maxLength="20"
                                value={formData.rg}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                placeholder="00.000.000-0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                CPF *
                            </label>
                            <input
                                type="text"
                                name="cpf"
                                required
                                maxLength="14"
                                value={formData.cpf}
                                onChange={handleInputChange}
                                disabled={isEditing} // CPF não pode ser alterado
                                className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none ${
                                    isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                                placeholder="000.000.000-00"
                            />
                            {isEditing && (
                                <p className="mt-1 text-xs text-gray-500">
                                    CPF não pode ser alterado
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Número de Registro *
                            </label>
                            <input
                                type="text"
                                name="registrationNumber"
                                required
                                maxLength="20"
                                value={formData.registrationNumber}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                placeholder="Número de registro da CNH"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Data de Vencimento da CNH *
                            </label>
                            <input
                                type="date"
                                name="licenseExpiryDate"
                                required
                                value={formData.licenseExpiryDate}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Data de Nascimento *
                            </label>
                            <input
                                type="date"
                                name="birthDate"
                                required
                                value={formData.birthDate}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Endereço Completo *
                            </label>
                            <input
                                type="text"
                                name="address"
                                required
                                maxLength="100"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                placeholder="Endereço completo com CEP"
                            />
                        </div>

                        {/* Seção de Documentos */}
                        <div className="md:col-span-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Documentos e Certificados
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        CNH (Arquivo)
                                    </label>
                                    <input
                                        type="file"
                                        name="arqCnh"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Comprovante de Residência
                                    </label>
                                    <input
                                        type="file"
                                        name="comprovanteRs"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Certificado CETPP
                                    </label>
                                    <input
                                        type="file"
                                        name="arqCetpp"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Exame Toxicológico
                                    </label>
                                    <input
                                        type="file"
                                        name="arqExamTox"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        ASO (Atestado de Saúde Ocupacional)
                                    </label>
                                    <input
                                        type="file"
                                        name="arqAso"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-3">
                            <button
                                onClick={handleSubmit}
                                className={`w-full py-3 px-4 rounded-md font-medium transition-colors duration-200 ${
                                    isEditing
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                                }`}
                            >
                                {isEditing ? 'Atualizar Motorista' : 'Cadastrar Motorista'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista de Motoristas */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-blue-600 mb-6">
                        Motoristas Cadastrados ({motoristas.length})
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nome
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        CPF
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        RG
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Telefone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nº Registro
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Venc. CNH
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nascimento
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Endereço
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {motoristas.map((motorista, index) => (
                                    <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                                        editingId === motorista.cpf ? 'ring-2 ring-blue-200 bg-blue-50' : ''
                                    }`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {motorista.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {motorista.cpf}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {motorista.rg}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {motorista.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {motorista.registrationNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(motorista.licenseExpiryDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(motorista.birthDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                                            {motorista.address}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(index)}
                                                    disabled={isEditing && editingId === motorista.cpf}
                                                    className={`${
                                                        isEditing && editingId === motorista.cpf
                                                            ? 'text-blue-400 cursor-not-allowed'
                                                            : 'text-blue-600 hover:text-blue-800'
                                                    } transition-colors`}
                                                    title={isEditing && editingId === motorista.cpf ? 'Em edição' : 'Editar'}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(motorista.cpf)}
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

                        {motoristas.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                Nenhum motorista cadastrado ainda.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MotoristaPage;