import axios from "axios";

type datais = "javascript" | "python" | "java" | "cpp";


export const languageId = (data: string) => {

    const langdata = data.toLowerCase()

    const id: Record<datais, number> = {
        "javascript": 102,
        "python": 113,
        "java": 91,
        "cpp": 105,
    }

    if (!(langdata in id)) {
        throw new Error("Unsupported language");
    }


    return id[langdata as datais];
}


// langdata ka type string h kyunki .toLowerCase() string hi written krta h aur meine return mein id[langdata] sirf likhta toh error deta typescript kyunki ts ka kehna h object "id" k andar sirf 4 value h aur agar langdata maan lete h koi aisa value hua jo object "id" mein nahi h toh ? ts ka kehna h mein kaise maanlu langdata inn 4 key mein se hi koi h ? toh humein ts ko kehna pdta h trust me langdata jo h inhi 4 value mein se koi h , isiliye return id[langdata as datais] ka matlab langdata string toh h par datais mein se.


interface Judge0Submission {
    source_code: string;
    language_id: number;
    stdin: string;
    expected_output: string;
}


export const submitBatch = async (submissions: Judge0Submission[]) => {


    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            base64_encoded: 'true'
        },
        headers: {
            'x-rapidapi-key': process.env.Judge0_API_KEY as string,
            'x-rapidapi-host': process.env.Judge0_Host as string,
            'Content-Type': 'application/json'
        },
        data: {
            submissions
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    return await fetchData();


}

export const delay = async (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("done");
        }, ms);
    });

}




export const submitToken = async (resulttoken: string[]) => {


    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            tokens: resulttoken.join(","),
            base64_encoded: 'true',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': process.env.Judge0_API_KEY as string,
            'x-rapidapi-host': process.env.Judge0_Host as string,
            'Content-Type': 'application/json'
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    while (true) {

        const result = await fetchData();

        const isResultObtained = result.submissions.every((element: { status_id: number }) => element.status_id > 2);

        if (isResultObtained) {
            return result.submissions;
        }

        await delay(1000);

    }

}


