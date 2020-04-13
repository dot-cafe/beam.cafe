export const upload = (
    url: string,
    file: File,
    cb?: (done: number, total: number) => void
): Promise<void> => {
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {

        if (cb) {
            let transferred = 0;
            xhr.upload.onprogress = ({loaded, total}) => {
                transferred += loaded;
                cb(transferred, total);
            };
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve();
                } else {
                    reject();
                }
            }
        };

        xhr.open('POST', url, true);
        xhr.send(file);
    });
};
