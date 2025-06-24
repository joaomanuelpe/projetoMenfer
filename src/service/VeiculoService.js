export default class VeiculoService {
    #URL = `http://localhost:5000/veiculo`;

    get = async () => {
        const res = await fetch(this.#URL, {
            method: `GET`
        });
        const response = await res.json();
        return response;
    }

    insert = async (veiculo) => {
        const res = await fetch(this.#URL, {
            method: `POST`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(veiculo)
        });

        const response = res.json();
        return response;
    }

    update = async (veiculo) => {
        const res = await fetch(this.#URL, {
            method: `PUT`,
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(veiculo)
        });

        const response = res.json();
        return response;
    }

    delete = async (placa) => {
        const res = await fetch(this.#URL + "/" + placa, {
            method: 'DELETE'
        });

        const response = await res.json();
        return response;
    }
}