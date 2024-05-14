import React, { useEffect, useState } from 'react';
import './photo-upload.scss';
import { updateImageDisplay } from '../../../helpers/fuji-exif';
import styled from 'styled-components';

const Main = styled.div`
  display: flex;
  flex-direction: column;
`;
const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const ImageDiv = styled.div`
  display: flex;
  margin: '10px';
  background-color: #fff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  text-align: center;
  font-size: 20px;
  padding: 10px;
  margin: 10px;
  box-sizing: border-box;
  max-width: 800px;
`;

const PhotoUpload = ({socket = {}}) => {
  // const socket = useSocket();
  const [title, setTitle] = useState('');
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    setTitle('PhotoUpload');
  }, []);
  useEffect(() => {
    if (socket.id) {
        console.log('🪵 ~ file: photo-upload.js:15 ~ useEffect ~ socket.id:', socket.id);
        socket.connection.emit('getImages');
        socket.connection.on('updateImageList', (data) => {
            // debugger;
            setImageList(data?.images);
        });
    }
}, [socket.id]);



  const onPhotoUploaded = (imageData, data) => {
    window.open(imageData.url, '_blank');
    console.log('🪵 ~ file: photo-upload.js:14 ~ PhotoUpload ~ data:', data);

  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const inputTarget = event.target;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const extension = file.name.split('.').pop();
      // const imageBuffer = Buffer.from(reader.result.split(',')[1], 'base64');
      const arrayBuffer = reader.result;
      // debugger;
      const exif = await updateImageDisplay(inputTarget);
      // const exif = {};
      // const tagSet  = handleBinaryFile(0, arrayBuffer);
      // const exif = metadata_extract(0, file, tagSet);
      console.log('🪵 ~ file: photo-upload.js:38 ~ handleFileChange ~ dataTemp:', exif);
      socket.connection.emit('uploadPhoto', file.name, arrayBuffer, extension, exif, onPhotoUploaded);
    };
    // reader.readAsDataURL(file);
    reader.readAsArrayBuffer(file);
  };

  return (
    <Main className="photo-upload">
      <h1>Hello {title}</h1>
      <input type="file" id="image_uploads" name="image_uploads" accept="image/jpeg,image/heif,.HIF,.RAF" onChange={handleFileChange} ></input>
      <ImageContainer>
        {
          imageList?.map((item) => {
            return <ImageDiv key={item.id}>
              <a href={item.url} target="_blank" >
                <img alt={item.id} src={item.thumbnail}/>
              </a>
              
            </ImageDiv>;
        })
        }

      </ImageContainer>

    </Main>
  );
};

export default PhotoUpload;
