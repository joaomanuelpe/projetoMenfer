import React, { useState } from 'react';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

const SelecaoVeiculoPage = ({ telaItens, dataFinal, setTelaItens, motoristas, cavalos, reboques, formData }) => {

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

    const gerarPdf = async () => {
        // Cabeçalho compacto
        const content = [
            {
                text: "DOCUMENTOS DO VEÍCULO E MOTORISTA",
                style: "mainHeader",
                alignment: "center",
                margin: [0, 0, 0, 15]
            },
            
            // Seção de informações em layout mais compacto
            {
                columns: [
                    {
                        width: '50%',
                        stack: [
                            { text: "DADOS DO MOTORISTA", style: "sectionHeader" },
                            {
                                table: {
                                    widths: ['35%', '65%'],
                                    body: [
                                        [
                                            { text: 'Nome:', style: 'tableLabel' },
                                            { text: dataFinal?.motorista.name || 'N/A', style: 'tableValue' }
                                        ],
                                        [
                                            { text: 'Contato:', style: 'tableLabel' },
                                            { text: dataFinal?.motorista.phone || 'N/A', style: 'tableValue' }
                                        ],
                                        [
                                            { text: 'CETPP:', style: 'tableLabel' },
                                            { text: dataFinal?.motorista.cetpp || 'N/A', style: 'tableValue' }
                                        ]
                                    ]
                                },
                                layout: 'noBorders',
                                margin: [0, 3, 0, 10]
                            }
                        ]
                    },
                    {
                        width: '50%',
                        stack: [
                            { text: "DADOS DO VEÍCULO", style: "sectionHeader" },
                            {
                                table: {
                                    widths: ['40%', '60%'],
                                    body: [
                                        [
                                            { text: 'ANTT Cavalo:', style: 'tableLabel' },
                                            { text: dataFinal?.cavalo?.anttText || 'N/A', style: 'tableValue' }
                                        ],
                                        [
                                            { text: 'ANTT Reboque:', style: 'tableLabel' },
                                            { text: dataFinal?.reboque?.anttText || 'N/A', style: 'tableValue' }
                                        ],
                                        [
                                            { text: 'ID Rastreador:', style: 'tableLabel' },
                                            { text: dataFinal?.rastreador || 'N/A', style: 'tableValue' }
                                        ]
                                    ]
                                },
                                layout: 'noBorders',
                                margin: [0, 3, 0, 10]
                            }
                        ]
                    }
                ]
            }
        ];

        // Verificar quais documentos foram selecionados
        const temCNH = documentosSelecionados.cnh && dataFinal.motorista.arqCnh;
        const temComprovante = documentosSelecionados.comprovanteResidencia && dataFinal.motorista.comprovanteRs;
        const temCRLVCavalo = documentosSelecionados.crlvCavalo && dataFinal.cavalo.arqCrlv;
        const temCRLVReboque = documentosSelecionados.crlvReboque && dataFinal.reboque.arqCrlv;

        // Página 1: CNH e Comprovante de Residência (se selecionados)
        if (temCNH || temComprovante) {
            // Linha separadora
            content.push({
                canvas: [
                    {
                        type: 'line',
                        x1: 0,
                        y1: 0,
                        x2: 515,
                        y2: 0,
                        lineWidth: 1,
                        lineColor: '#cccccc'
                    }
                ],
                margin: [0, 8, 0, 15]
            });

            if (temCNH) {
                content.push({
                    image: dataFinal.motorista.arqCnh,
                    width: 480,
                    alignment: 'center',
                    margin: [0, 0, 0, temComprovante ? 20 : 0]
                });
            }

            if (temComprovante) {
                content.push({
                    image: dataFinal.motorista.comprovanteRs,
                    width: 480,
                    alignment: 'center',
                    margin: [0, 0, 0, 0]
                });
            }
        }

        // Página 2: CRLV Cavalo (página inteira)
        if (temCRLVCavalo) {
            content.push({ text: '', pageBreak: 'before' });
            
            content.push({
                image: dataFinal.cavalo.arqCrlv,
                width: 520,
                alignment: 'center',
                margin: [0, 20, 0, 0]
            });
        }

        // Página 3: CRLV Reboque (página inteira)
        if (temCRLVReboque) {
            content.push({ text: '', pageBreak: 'before' });
            
            content.push({
                image: dataFinal.reboque.arqCrlv,
                width: 520,
                alignment: 'center',
                margin: [0, 20, 0, 0]
            });
        }

        const docDefinition = {
            content,
            pageSize: 'A4',
            pageMargins: [30, 40, 30, 40],
            styles: {
                mainHeader: {
                    fontSize: 16,
                    bold: true,
                    color: '#000000'
                },
                sectionHeader: {
                    fontSize: 12,
                    bold: true,
                    color: '#000000',
                    margin: [0, 0, 0, 5]
                },
                documentHeader: {
                    fontSize: 14,
                    bold: true,
                    color: '#333333'
                },
                tableLabel: {
                    fontSize: 10,
                    bold: true,
                    color: '#000000'
                },
                tableValue: {
                    fontSize: 10,
                    color: '#000000'
                }
            },
            defaultStyle: {
                fontSize: 10,
                lineHeight: 1.2
            }
        };

        pdfMake.createPdf(docDefinition).open();
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-blue-600 mb-6">
                    Selecione os documentos que deseja incluir no PDF
                </h2>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-700">Documentos do Motorista</h3>
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="cnh" 
                                    checked={documentosSelecionados.cnh} 
                                    onChange={handleCheckboxChange} 
                                    className="w-4 h-4 text-blue-600" 
                                />
                                <span className="text-gray-700">CNH - Carteira Nacional de Habilitação</span>
                            </label>
                            <label className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="comprovanteResidencia" 
                                    checked={documentosSelecionados.comprovanteResidencia} 
                                    onChange={handleCheckboxChange} 
                                    className="w-4 h-4 text-blue-600" 
                                />
                                <span className="text-gray-700">Comprovante de Residência</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-700">Documentos do Veículo</h3>
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="crlvCavalo" 
                                    checked={documentosSelecionados.crlvCavalo} 
                                    onChange={handleCheckboxChange} 
                                    className="w-4 h-4 text-blue-600" 
                                />
                                <span className="text-gray-700">CRLV Cavalo Mecânico</span>
                            </label>
                            <label className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="crlvReboque" 
                                    checked={documentosSelecionados.crlvReboque} 
                                    onChange={handleCheckboxChange} 
                                    className="w-4 h-4 text-blue-600" 
                                />
                                <span className="text-gray-700">CRLV Reboque/Semirreboque</span>
                            </label>
                        </div>
                    </div>

                    <div className="md:col-span-2 mt-6">
                        <button
                            type="button"
                            onClick={gerarPdf}
                            className="w-full bg-orange-500 text-white py-3 px-6 rounded-md hover:bg-orange-600 transition-colors duration-200 font-semibold text-lg shadow-md hover:shadow-lg"
                        >
                            📄 Gerar PDF dos Documentos
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SelecaoVeiculoPage;