export const copyToClipboard = (text: string): Promise<void> => {

    // Use native clipboard API if possible
    if ('clipboard' in navigator) {
        return navigator.clipboard.writeText(text);
    }

    // Fallback
    const input = document.createElement('input');
    input.style.opacity = '0';
    input.style.position = 'fixed';
    input.style.zIndex = '-1';
    input.value = text;

    document.body.appendChild(input);
    input.focus();
    input.select();

    return new Promise((resolve, reject) => {
        try {
            if (document.execCommand('copy')) {
                document.body.removeChild(input);
                resolve();
            }

            document.body.removeChild(input);
            reject(new Error('Failed to execute copy command'));
        } catch (err) {
            document.body.removeChild(input);
            reject(err);
        }
    });
};
