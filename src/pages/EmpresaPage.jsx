import React, { useState, useEffect } from 'react';
import { UserPlus, Users } from 'lucide-react';
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
    const service = new EmpresaService();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmpresas(prev => [...prev, formData]);
        setFormData(initialFormState);
        console.log(formData)
        const res = await service.insert(formData);
        if (res.status === 200)
            alert(`Empresa cadastrada com sucesso!`);
        else
            alert(`Não foi possível cadastrar empresa: ${res.message}`);
    };


    const fetchEmpresas = async () => {
        const emps = await service.get();
        return emps;
    }

    useEffect(() => {
        const carregarEmpresas = async () => {
            const emps = await fetchEmpresas();
            setEmpresas(emps);
        };

        carregarEmpresas();
    }, []);

    const navigate = useNavigate();

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

                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center gap-2">
                        <UserPlus className="h-6 w-6" />
                        Nova Empresa
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Razão Social:</label>
                            <input
                                type="text"
                                name="razaoSocial"
                                required
                                value={formData.razaoSocial}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">CNPJ</label>
                            <input
                                type="text"
                                name="cnpj"
                                required
                                value={formData.cnpj}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Inscrição Estadual</label>
                            <input
                                type="text"
                                name="inscricaoEstadual"
                                required
                                value={formData.inscricaoEstadual}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Nome Contato
                            </label>
                            <input
                                type="text"
                                name="contato"
                                required
                                value={formData.contato}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Telefone</label>
                            <input
                                type="text"
                                name="telefone"
                                required
                                value={formData.telefone}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Endereco
                            </label>
                            <input
                                type="text"
                                name="endereco"
                                required
                                value={formData.endereco}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-200"
                            >
                                Cadastrar Empresa
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-blue-600 mb-6">Empresas Cadastradas</h2>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Razão Social</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNPJ</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inscr. Estadual</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome Contato</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {empresas.map((empresa, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{empresa.razaoSocial}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{empresa.cnpj}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{empresa.inscricaoEstadual}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{empresa.endereco}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{empresa.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{empresa.telefone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{empresa.contato}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmpresaPage;
