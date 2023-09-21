export function getCookie(name: string) {
    const matches = document.cookie.match(
        new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(name: string, value: string | number | boolean | null, props: { [x: string]: any; expires?: any; }) {
    props = props || {};
    let exp = props.expires;
    if (typeof exp == 'number' && exp) {
        const d = new Date();
        d.setTime(d.getTime() + exp * 1000);
        exp = props.expires = d;
    }
    if (exp && exp.toUTCString) {
        props.expires = exp.toUTCString();
    }
    if (value != null){
        value = encodeURIComponent(value);
    }
    let updatedCookie = name + '=' + value;
    for (const propName in props) {
        updatedCookie += '; ' + propName;
        const propValue = props[propName];
        if (propValue !== true) {
            updatedCookie += '=' + propValue;
        }
    }
    document.cookie = updatedCookie;
}

export function extractBearerToken(bearerToken: string) {
    let authToken = null;
    // Ищем интересующий нас заголовок
    if (bearerToken.includes('Bearer')){
        authToken = bearerToken.split('Bearer ')[1];
    }
    return authToken
}

export function deleteCookie(name: string) {
    // Находим куку по ключу token, удаляем её значение,
    // устанавливаем отрицательное время жизни, чтобы удалить сам ключ token
    setCookie(name, null, { expires: -1 });
}
