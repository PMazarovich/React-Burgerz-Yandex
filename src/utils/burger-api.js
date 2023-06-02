let NORMA_API = "https://norma.nomoreparties.space/api"

/* we need this function as there may be some cases when we can do some summary basing only on status code (201, 202 etc)
* That's why it is better to parse json in the separate function just like we do with checkReponseStatusCode
*  */
async function parseJsonFromResponse(response) { /* taking Response object */
    const data = await response.json();
    if (data.error) {
        throw new Error("failed to parse json", data.error);
    } else {
        return data
    }
}

function checkReponseStatusCode(response) { /* taking Response object */
    if (response.ok) { /* status codes: 200-299 */
        return response;
    } else {
        throw new Error(`Failed to fetch ingredients. Status code: ${response.status}`); /* this will be caught in catch of the parent function */
    }
}

async function getIngredients() { /* This returns Ingredients data OR throws an error */
    const response = await fetch(`${NORMA_API}/ingredients`);
    let extractedJson = await parseJsonFromResponse(checkReponseStatusCode(response))
    return extractedJson.data
}


async function postOrder(order) { /* This returns order number OR throws an error */
    const response = await fetch(`${NORMA_API}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"ingredients": order})
    });
    // noinspection UnnecessaryLocalVariableJS
    let extractedJson = await parseJsonFromResponse(checkReponseStatusCode(response))
    return extractedJson
}

export {postOrder, getIngredients}

