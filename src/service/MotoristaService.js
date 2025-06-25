export default class MotoristaService {
    #URL = `http://localhost:5000/motorista`;

    get = async () => {
        const res = await fetch(this.#URL, {
            method: `GET`
        });
        const response = await res.json();
        return response;
    }

    insert = async (motorista) => {
        const res = await fetch(this.#URL, {
            method: `POST`,
            body: motorista
        });

        const response = res.json();
        return response;
    }

    update = async (motorista) => {
        const res = await fetch(this.#URL, {
            method: `PUT`,
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(motorista)
        });

        const response = res.json();
        return response;
    }

    delete = async (cpf) => {
        const res = await fetch(this.#URL + "/" + cpf, {
            method: 'DELETE'
        });

        const response = await res.json();
        return response;
    }
}