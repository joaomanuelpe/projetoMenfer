export default class EmpresaService {
    #URL = `http://localhost:5000/empresa`;

    get = async () => {
        const res = await fetch(this.#URL, {
            method: `GET`
        });
        const response = await res.json();
        return response;
    }

    insert = async (empresa) => {
        const res = await fetch(this.#URL, {
            method: `POST`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(empresa)
        });

        const response = res.json();
        return response;
    }

    update = async (empresa) => {
        const res = await fetch(this.#URL, {
            method: `PUT`,
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(empresa)
        });

        const response = res.json();
        return response;
    }

    delete = async (cnpj) => {
        const res = await fetch(this.#URL + "/" + encodeURIComponent(cnpj), {
            method: 'DELETE'
        });

        const response = await res.json();
        return response;
    }

}