import React, { FC } from 'react';

interface UploaderProps {
    description: string;
}

const Uploader: FC<UploaderProps> = ({ description }) => {
    function handleFileChange(event) {

    }

    return (
        <>
            <div>
                <input type="file" onChange={handleFileChange} />
                <p>{description}</p>
                {/* display the new file name here */}
                {/* allow the user to download the CAR file */}
                {/* <a href={csvFile.URL} download>Download CAR File</a> */}
            </div>
        </>
    );
};

export default Uploader;
