// Used to trigger a input-dialog
const inputElement = document.createElement('input');
inputElement.setAttribute('multiple', 'multiple');
inputElement.setAttribute('type', 'file');
inputElement.style.display = 'none';

/**
 * Opens the file-context and resolves with a list of files or
 * rejects in case the action was cancelled by the user.
 */
export const chooseFiles = (): Promise<FileList> => {
    document.body.appendChild(inputElement);

    return new Promise<FileList>((resolve, reject) => {
        inputElement.click();
        inputElement.onchange = () => {
            document.body.removeChild(inputElement);
            const {files} = inputElement;

            if (files?.length) {
                resolve(files);
            } else {
                reject(new Error('Failed to open dialog, no files selected or dialog cancelled.'));
            }
        };
    });
};
