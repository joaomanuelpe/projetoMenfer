import React, { useState } from 'react';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Dados mockados de exemplo
const motoristas = [
    { id: 1, nome: 'João Silva', contato: '18996670191', cnh: 'cnhTeste.jpg', comprovanteResidencia: 'comprovanteResidencia.png', ctpp: '99999', cetpp: '999' },
    { id: 2, nome: 'Maria Souza', contato: '18996670191', cnh: 'cnhTeste.jpg', comprovanteResidencia: 'comprovanteResidencia.png', ctpp: '99999', cetpp: '999' },
];

const cavalos = [
    { id: 1, nome: 'Cavalo 001', ANTT: 'XXXXXXXX', idRastreador: '123', empRastreador: '456', crlv: 'crlvTeste.jpg' },
    { id: 2, nome: 'Cavalo 002', ANTT: 'XXXXXXXX', idRastreador: '123', empRastreador: '456', crlv: 'crlvTeste.jpg' },
];

const reboques = [
    { id: 1, nome: 'Reboque A', ANTT: 'YYYYYYYY', idRastreador: '654', empRastreador: '987', crlv: 'crlvTeste.jpg' },
    { id: 2, nome: 'Reboque B', ANTT: 'YYYYYYYY', idRastreador: '654', empRastreador: '987', crlv: 'crlvTeste.jpg' },
];


const SelecaoVeiculoPage = () => {
    const [formData, setFormData] = useState({
        motoristaId: '',
        cavaloId: '',
        reboqueId: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Dados selecionados:', formData);
    };

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });

    const finalizaImg = async (imgAntes) => {
        const response = await fetch(`/${imgAntes}`);
        const blob = await response.blob();
        const img = await toBase64(blob);
        console.log('Imagem convertida:', img.slice(0, 50)); // Mostra o começo do base64
        return img;
    }

    const gerarPdf = async () => {
        const motorista = motoristas.find(m => m.id === parseInt(formData.motoristaId));
        const cavalo = cavalos.find(c => c.id === parseInt(formData.cavaloId));
        const reboque = reboques.find(r => r.id === parseInt(formData.reboqueId));

        const imgCnh = await finalizaImg(motorista.cnh);
        const imgCompRes = await finalizaImg(motorista.comprovanteResidencia);
        const imgCrlvCav = await finalizaImg(cavalo.crlv);
        const imgCrlvReb = await finalizaImg(reboque.crlv);


        const docDefinition = {
            content: [
                { text: "Documentos Selecionados", style: "header" },

                { text: `Motorista: ${motorista?.nome}`, margin: [0, 5] },
                { text: `Contato: ${motorista?.contato}`, margin: [0, 0, 0, 5] },
                { text: `CETPP Motorista: ${motorista?.cetpp}`, margin: [0, 0, 0, 5] },
                { text: `Cavalo ANTT: ${cavalo?.ANTT}`, margin: [0, 0, 0, 5] },
                { text: `Reboque ANTT: ${reboque?.ANTT}`, margin: [0, 0, 0, 10] },
                { text: `Cavalo ID Rastreador: ${cavalo?.idRastreador}`, margin: [0, 0, 0, 5] },
                { text: `Reboque ID Rastreador: ${reboque?.idRastreador}`, margin: [0, 0, 0, 10] },
                { text: `Cavalo Empresa Rastreador: ${cavalo?.empRastreador}`, margin: [0, 0, 0, 5] },
                { text: `Reboque Empresa Rastreador: ${reboque?.empRastreador}`, margin: [0, 0, 0, 10] },

                { text: 'CNH:' },
                { image: imgCnh, width: 200 },

                { text: 'Comprovante de residência:' },
                { image: imgCompRes, width: 500 },

                { text: 'CRLV Cavalo:' },
                { image: imgCrlvCav, width: 200 },

                { text: 'CRLV Reboque:' },
                { image: imgCrlvReb, width: 200 }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10],
                }
            }
        };

        pdfMake.createPdf(docDefinition).open();
    };



    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-blue-600 mb-6">Selecione para gerar os documentos</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Motorista</label>
                        <select
                            name="motoristaId"
                            value={formData.motoristaId}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        >
                            <option value="">Selecione um motorista</option>
                            {motoristas.map((motorista) => (
                                <option key={motorista.id} value={motorista.id}>
                                    {motorista.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cavalo</label>
                        <select
                            name="cavaloId"
                            value={formData.cavaloId}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        >
                            <option value="">Selecione um cavalo</option>
                            {cavalos.map((cavalo) => (
                                <option key={cavalo.id} value={cavalo.id}>
                                    {cavalo.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Reboque</label>
                        <select
                            name="reboqueId"
                            value={formData.reboqueId}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        >
                            <option value="">Selecione um reboque</option>
                            {reboques.map((reboque) => (
                                <option key={reboque.id} value={reboque.id}>
                                    {reboque.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <button
                            onClick={gerarPdf}
                            type='button'
                            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-200"
                        >
                            Confirmar Seleção
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SelecaoVeiculoPage;
