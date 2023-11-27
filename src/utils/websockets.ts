import {useCallback, useEffect, useRef} from 'react';

// Options for configuring the WebSocket connection
export interface IWSOptions {
    onMessage: (event: MessageEvent<string>) => void;   // Function to handle incoming messages
    onConnect?: (event: Event) => void;                 // Optional function to handle connection established
    onError?: (event: Event) => void;                   // Optional function to handle connection errors
    onDisconnect?: (event: Event) => void;              // Optional function to handle connection closed
}

// Этот хук принимает: url и options, возвращает функцию connect и sendData
export const useSocket = (url: string, options: IWSOptions) => {
    // Используем этот объект WebSocket ВЕЗДЕ в этом компоненте - в useEffect, в useCallback и т.д. Т.е этот объект глобален
    const ws = useRef<WebSocket | null>(null); // Reference to the WebSocket instance By using useRef, we can create a variable that persists across renders.

    // Function to establish a WebSocket connection
    // Since the connect function is passed to child components,
    // memoizing it ensures that the child components do not re-render unnecessarily when the parent component re-renders.
    // Это всего лишь описание функции, которую можно будет потом где-то использовать
    // эта функция создает экземпляр websocket и присваивает некоторые обработчики
    const connect = useCallback(
        (token?: string) => {
            // Create a new WebSocket instance with or without a token in the URL
            if (token) {
                ws.current = new WebSocket(`${url}?token=${token}`);
            } else {
                ws.current = new WebSocket(url)
            }
            ws.current.onmessage = options.onMessage; // Привязываем функцию onmessage из options, т.е. эта функция будет реагировать на входящие сообщения
            // Хендлер вебсокета на открытие соединения
            ws.current.onopen = (event: Event) => {
                // Если есть функция onConnect для вебсокета в options: IWSOptions (см аргументы функции useSocket), передаем event в эту функцияю
                if (typeof options.onConnect === 'function') {
                    options.onConnect(event);
                }
            };

            // Event handler for when the connection is closed
            ws.current.onclose = (event: Event) => {
                // Если есть функция onDisconnect для вебсокета в IWSOptions, передаем event в эту функцию
                if (typeof options.onDisconnect === 'function') {
                    options.onDisconnect(event);
                }
            };

            ws.current.onerror = (event: Event) => {
                if (typeof options.onError === 'function') {
                    options.onError(event);
                }
            };
        },
        // ренинициализируем это всё ТОЛЬКО если изменятся url или options. Так работает useCallback
        [url, options]
    );

    // Effect to handle changes in the options
    // Если options или ws изменились, присваиваем рефу ws новые обработчики
    useEffect(
        () => {
            if (ws.current) {
                if (typeof options.onConnect === 'function') {
                    ws.current.onopen = options.onConnect; // Update the onopen event handler if provided in options
                }
                if (typeof options.onDisconnect === 'function') {
                    ws.current.onclose = options.onDisconnect; // Update the onclose event handler if provided in options
                }
            }
        },
        [options, ws]
    );

    // Effect to clean up the WebSocket connection when the component unmounts
    useEffect(() => {
        return () => {
            if (ws.current && typeof ws.current.close === 'function') {
                ws.current.close(); // Close the WebSocket connection when the component is unmounted
            }
        };
    }, []);

    // Function to send data through the WebSocket connection
    const sendData = useCallback(
        (message: object) => {
            if (ws.current) {
                ws.current.send(JSON.stringify(message));
            }
        },
        [ws]
    );


    return {connect, sendData}; // Return functions for connecting and sending data
};
