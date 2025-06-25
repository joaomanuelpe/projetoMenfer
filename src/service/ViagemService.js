export default class ViagemService {
    #URL = `http://localhost:5000/viagem`;

    get = async () => {
        const res = await fetch(this.#URL, {
            method: `GET`
        });
        const response = await res.json();
        return response;
    }

    insert = async (array) => {
        const res = await fetch(this.#URL, {
            method: `POST`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(array)
        });

        const response = await res.json();
        return response;
    }

    delete = async () => {
        const res = await fetch(this.#URL, {
            method: 'DELETE'
        });

        const response = await res.json();
        return response;
    }
}