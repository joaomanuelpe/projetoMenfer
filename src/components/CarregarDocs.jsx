import React, { useState } from 'react';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

const SelecaoVeiculoPage = ({ telaItens, setTelaItens, motoristas, cavalos, reboques, formData }) => {

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Dados selecionados:', formData);
    };

    const [documentosSelecionados, setDocumentosSelecionados] = useState({
        cnh: false,
        comprovanteResidencia: false,
        crlvCavalo: false,
        crlvReboque: false,
    });

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setDocumentosSelecionados(prev => ({
            ...prev,
            [name]: checked,
        }));
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

        const content = [
            { text: "Documentos Selecionados", style: "header" },
            { text: `Motorista: ${motorista?.nome}`, margin: [0, 5] },
            { text: `Contato: ${motorista?.contato}`, margin: [0, 0, 0, 5] },
            { text: `CETPP Motorista: ${motorista?.cetpp}`, margin: [0, 0, 0, 5] },
            { text: `Cavalo ANTT: ${cavalo?.ANTT}`, margin: [0, 0, 0, 5] },
            { text: `Reboque ANTT: ${reboque?.ANTT}`, margin: [0, 0, 0, 10] },
        ];

        if (documentosSelecionados.cnh) {
            const imgCnh = await finalizaImg(motorista.cnh);
            content.push({ text: 'CNH:' }, { image: imgCnh, width: 200 });
        }

        if (documentosSelecionados.comprovanteResidencia) {
            const imgCompRes = await finalizaImg(motorista.comprovanteResidencia);
            content.push({ text: 'Comprovante de residência:' }, { image: imgCompRes, width: 500 });
        }

        if (documentosSelecionados.crlvCavalo) {
            const imgCrlvCav = await finalizaImg(cavalo.crlv);
            content.push({ text: 'CRLV Cavalo:' }, { image: imgCrlvCav, width: 200 });
        }

        if (documentosSelecionados.crlvReboque) {
            const imgCrlvReb = await finalizaImg(reboque.crlv);
            content.push({ text: 'CRLV Reboque:' }, { image: imgCrlvReb, width: 200 });
        }

        const docDefinition = {
            content,
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
                <h2 className="text-2xl font-semibold text-blue-600 mb-6">Selecione os documentos que deseja incluir no PDF</h2>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Motorista</h3>
                        <label className="block">
                            <input type="checkbox" name="cnh" checked={documentosSelecionados.cnh} onChange={handleCheckboxChange} className="mr-2" />
                            CNH
                        </label>
                        <label className="block">
                            <input type="checkbox" name="comprovanteResidencia" checked={documentosSelecionados.comprovanteResidencia} onChange={handleCheckboxChange} className="mr-2" />
                            Comprovante de Residência
                        </label>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Veículo</h3>
                        <label className="block">
                            <input type="checkbox" name="crlvCavalo" checked={documentosSelecionados.crlvCavalo} onChange={handleCheckboxChange} className="mr-2" />
                            CRLV Cavalo
                        </label>
                        <label className="block">
                            <input type="checkbox" name="crlvReboque" checked={documentosSelecionados.crlvReboque} onChange={handleCheckboxChange} className="mr-2" />
                            CRLV Reboque
                        </label>
                    </div>

                    <div className="md:col-span-2">
                        <button
                            type="button"
                            onClick={gerarPdf}
                            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-200"
                        >
                            Gerar PDF
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SelecaoVeiculoPage;
