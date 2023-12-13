export function generateUUID() {
    const timestamp = new Date().getTime();
    const randomPart = Math.floor(Math.random() * 1000000); // Adjust the range based on your requirements

    return `${timestamp}-${randomPart}`;
}

export function scrollToBottom(element: Element | null) {
    if (!element) {
        return;
    }
    element.scrollTo({
        behavior: 'smooth',
        top: element.scrollHeight
    });
}