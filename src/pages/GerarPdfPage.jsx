import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SelecaoVeiculoPage from "../components/CarregarDocs";
import MotoristaService from "../service/MotoristaService.js";
import VeiculoService from "../service/VeiculoService.js";

export default function TelaSelecao() {
    const [telaItens, setTelaItens] = useState(false);
    const [motoristas, setMotoristas] = useState([]);
    const [cavalos, setCavalos] = useState([]);
    const [reboques, setReboques] = useState([]);
    const veiculoService = new VeiculoService();
    const motoristaService = new MotoristaService();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cavalo = await veiculoService.getCavalo();
                const reboque = await veiculoService.getReboque();
                const motorista = await motoristaService.get();

                setCavalos(cavalo);
                setReboques(reboque);
                setMotoristas(motorista);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

        fetchData();
    }, []);

    const [formData, setFormData] = useState({
        motorista: '',
        cavalo: '',
        reboque: '',
    });

    const [dataFinal, setDataFinal] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleConfirmarSelecao = (e) => {
        e.preventDefault();
        const motoristaSelecionado = motoristas.find(m => m.cpf === formData.motorista);
        const cavaloSelecionado = cavalos.find(c => c.placa === formData.cavalo);
        const reboqueSelecionado = reboques.find(r => r.placa === formData.reboque);
        const dadosSelecionados = {
            motorista: motoristaSelecionado,
            cavalo: cavaloSelecionado,
            reboque: reboqueSelecionado
        };
        console.log(dadosSelecionados);
        setDataFinal(dadosSelecionados);
        setTelaItens(true);
    };

    const handleVoltarHome = () => {
        navigate("/home");
    };

    if (!telaItens)
        return (
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center mb-6">
                        <button
                            onClick={handleVoltarHome}
                            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mr-4"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Voltar
                        </button>
                        <h2 className="text-2xl font-semibold text-blue-600">Selecione para gerar os documentos</h2>
                    </div>

                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Motorista</label>
                            <select
                                name="motorista"
                                value={formData.motorista}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            >
                                <option value="">Selecione um motorista</option>
                                {motoristas.map((motorista) => (
                                    <option key={motorista.cpf} value={motorista.cpf}>
                                        {motorista.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cavalo</label>
                            <select
                                name="cavalo"
                                value={formData.cavalo}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            >
                                <option value="">Selecione um cavalo</option>
                                {cavalos.map((cavalo) => (
                                    <option key={cavalo.placa} value={cavalo.placa}>
                                        {cavalo.placa}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Reboque</label>
                            <select
                                name="reboque"
                                value={formData.reboque}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            >
                                <option value="">Selecione um reboque</option>
                                {reboques.map((reboque) => (
                                    <option key={reboque.placa} value={reboque.placa}>
                                        {reboque.placa}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <button
                                onClick={handleConfirmarSelecao}
                                type='submit'
                                className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-200"
                            >
                                Confirmar Seleção
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    else
        return (
            <SelecaoVeiculoPage telaItens={telaItens}
                dataFinal={dataFinal}
                setTelaItens={setTelaItens}
                motoristas={motoristas}
                cavalos={cavalos}
                reboques={reboques}
                formData={formData} />
        );
}