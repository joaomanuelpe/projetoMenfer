import React, { useState, useEffect } from 'react';
import { UserPlus, Users, Edit2, Trash2, Save, X, Upload, FileText, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import VeiculoService from '../service/VeiculoService.js';

const initialFormState = {
    placa: "",
    tipo: "",
    renavam: "",
    marca: "",
    modelo: "",
    chassi: "",
    licenciamento: "",
    expiraLicenciamento: "",
    anttText: "",
    antt: null,
    idRastreador: "",
    empresaRastreador: "",
    contratoArrendamento: null,
    civ: "",
    civNumero: "",
    expiraCiv: "",
    arqCrlv: null,
    arqCrono: null,
    arqLaudoOpa: null
};

function FrotaPage() {
    const [veiculos, setVeiculos] = useState([]);
    const [formData, setFormData] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const service = new VeiculoService();
    const navigate = useNavigate();

    // Função para formatar placa
    const formatPlaca = (value) => {
        const cleanValue = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        if (cleanValue.length <= 7) {
            // Formato antigo: ABC1234 ou novo: ABC1D23
            if (cleanValue.length >= 4) {
                return cleanValue.replace(/([A-Z]{3})([0-9A-Z]{1})([0-9]{2,3})/, '$1-$2$3');
            }
            return cleanValue;
        }
        return value;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'placa') {
            formattedValue = formatPlaca(value);
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
                // Atualizar veículo existente
                const res = await service.update(formData);
                if (res.status === 200) {
                    alert('Veículo atualizado com sucesso!');
                    setFormData(initialFormState);
                    setIsEditing(false);
                    setEditingId(null);
                    // Recarregar a lista de veículos
                    const veics = await fetchVeiculos();
                    setVeiculos(veics);
                } else {
                    alert(`Erro ao atualizar veículo: ${res.message}`);
                }
            } else {
                // Cadastrar novo veículo
                const data = new FormData();

                // Campos simples (convertidos para string se necessário)
                data.append("placa", formData.placa);
                data.append("tipo", formData.tipo);
                data.append("renavam", formData.renavam);
                data.append("marca", formData.marca);
                data.append("modelo", formData.modelo);
                data.append("chassi", formData.chassi);
                data.append("licenciamento", formData.licenciamento); // Date em string ISO
                data.append("expiraLicenciamento", formData.expiraLicenciamento);
                data.append("anttText", formData.anttText);
                data.append("antt", formData.antt ?? ""); // Caso não tenha, manda vazio
                data.append("idRastreador", formData.idRastreador);
                data.append("empresaRastreador", formData.empresaRastreador);
                data.append("contratoArrendamento", formData.contratoArrendamento ?? "");
                data.append("civ", formData.civ);
                data.append("civNumero", formData.civNumero ?? "");
                data.append("expiraCiv", formData.expiraCiv);

                // Arquivos (somente se tiver sido selecionado)
                if (formData.arqCrlv instanceof File) {
                    data.append("arqCrlv", formData.arqCrlv);
                }

                if (formData.arqCrono instanceof File) {
                    data.append("arqCrono", formData.arqCrono);
                }

                if (formData.arqLaudoOpa instanceof File) {
                    data.append("arqLaudoOpa", formData.arqLaudoOpa);
                }
                setFormData(data);
                console.log(data)
                const res = await service.insert(data);
                if (res.status === 200) {
                    alert('Veículo cadastrado com sucesso!');
                    setFormData(initialFormState);
                    // Recarregar a lista de veículos
                    const veics = await fetchVeiculos();
                    setVeiculos(veics);
                } else {
                    alert(`Não foi possível cadastrar veículo: ${res.message}`);
                }
            }
        } catch (error) {
            alert(`Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} veículo: ${error.message}`);
        }
        finally {
        }
    };

    const handleEdit = (index) => {
        const veiculo = veiculos[index];
        setFormData({
            placa: veiculo.placa,
            tipo: veiculo.tipo,
            renavam: veiculo.renavam,
            marca: veiculo.marca,
            modelo: veiculo.modelo,
            chassi: veiculo.chassi,
            licenciamento: veiculo.licenciamento,
            expiraLicenciamento: veiculo.expiraLicenciamento,
            anttText: veiculo.anttText,
            antt: null, // Arquivos não são carregados para edição
            idRastreador: veiculo.idRastreador,
            empresaRastreador: veiculo.empresaRastreador,
            contratoArrendamento: null,
            civ: veiculo.civ,
            civNumero: veiculo.civNumero,
            expiraCiv: veiculo.expiraCiv,
            arqCrlv: null,
            arqCrono: null,
            arqLaudoOpa: null
        });
        setIsEditing(true);
        setEditingId(veiculo.placa); // Usando placa como ID único

        // Scroll para o formulário
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setEditingId(null);
    };

    const handleDelete = async (placa) => {
        if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
            try {
                const res = await service.delete(placa);
                if (res.status === 200) {
                    alert('Veículo excluído com sucesso!');
                    // Se estava editando o veículo que foi excluído, cancelar edição
                    if (editingId === placa) {
                        handleCancelEdit();
                    }
                    // Recarregar a lista de veículos
                    const veics = await fetchVeiculos();
                    setVeiculos(veics);
                } else {
                    alert(`Erro ao excluir veículo: ${res.message}`);
                }
            } catch (error) {
                alert(`Erro ao excluir veículo: ${error.message}`);
            }
            finally {
                window.location.reload();
            }
        }
    };

    const fetchVeiculos = async () => {
        try {
            const veics = await service.get();
            return veics;
        } catch (error) {
            console.error('Erro ao buscar veículos:', error);
            return [];
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    useEffect(() => {
        const carregarVeiculos = async () => {
            const veics = await fetchVeiculos();
            setVeiculos(veics);
        };

        carregarVeiculos();
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
                        <Truck className="h-8 w-8" />
                        Sistema de Cadastro de Veículos
                    </h1>
                </div>

                {/* Formulário de Cadastro/Edição */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-blue-600 flex items-center gap-2">
                            <UserPlus className="h-6 w-6" />
                            {isEditing ? 'Editar Veículo' : 'Novo Veículo'}
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
                                ℹ️ Você está editando o veículo: <strong>{formData.placa} - {formData.marca} {formData.modelo}</strong>
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Dados Básicos do Veículo */}
                        <div className="md:col-span-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Dados do Veículo
                            </h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Placa *
                            </label>
                            <input
                                type="text"
                                name="placa"
                                required
                                maxLength="8"
                                value={formData.placa}
                                onChange={handleInputChange}
                                disabled={isEditing} // Placa não pode ser alterada
                                className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none ${isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                                    }`}
                                placeholder="ABC-1234"
                            />
                            {isEditing && (
                                <p className="mt-1 text-xs text-gray-500">
                                    Placa não pode ser alterada
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                RENAVAM *
                            </label>
                            <input
                                type="text"
                                name="renavam"
                                required
                                maxLength="20"
                                value={formData.renavam}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                placeholder="Número do RENAVAM"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Marca *
                            </label>
                            <input
                                type="text"
                                name="marca"
                                required
                                maxLength="45"
                                value={formData.marca}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                placeholder="Marca do veículo"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Modelo *
                            </label>
                            <input
                                type="text"
                                name="modelo"
                                required
                                maxLength="45"
                                value={formData.modelo}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                placeholder="Modelo do veículo"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Chassi *
                            </label>
                            <input
                                type="text"
                                name="chassi"
                                required
                                maxLength="20"
                                value={formData.chassi}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                placeholder="Número do chassi"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                ANTT *
                            </label>
                            <input
                                type="text"
                                name="anttText"
                                required
                                maxLength="20"
                                value={formData.anttText}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                placeholder="Número da ANTT"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Tipo *
                            </label>
                            <select
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                            >
                                <option value="">{formData.tipo === "" ? "Selecione" : formData.tipo}</option>
                                <option value="cavalo">Cavalo</option>
                                <option value="reboque">Reboque</option>
                            </select>
                        </div>

                        {/* Licenciamento */}
                        <div className="md:col-span-3 mt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Licenciamento
                            </h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Data do Licenciamento *
                            </label>
                            <input
                                type="date"
                                name="licenciamento"
                                required
                                value={formData.licenciamento}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Vencimento do Licenciamento *
                            </label>
                            <input
                                type="date"
                                name="expiraLicenciamento"
                                required
                                value={formData.expiraLicenciamento}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                            />
                        </div>

                        {/* Rastreamento */}
                        <div className="md:col-span-3 mt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Rastreamento
                            </h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                ID do Rastreador
                            </label>
                            <input
                                type="text"
                                name="idRastreador"
                                maxLength="20"
                                value={formData.idRastreador}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                placeholder="ID do dispositivo rastreador"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Empresa do Rastreador
                            </label>
                            <input
                                type="text"
                                name="empresaRastreador"
                                maxLength="45"
                                value={formData.empresaRastreador}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                placeholder="Nome da empresa de rastreamento"
                            />
                        </div>

                        {/* CIV */}
                        <div className="md:col-span-3 mt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                CIV (Certificado de Inspeção Veicular)
                            </h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                CIV
                            </label>
                            <select
                                name="civ"
                                value={formData.civ}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                            >
                                <option value="">Selecione</option>
                                <option value="sim">Sim</option>
                                <option value="não">Não</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Número do CIV
                            </label>
                            <input
                                type="text"
                                name="civNumero"
                                maxLength="20"
                                value={formData.civNumero}
                                onChange={handleInputChange}
                                disabled={formData.civ !== 'sim'}
                                className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none ${formData.civ === 'sim'
                                    ? 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                                    : 'bg-gray-100 cursor-not-allowed border-gray-200 text-gray-500'
                                    }`}
                                placeholder="Número específico do CIV"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Vencimento do CIV
                            </label>
                            <input
                                type="date"
                                name="expiraCiv"
                                disabled={formData.civ !== 'sim'}
                                value={formData.expiraCiv}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                            />
                        </div>

                        {/* Seção de Documentos */}
                        <div className="md:col-span-3 mt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Documentos
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        ANTT
                                    </label>
                                    <input
                                        type="file"
                                        name="antt"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Contrato de Arrendamento
                                    </label>
                                    <input
                                        type="file"
                                        name="contratoArrendamento"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        CRLV (Certificado de Registro)
                                    </label>
                                    <input
                                        type="file"
                                        name="arqCrlv"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Consulta Cronotacógrafo
                                    </label>
                                    <input
                                        type="file"
                                        name="arqCrono"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Laudo OPA
                                    </label>
                                    <input
                                        type="file"
                                        name="arqLaudoOpa"
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
                                className={`w-full py-3 px-4 rounded-md font-medium transition-colors duration-200 ${isEditing
                                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                                    }`}
                            >
                                {isEditing ? 'Atualizar Veículo' : 'Cadastrar Veículo'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista de Veículos */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-blue-600 mb-6">
                        Veículos Cadastrados ({veiculos.length})
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Placa
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        RENAVAM
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Marca
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Modelo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Chassi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Licenciamento
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Venc. Licenc.
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID Rastreador
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Empresa Rastr.
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        CIV
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nº CIV
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Venc. CIV
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {veiculos.map((veiculo, index) => (
                                    <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${editingId === veiculo.placa ? 'ring-2 ring-blue-200 bg-blue-50' : ''
                                        }`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            {veiculo.placa}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {veiculo.renavam}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {veiculo.marca}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {veiculo.modelo}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {veiculo.chassi}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(veiculo.licenciamento)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(veiculo.expiraLicenciamento)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {veiculo.idRastreador}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                                            {veiculo.empresaRastreador}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {veiculo.civ}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {veiculo.civNumero}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(veiculo.expiraCiv)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(index)}
                                                    disabled={isEditing && editingId === veiculo.placa}
                                                    className={`${isEditing && editingId === veiculo.placa
                                                        ? 'text-blue-400 cursor-not-allowed'
                                                        : 'text-blue-600 hover:text-blue-800'
                                                        } transition-colors`}
                                                    title={isEditing && editingId === veiculo.placa ? 'Em edição' : 'Editar'}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(veiculo.placa)}
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

                        {veiculos.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                Nenhum veículo cadastrado.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FrotaPage;