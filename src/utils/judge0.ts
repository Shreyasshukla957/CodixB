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





